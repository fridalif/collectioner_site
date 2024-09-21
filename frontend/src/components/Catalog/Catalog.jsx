import styles from './Catalog.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";

const serverUrl  = 'http://127.0.0.1:8080';
export function Catalog(){

    const [worldPart, setWorldPart] = useState(null);
    const [country, setCountry ] = useState(null);
    const [historyMoment, setHistoryMoment] = useState(null);
    const [filters, setFilters] = useState(null);
    const [countries, setCountries] = useState([]);
    const [historyMoments, setHistoryMoments] = useState([]);
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(()=>{
        axios.get(serverUrl + '/api/get_other_filters/', { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {
                console.log(response.data.data);
                setFilters(response.data.data);
                return;
            }
            else {
                alert(response.data.message);
            }
        })
        .catch((err) => console.error(err))    
    },[])

    useEffect(()=>{
        setCountry(null);
        if (worldPart === null) {
            setCountries(null);
            return;
        }
        axios.get(serverUrl + '/api/get_countries/?world_part=' + worldPart, { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {
                console.log(response.data.data);
                setCountries(response.data.data);
            }
            else {
                alert(response.data.message);
            }
        })
        .catch((err) => console.error(err))
    },[worldPart])

    useEffect(()=>{
        setHistoryMoment(null);
        if (country === null) {
            setHistoryMoments(null);
            return;
        }
        axios.get(serverUrl + '/api/get_history_moments/?country_id=' + country, { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {
                console.log(response.data.data);
                setHistoryMoments(response.data.data);
                return;
            }
            else {
                alert(response.data.message);
            }
        })
        .catch((err) => console.error(err))
    },[country])

    const getItems = ()=> {
        let resultUrl = serverUrl + '/api/get_items/'
        let offset = (currentPage-1)*12;
        let limit = 12;
        resultUrl += `?offset=${offset}&limit=${limit}`
        if (historyMoment!==null && historyMoment!==''){
            resultUrl += `&history_moment=${historyMoment}`;
        }
        else if (country!==null && country!==''){
            resultUrl += `&country=${country}`;
        }
        else if (worldPart!==null){
            resultUrl += `&world_part=${worldPart}`;
        }
        let category = document.getElementById('selectCategory').value;
        if (category !== ''){
            resultUrl += `&category=${category}`;
        }
        let yearGe = document.getElementById('year_ge').value;
        let yearLe = document.getElementById('year_le').value;
        if (yearGe !== ''){
            resultUrl += `&year_ge=${yearGe}`;
        }
        if (yearLe !== ''){
            resultUrl += `&year_le=${yearLe}`;
        }
        let emission = document.getElementById('selectEmission').value;
        let format = document.getElementById('selectFormat').value;
        let stamp = document.getElementById('selectStamp').value;
        let color = document.getElementById('selectColor').value;
        let glue = document.getElementById('selectGlue').value;
        let press = document.getElementById('selectPress').value;
        let watermark = document.getElementById('selectWatermark').value;
        let currency = document.getElementById('selectCurrency').value;
        let theme = document.getElementById('selectTheme').value;
        let catalog = document.getElementById('selectCatalog').value;
        let nominalGe = document.getElementById('nominal_ge').value;
        let nominalLe = document.getElementById('nominal_le').value;

        if (emission !== ''){
            resultUrl += `&emissions=${emission}`;
        }
        if (format !== ''){
            resultUrl += `&formats=${format}`;
        }
        if (stamp !== ''){
            resultUrl += `&stamps=${stamp}`;
        }
        if (color !== ''){
            resultUrl += `&colors=${color}`;
        }
        if (glue !== ''){
            resultUrl += `&glues=${glue}`;
        }
        if (press !== ''){
            resultUrl += `&press=${press}`;
        }
        if (watermark !== ''){
            resultUrl += `&watermarks=${watermark}`;
        }
        if (currency !== ''){
            resultUrl += `&currencies=${currency}`;
        }
        if (theme !== ''){
            resultUrl += `&themes=${theme}`;
        }
        if (catalog !== ''){
            resultUrl += `&catalogs=${catalog}`;
        }
        if (nominalGe !== ''){
            resultUrl += `&nominal_ge=${nominalGe}`;
        }
        if (nominalLe !== ''){
            resultUrl += `&nominal_le=${nominalLe}`;
        }
        console.log(resultUrl);
        axios.get(resultUrl, { withCredentials: true })
            .then((response) => {
                if (response.data.status === 'ok' && response.data.data.length === 0) {
                    setTotalItems(0);
                    setItems([]);
                    return;
                }
                if (response.data.status === 'ok') {
                    let items_ids = []
                    for (let i = 0; i < response.data.data.length; i++){
                        items_ids.push(response.data.data[i].id)
                    }
                    axios.get(`${serverUrl}/api/get_item_image_urls/`, {params: {items_ids: items_ids, only_main: true}})
                        .then(response_images => {
                            if (response_images.data.status !== 'ok'){
                                alert(response_images.data.message);
                                return;
                            }
                            for (let i = 0; i < response.data.data.length; i++){
                                for (let j = 0; j < response_images.data.data.length; j++){
                                    if (response.data.data[i].id === response_images.data.data[j].item_id){
                                        response.data.data[i].image_url = response_images.data.data[j].image_url
                                    }
                                }
                            }
                            console.log(response.data);
                            setItems(response.data.data);
                        })
                        .catch(error => console.error(error))
                    setTotalItems(response.data.total);    
                    return;
                }
                else {
                    alert(response.data.message);
                }
            })
            .catch((err) => console.error(err))
        
    }
    
    useEffect(()=>{
        getItems();
    },[currentPage])
    

    const nextPage = () => {
        if (currentPage<Math.trunc(totalItems/12)+1){
            setCurrentPage(currentPage+1);
        }
    }

    const prevPage = () => {
        if (currentPage>1){
            setCurrentPage(currentPage-1);
        }
    }

    return(
        <div className={styles.catalogContainer}>
            <div className={styles.catalogSideBar}>
                <div className={styles.catalogFilters}>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Часть света:<br />
                        <form>
                            <input type='radio' name='world_part' value='eu' onClick={()=>setWorldPart('eu')}/> Европа <br />
                            <input type='radio' name='world_part' value='as' onClick={()=>setWorldPart('as')}/> Азия <br />
                            <input type='radio' name='world_part' value='af' onClick={()=>setWorldPart('af')}/> Африка <br />
                            <input type='radio' name='world_part' value='am' onClick={()=>setWorldPart('am')}/> Америка <br />
                            <input type='radio' name='world_part' value='ok' onClick={()=>setWorldPart('ok')}/> Океания <br />
                        </form>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Страна:<br />
                        <select id='selectCountry' className={styles.selecter} onChange={()=>setCountry(document.getElementById('selectCountry').value)}>
                            <option value=''>{worldPart !== null ? <>Страна</> : <>Выберите часть света</>}</option>
                            {countries !== null && countries.map((new_country)=>{return <option value={new_country.id}>{new_country.name}</option>})}
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Исторический этап: <br />
                        <select id='selectHistoryMoment' className={styles.selecter} onChange={()=>setHistoryMoment(document.getElementById('selectHistoryMoment').value)}>
                            <option value=''>{country === null ? <>Выберите страну</>:<>Исторический этап</>}</option>
                            {historyMoments !== null && historyMoments.map((historyMoment)=>{return <option value={historyMoment.id}>{historyMoment.name}</option>})}
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Категория: <br />
                        <select id='selectCategory' className={styles.selecter}>
                            <option value=''> Все </option>
                            <option value='mark'> Марка </option>
                            <option value='philatel'>Филателистический продукт</option>
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Год: <br />
                        <div className={styles.inputFromTo}>
                            <div className={styles.inputFrom}>От <input type="number" className={styles.inputFromToField} id='year_ge'/></div>
                            <div className={styles.inputFrom}>До <input type="number" className={styles.inputFromToField} id='year_le'/></div>
                        </div>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Эмиссия: <br />
                        <select id='selectEmission' className={styles.selecter}>
                            <option value=''> Все </option>
                            {filters && filters.emissions && filters.emissions.map((item)=>{
                                return(
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Формат: <br />
                        <select id='selectFormat' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.formats && filters.formats.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Печать: <br />
                        <select id='selectStamp' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.stamps && filters.stamps.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Цвет: <br />
                        <select id='selectColor' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.colors && filters.colors.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Клей: <br />
                        <select id='selectGlue' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.glues && filters.glues.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Типография: <br />
                        <select id='selectPress' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.press && filters.press.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Водяной знак: <br />
                        <select id='selectWatermark' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.watermarks && filters.watermarks.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Валюта: <br />
                        <select id='selectCurrency' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.currencies && filters.currencies.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Тема: <br />
                        <select id='selectTheme' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.themes && filters.themes.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Каталог: <br />
                        <select id='selectCatalog' className={styles.selecter}>
                            <option value=''> Все </option>
                            {
                                filters && filters.catalogs && filters.catalogs.map((item)=>{
                                    return(
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Номинал: <br />
                        <div className={styles.inputFromTo}>
                            <div className={styles.inputFrom}>От <input type="text" className={styles.inputFromToField} id='nominal_ge'/></div>
                            <div className={styles.inputFrom}>До <input type="text" className={styles.inputFromToField} id='nominal_le'/></div>
                        </div>
                    </div>
                </div>
                <div className={styles.catalogCommitFilters} onClick={() => getItems()}>
                    Применить фильтры
                </div>
            </div>
            <div className={styles.catalogContent}>
                <div className={styles.catalogContentRow}>
                    {
                        items.map((item,index)=>{
                            if (index<6){
                            return(
                                <div className={styles.lastAddedMarksMark}>
                                    <img src={item.image_url} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                                    <div className={styles.lastAddedMarksMarkText} id={item.id}>
                                        {item.name}
                                    </div>
                                </div>
                            )
                            }
                        })
                    }
                    
                </div>
                <div className={styles.catalogContentRow}>
                    {
                        items.map((item,index)=>{
                            if (index>=6){
                            return(
                                <div className={styles.lastAddedMarksMark}>
                                    <img src={item.image_url} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                                    <div className={styles.lastAddedMarksMarkText} id={item.id}>
                                        {item.name}
                                    </div>
                                </div>
                            )
                            }
                        })
                    }
                    
                </div>
                <div className={styles.paginationRow}>
                    { totalItems>12  &&
                        <div className={currentPage == 1 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => prevPage()}>
                            <IoIosArrowDropleftCircle />
                        </div>
                    }
                    {totalItems>12 &&
                        <>
                            <div className={currentPage == 1 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(1)}>
                                1
                            </div>
                            <div className={currentPage == 2 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(2)}>
                                2
                            </div>
                        </>
                    }
                    {
                        currentPage-2 > 2 &&
                        <>
                            <div className={styles.paginationCell}>
                                ...
                            </div>
                            <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage-2)}>
                                {currentPage-2}
                            </div>
                        </>
                    }
                    {
                        currentPage-1 > 2 &&
                        <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage-1)}>
                            {currentPage-1}
                        </div>
                    }
                    {
                        currentPage > 2 && currentPage < Math.trunc(totalItems/12) &&
                        <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage)}>
                            {currentPage}
                        </div>
                    }
                    {
                        currentPage+1 < Math.trunc(totalItems/12) &&
                        <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage+1)}>
                            {currentPage+1}
                        </div>
                    }
                    {
                        currentPage+2 < Math.trunc(totalItems/12) &&
                        <>
                            <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage+2)}>
                                {currentPage+2}
                            </div>
                            <div className={styles.paginationCell}>
                                ...
                            </div>
                        </>
                    }
                    {
                        totalItems>36 && totalItems<=48 &&
                        <div className={currentPage == 3 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(3)}>
                            3
                        </div>
                    }
                    {totalItems>48 &&
                        <>
                            <div className={currentPage == Math.trunc(totalItems/12) ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(Math.trunc(totalItems/12))}>
                                {Math.trunc(totalItems/12)}
                            </div>
                            <div className={currentPage == Math.trunc(totalItems/12)+1 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(Math.trunc(totalItems/12)+1)}>
                                {Math.trunc(totalItems/12)+1}
                            </div>
                        </>
                    }

                    { totalItems>12  &&
                        <div className={currentPage == (Math.trunc(totalItems/12)+1) ?styles.paginationCellChosen : styles.paginationCell} onClick={() => nextPage()}>
                            <IoIosArrowDroprightCircle />
                        </div>
                    }
                </div>
            </div>
            
        </div>
        
    )
}