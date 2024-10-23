import styles from './Catalog.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { MessageBoxError, MessageBoxGood } from '../MessageBox/MessageBox.jsx';
import { useWindowSize } from "@uidotdev/usehooks";

const serverUrl  = 'http://127.0.0.1:8080';
export function Catalog(){
    const [searchQuery, setSearchQuery] = useState(null);
    const [worldPart, setWorldPart] = useState('all');
    const [country, setCountry ] = useState(null);
    const [historyMoment, setHistoryMoment] = useState(null);
    const [filters, setFilters] = useState(null);
    const [countries, setCountries] = useState([]);
    const [historyMoments, setHistoryMoments] = useState([]);
    const size = useWindowSize();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [ messages, setMessages ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);
    const [ itemsCounterPage, setItemsCounterPage ] = useState(4);
    const [ countryChosen, setCountryChosen ] = useState(false);
    const [ helpVariants, setHelpVariants ] = useState([]);

    useEffect(() => {
        if (size.width <= 1000){
            setItemsCounterPage(Math.floor((size.width-80)/150));
        }
        else if(size.width >= 1500){
            setItemsCounterPage(Math.floor((size.width-80)/250));
        }
        else{
            setItemsCounterPage(Math.floor((size.width-80)/200));
        }
    }, [size]);
    useEffect(()=>{
        if (window.innerWidth<=1000){
            setItemsCounterPage(2);
        }
        const queryParameters = new URLSearchParams(window.location.search)
        let searchQuery_var = queryParameters.get("search_query")
        if (searchQuery_var) {
            setSearchQuery(searchQuery_var);
        }
        axios.get(serverUrl + '/api/get_other_filters/', { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {
                console.log(response.data.data);
                setFilters(response.data.data);
                return;
            }
            else {
                setMessages(response.data.message);
                setMessageCounter(messageCounter + 1);
            }
        })
        .catch((err) => console.error(err))    
    },[])

    useEffect(()=>{
        setCountry(null);
        setCurrentPage(1);
        document.getElementById('countryInput').value = '';
        if (worldPart === null) {
            setCountries(null);
            getItems();
            return;
        }
        getItems();
        axios.get(serverUrl + '/api/get_countries/?world_part=' + worldPart, { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {
                setCountries(response.data.data);
            }
            else {
                setMessages(response.data.message);
                setMessageCounter(messageCounter + 1);
            }
        })
        .catch((err) => console.error(err))
    },[worldPart])

    useEffect(()=>{
        setHistoryMoment(null);
        setCurrentPage(1);
        if (country === null) {
            setHistoryMoments(null);
            getItems();
            return;
        }
        getItems();
        axios.get(serverUrl + '/api/get_history_moments/?country_id=' + country, { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {
                console.log(response.data.data);
                setHistoryMoments(response.data.data);
                return;
            }
            else {
                setMessages(response.data.message);
                setMessageCounter(messageCounter + 1);
            }
        })
        .catch((err) => console.error(err))
    },[country])

    useEffect(()=>{
        getItems();
    },[historyMoment])
    const getItems = ()=> {
        let resultUrl = serverUrl + '/api/get_items/'
        let itemsPerPage = 0
        if (window.innerWidth <= 1000){
            itemsPerPage = Math.floor((window.innerWidth-80)/150);
        }
        else if(window.innerWidth >= 1500){
            itemsPerPage = Math.floor((window.innerWidth-80)/250);
        }
        else{
            itemsPerPage = Math.floor((window.innerWidth-80)/200);
        }
        let offset = (currentPage-1)*itemsPerPage*2;
        let limit = itemsPerPage*2;
        let country_id = null
        if (document.getElementById('countryInput').value !== ''){
            countries.forEach(country => {
                if (country.name === document.getElementById('countryInput').value){
                    country_id = country.id
                    return;
                }
            })
        }
        resultUrl += `?offset=${offset}&limit=${limit}`
        if (historyMoment!==null && historyMoment!==''){
            resultUrl += `&history_moment=${historyMoment}`;
        }
        else if (country_id!==null && country_id!==''){
            resultUrl += `&country=${country_id}`;
        }
    
        else if (worldPart!==null && worldPart!=='all'){
            resultUrl += `&world_part=${worldPart}`;
        }
        if (searchQuery!==null && searchQuery!==''){
            resultUrl += `&query=${searchQuery}`;
        }
        else if (searchQuery === null){
            const queryParameters = new URLSearchParams(window.location.search)
            let searchQuery_var = queryParameters.get("search_query")
            if (searchQuery_var) {
                resultUrl += `&query=${searchQuery_var}`;
            }
        }

        /*let category = document.getElementById('selectCategory').value;
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
        }*/

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
                                setMessages(response_images.data.message);
                                setMessageCounter(messageCounter + 1);
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
                    setMessages(response.data.message);
                    setMessageCounter(messageCounter + 1);
                }
            })
            .catch((err) => console.error(err))
        
    }
    
    useEffect(()=>{
        getItems();
    },[currentPage])
    

    const nextPage = () => {
        if (currentPage<Math.trunc(totalItems/(itemsCounterPage*2))+1){
            setCurrentPage(currentPage+1);
        }
    }

    const prevPage = () => {
        if (currentPage>1){
            setCurrentPage(currentPage-1);
        }
    }

    const settingHelpVariants = (countrySubStr) => {
        if ( countryChosen === true){
            setCountryChosen(false);
        }
        let helpVarsArr = [];
        countries.forEach(country => {
            if (helpVarsArr.length >= 3){
                return;
            }
            if (country.name.includes(countrySubStr)){
                helpVarsArr.push(country);
            }
        })
        setHelpVariants(helpVarsArr);
        console.log(helpVarsArr);
    }
    const setCountryCallback = (countryId, countryName) => {
        setCountry(countryId);
        setCountryChosen(true);
        document.getElementById('countryInput').value = countryName;
    }
    return(
        <div className={styles.catalogContainer}>
            {messages !== '' && <MessageBoxError key={messageCounter} message={messages} displayed={true}/>}
            
            <div className={styles.catalogContent}>
                <div className={styles.catalogContentRowFilter}>
                    <form>
                        <input type='radio' name='world_part' value='all' onClick={()=>setWorldPart('all')} defaultChecked/> Все
                        <input type='radio' name='world_part' value='eu' onClick={()=>setWorldPart('eu')}/> Европа
                        <input type='radio' name='world_part' value='as' onClick={()=>setWorldPart('as')}/> Азия
                        <input type='radio' name='world_part' value='am' onClick={()=>setWorldPart('am')}/> Америка
                        <input type='radio' name='world_part' value='af' onClick={()=>setWorldPart('af')}/> Африка
                        <input type='radio' name='world_part' value='oc' onClick={()=>setWorldPart('oc')}/> Океания 
                    </form>
                    <div>
                        <input type='text' placeholder='Страна' id='countryInput' className={styles.countryInput} onChange={(e)=>settingHelpVariants(e.target.value)}/>
                        {countryChosen == false && <div className={styles.helpBar} id="helpBar" >
                            {helpVariants.map((helpVariant)=>{
                                return <div className={styles.helpVariant} key={helpVariant.id} onClick={()=>setCountryCallback(helpVariant.id, helpVariant.name)}>
                                    {helpVariant.name}
                                </div>
                            })}
                        </div>}
                    </div>
                    <select className={styles.historySelector} id='selectHistoryMoment' onChange={()=>setHistoryMoment(document.getElementById('selectHistoryMoment').value)}>
                        <option value=''>{country === null ? <>Выберите страну</>:<>Исторический этап</>}</option>
                        {historyMoments !== null && historyMoments.map((historyMoment)=>{return <option value={historyMoment.id}>{historyMoment.name}</option>})}
                    </select>
                </div>
                <div className={styles.catalogContentRowSearch}>
                    <input type="text" value={searchQuery} placeholder="Искать в каталоге..." className={styles.secondHeaderSearchfieldInput} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <IoMdSearch className={styles.secondHeaderSearchfieldImg} onClick={() => getItems()}/>
                </div>
                <div className={styles.catalogContentRow}>
                    {
                        items.map((item,index)=>{
                            if (index<itemsCounterPage){
                            return(
                                <div className={styles.lastAddedMarksMark} onClick={()=>window.location.href=`/item?item_id=${item.id}`}>
                                    <div className={styles.lastAddedMarksMarkImgField}>
                                        <img src={item.image_url} width={150} height={150} alt="mark" className={styles.lastAddedMarksMarkImg} />
                                    </div>
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
                            if (index>=itemsCounterPage && index<itemsCounterPage*2){
                            return(
                                <div className={styles.lastAddedMarksMark} onClick={()=>window.location.href=`/item?item_id=${item.id}`}>
                                    <div className={styles.lastAddedMarksMarkImgField}>
                                        <img src={item.image_url} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                                    </div>
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
                    { totalItems>itemsCounterPage*2  &&
                        <div className={currentPage == 1 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => prevPage()}>
                            <IoIosArrowDropleftCircle />
                        </div>
                    }
                    {totalItems>itemsCounterPage*2 &&
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
                        currentPage-2 > 3 &&
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
                        currentPage-1 > 3 &&
                        <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage-1)}>
                            {currentPage-1}
                        </div>
                    }
                    {
                        currentPage > 2 && currentPage < Math.trunc(totalItems/(itemsCounterPage*2)) &&
                        <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage)}>
                            {currentPage}
                        </div>
                    }
                    {
                        currentPage+1 < Math.trunc(totalItems/(itemsCounterPage*2)) && currentPage > 2 &&
                        <div className={styles.paginationCell} onClick={() => setCurrentPage(currentPage+1)}>
                            {currentPage+1}
                        </div>
                    }
                    {
                        currentPage+2 < Math.trunc(totalItems/(itemsCounterPage*2)) && currentPage > 2 &&
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
                        totalItems>(itemsCounterPage*2*2) && totalItems<=(itemsCounterPage*2*3) &&
                        <div className={currentPage == 3 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(3)}>
                            3
                        </div>
                    }
                    {totalItems>(itemsCounterPage*2*3) &&
                        <>
                            <div className={currentPage == Math.trunc(totalItems/(itemsCounterPage*2)) ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(Math.trunc(totalItems/(itemsCounterPage*2)))}>
                                {Math.trunc(totalItems/(itemsCounterPage*2))}
                            </div>
                            <div className={currentPage == Math.trunc(totalItems/(itemsCounterPage*2))+1 ? styles.paginationCellChosen : styles.paginationCell} onClick={() => setCurrentPage(Math.trunc(totalItems/(itemsCounterPage*2))+1)}>
                                {Math.trunc(totalItems/(itemsCounterPage*2))+1}
                            </div>
                        </>
                    }

                    { totalItems>itemsCounterPage*2  &&
                        <div className={currentPage == (Math.trunc(totalItems/(itemsCounterPage*2))+1) ?styles.paginationCellChosen : styles.paginationCell} onClick={() => nextPage()}>
                            <IoIosArrowDroprightCircle />
                        </div>
                    }
                </div>
            </div>
            
        </div>
        
    )
}