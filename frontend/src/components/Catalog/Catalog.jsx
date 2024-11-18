import styles from './Catalog.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";
import { MessageBoxError, MessageBoxGood } from '../MessageBox/MessageBox.jsx';
import { useWindowSize } from "@uidotdev/usehooks";
import { ImCross } from "react-icons/im";

const serverUrl  = 'http://127.0.0.1:8080';
export function Catalog(){
    const [searchQuery, setSearchQuery] = useState(null);
    const [worldPart, setWorldPart] = useState('all');
    const [country, setCountry ] = useState(null);
    const [historyMoment, setHistoryMoment] = useState(null);
    const [filters, setFilters] = useState(null);
    const [countries, setCountries] = useState([]);
    const [historyMoments, setHistoryMoments] = useState(null);
    const size = useWindowSize();
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [ messages, setMessages ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);
    const [ itemsCounterPage, setItemsCounterPage ] = useState(4);
    const [ countryChosen, setCountryChosen ] = useState(false);
    const [ helpVariants, setHelpVariants ] = useState([]);
    const [ showFilters, setShowFilters ] = useState(false);
    const [emission, setEmissions] = useState(null);
    const [format, setFormat] = useState(null);
    const [stamp, setStamp] = useState(null);
    const [color, setColor] = useState(null);
    const [glue, setGlue] = useState(null);
    const [press, setPress] = useState(null);
    const [watermark, setWatermark] = useState(null);
    const [currency, setCurrency] = useState(null);
    const [theme, setTheme] = useState(null);
    const [catalog, setCatalog] = useState(null);
    const [nominalGe, setNominalGe] = useState(null);
    const [nominalLe, setNominalLe] = useState(null);
    const [yearLe, setYearsLe] = useState(null);
    const [yearGe, setYearsGe] = useState(null);
    const [category, setCategory] = useState(null);
    const [showCountries, setShowCountries] = useState(false);
    const [ filteredCountries, setFilteredCountries ] = useState([]);
    const [ countriesPerRow, setCountriesPerRow ] = useState(4);
    const [ countriesAndHistoryMoments, setCountriesAndHistoryMoments ] = useState([]);

    const filterCountries = (searchQuery) => {
        let result = [];
        if (searchQuery === '' || searchQuery === null || searchQuery === undefined) {
            console.log(countriesAndHistoryMoments)
            setFilteredCountries(countriesAndHistoryMoments);
            return;
        }
        countriesAndHistoryMoments.forEach(countryAndHistoryMoment => {
            if (countryAndHistoryMoment.country.name.toLowerCase().includes(searchQuery.toLowerCase()) || countryAndHistoryMoment.history_moment.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                result.push(countryAndHistoryMoment);
            }
        })
        setFilteredCountries(result);
    }
    useEffect(() => {
        setCountriesPerRow(Math.floor((size.width-80)/300))
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
        setShowCountries(true)
        document.getElementById('countryInput').value = '';
        setItems(null);
        axios.get(serverUrl + '/api/get_countries/?world_part=' + worldPart, { withCredentials: true })
        .then((response) => {
            if (response.data.status === 'ok') {

                setCountries(response.data.data);
                return;
            }
            else {
                setMessages(response.data.message);
                setMessageCounter(messageCounter + 1);
            }
        })
        .catch((err) => console.error(err))
    },[worldPart])


    useEffect(() => {
        if (countries === null) {
            return;
        }
        let res = [];
        let promises = countries.map((country) => {
            const countryData = {
                country: { name: country.name, id: country.id, counter: country.items_count, flag_url: country.image_url },
                history_moment: { name: country.name, id: country.id, counter: country.items_count }
            };
            res.push(countryData);
            return axios.get(serverUrl + '/api/get_history_moments/?country_id=' + country.id, { withCredentials: true })
                .then((response) => {
                    if (response.data.status === 'ok') {
                        response.data.data.forEach((history_moment) => {
                            res.push({
                                country: { name: country.name, id: country.id, counter: country.items_count, flag_url: country.image_url },
                                history_moment: { name: history_moment.name, id: history_moment.id, counter: history_moment.items_count }
                            });
                        });
                    } else {
                        setMessages(response.data.message);
                        setMessageCounter(prev => prev + 1); // Изменение состояния с использованием функции
                    }
                    return countryData; // Возвращаем данные о стране
                })
                .catch((err) => console.error(err));
        });
    
        Promise.all(promises).then(() => {
            // Сортируем после завершения всех запросов
            res.sort((a, b) => a.country.name.localeCompare(b.country.name));
            setCountriesAndHistoryMoments(res);
            
        });
    
    }, [countries]);

    useEffect(()=>{
        if (countriesAndHistoryMoments === null) {
            return;
        }
        filterCountries(document.getElementById('countryInput').value);
    },[countriesAndHistoryMoments])

    useEffect(()=>{
        if (historyMoment === null && country === null) {
            return
        }
        getItems();
    },[historyMoment,country])
    const getItems = ()=> {
        setShowCountries(false);
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

        resultUrl += `?offset=${offset}&limit=${limit}`
        if (historyMoment!==null && historyMoment!==''){
            resultUrl += `&history_moment=${historyMoment}`;
        }
        else if (country!==null && country!==''){
            resultUrl += `&country=${country}`;
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

        if (category !== null){
            resultUrl += `&category=${category}`;
        }

        if (yearGe !== null){
            resultUrl += `&year_ge=${yearGe}`;
        }
        if (yearLe !== null){
            resultUrl += `&year_le=${yearLe}`;
        }

        if (emission !== null){
            resultUrl += `&emissions=${emission}`;
        }
        if (format !== null){
            resultUrl += `&formats=${format}`;
        }
        if (stamp !== null){
            resultUrl += `&stamps=${stamp}`;
        }
        if (color !== null){
            resultUrl += `&colors=${color}`;
        }
        if (glue !== null){
            resultUrl += `&glues=${glue}`;
        }
        if (press !== null){
            resultUrl += `&press=${press}`;
        }
        if (watermark !== null){
            resultUrl += `&watermarks=${watermark}`;
        }
        if (currency !== null){
            resultUrl += `&currencies=${currency}`;
        }
        if (theme !== null){
            resultUrl += `&themes=${theme}`;
        }
        if (catalog !== null){
            resultUrl += `&catalogs=${catalog}`;
        }
        if (nominalGe !== null){
            resultUrl += `&nominal_ge=${nominalGe}`;
        }
        if (nominalLe !== null){
            resultUrl += `&nominal_le=${nominalLe}`;
        }

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
        if (searchQuery === null && country === null && emission === null && format === null && stamp === null && color === null && 
            glue === null && press === null && watermark === null && currency === null && theme === null && catalog === null &&
            nominalGe === null && nominalLe === null && yearGe === null && yearLe === null && category === null
        ){
            return
        }
        getItems();
    },[currentPage])
    
    const commitFilters = () => {
        let categoryLet = document.getElementById('selectCategory').value;
        if (categoryLet == ''){
            categoryLet = null;
        }
        let yearGeLet = document.getElementById('year_ge').value;
        let yearLeLet = document.getElementById('year_le').value;
        if (yearGeLet == ''){
            yearGeLet = null;
        }
        if (yearLeLet == ''){
            yearLeLet = null;
        }
        let emissionLet = document.getElementById('selectEmission').value;
        if (emissionLet == ''){
            emissionLet = null;
        }
        let formatLet = document.getElementById('selectFormat').value;
        if (formatLet == ''){
            formatLet = null;
        }
        let stampLet = document.getElementById('selectStamp').value;
        if (stampLet == ''){
            stampLet = null;
        }
        let colorLet = document.getElementById('selectColor').value;
        if (colorLet == ''){
            colorLet = null;
        }
        let glueLet = document.getElementById('selectGlue').value;
        if (glueLet == ''){
            glueLet = null;
        }
        let pressLet = document.getElementById('selectPress').value;
        if (pressLet == ''){
            pressLet = null;
        }
        let watermarkLet = document.getElementById('selectWatermark').value;
        if (watermarkLet == ''){
            watermarkLet = null;
        }
        let currencyLet = document.getElementById('selectCurrency').value;
        if (currencyLet == ''){
            currencyLet = null;
        }
        let themeLet = document.getElementById('selectTheme').value;
        if (themeLet == ''){
            themeLet = null;
        }
        let catalogLet = document.getElementById('selectCatalog').value;
        if (catalogLet == ''){
            catalogLet = null;
        }
        let nominalGeLet = document.getElementById('nominal_ge').value;
        if (nominalGeLet == ''){
            nominalGeLet = null;
        }
        let nominalLeLet = document.getElementById('nominal_le').value;
        if (nominalLeLet == ''){
            nominalLeLet = null;
        }

        setCategory(categoryLet);
        setYearsGe(yearGeLet);
        setYearsLe(yearLeLet);
        setEmissions(emissionLet);
        setFormat(formatLet);
        setStamp(stampLet);
        setColor(colorLet);
        setGlue(glueLet);
        setPress(pressLet);
        setWatermark(watermarkLet);
        setCurrency(currencyLet);
        setTheme(themeLet);
        setCatalog(catalogLet);
        setNominalGe(nominalGeLet);
        setNominalLe(nominalLeLet);
        
    }
    useEffect(() => {
        if (searchQuery === null && country === null && emission === null && format === null && stamp === null && color === null && 
            glue === null && press === null && watermark === null && currency === null && theme === null && catalog === null &&
            nominalGe === null && nominalLe === null && yearGe === null && yearLe === null && category === null
        ){
            return
        }
        getItems();
    },[itemsCounterPage])
    useEffect(() => {
        if (showFilters){
            if (!(searchQuery === null && country === null && emission === null && format === null && stamp === null && color === null && 
                glue === null && press === null && watermark === null && currency === null && theme === null && catalog === null &&
                nominalGe === null && nominalLe === null && yearGe === null && yearLe === null && category === null
            )){
                getItems();
            }
            
            setShowFilters(false);
        }
    }, [category, yearGe, yearLe, emission, format, stamp, color, glue, press, watermark, currency, theme, catalog, nominalGe, nominalLe])
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
                {showFilters &&
                <div className={styles.filtersMenu}>
                    <div className={styles.catalogContentRowFilterHeader}>
                        <ImCross className={styles.crossIco} onClick={()=>setShowFilters(false)}/>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Категория:

                        <select id='selectCategory' className={styles.selecter}>

                        <option value=''> Все </option>

                        <option value='mark'> Марка </option>

                        <option value='philatel'>Филателистический продукт</option>

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Год: 

                        <div className={styles.inputFromTo}>
                            <div className={styles.inputFrom}>От <input type="number" className={styles.inputFromToField} id='year_ge' defaultValue={yearGe}/></div>
                            <div className={styles.inputFrom}>До <input type="number" className={styles.inputFromToField} id='year_le' defaultValue={yearLe}/></div>
                        </div>

                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Эмиссия:

                        <select id='selectEmission' className={styles.selecter}>

                        <option value=''> Все </option>

                        {filters && filters.emissions && filters.emissions.map((item)=>{
                            if (emission==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })}

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Формат: 

                        <select id='selectFormat' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.formats && filters.formats.map((item)=>{
                            if (format==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Печать: 

                        <select id='selectStamp' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.stamps && filters.stamps.map((item)=>{
                            if (stamp==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Цвет:

                        <select id='selectColor' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.colors && filters.colors.map((item)=>{
                            if (color==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>

                    </div>
                    <div className={styles.catalogContentRowFilter}>
                        Клей: 

                        <select id='selectGlue' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.glues && filters.glues.map((item)=>{
                        if (glue==item.id){
                            return(<option key={item.id} value={item.id} selected>{item.name}</option>)
                        }
                        return(
                        
                        <option key={item.id} value={item.id} >{item.name}</option>
                        
                        )

                        })

                        }

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Типография:

                        <select id='selectPress' className={styles.selecter}>

                        <option value=''> Все </option>
                        
                        {
                        
                        filters && filters.press && filters.press.map((item)=>{
                            if (press==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>

                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Водяной знак:

                        <select id='selectWatermark' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.watermarks && filters.watermarks.map((item)=>{
                            if (watermark==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>

                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Валюта:

                        <select id='selectCurrency' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.currencies && filters.currencies.map((item)=>{
                            if (currency==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Тема: 

                        <select id='selectTheme' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.themes && filters.themes.map((item)=>{
                            if (theme==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Каталог: 

                        <select id='selectCatalog' className={styles.selecter}>

                        <option value=''> Все </option>

                        {
                        
                        filters && filters.catalogs && filters.catalogs.map((item)=>{
                            if (catalog==item.id){
                                return(
                                <option key={item.id} value={item.id} selected>{item.name}</option>
                                )
                            }
                        return(
                        
                        <option key={item.id} value={item.id}>{item.name}</option>
                        
                        )

                        })

                        }

                        </select>
                    </div>
                    <div className={styles.catalogContentRowFilter}>
                    Номинал: 

                        <div className={styles.inputFromTo}>

                        <div className={styles.inputFrom}>От <input type="text" className={styles.inputFromToField} id='nominal_ge' defaultValue={nominalGe}/></div>

                        <div className={styles.inputFrom}>До <input type="text" className={styles.inputFromToField} id='nominal_le' defaultValue={nominalLe}/></div>

                        </div>
                    </div>
                    <div className={styles.catalogCommitFilters} onClick={() => commitFilters()}>

                        Применить фильтры

                    </div>
                </div>
                }
                <div className={styles.catalogContentRowFilter}>
                    <form>
                        <input type='radio' name='world_part' value='all' onClick={()=>setWorldPart('all')} defaultChecked/> Все
                        <input type='radio' name='world_part' value='eu' onClick={()=>setWorldPart('eu')}/> Европа
                        <input type='radio' name='world_part' value='as' onClick={()=>setWorldPart('as')}/> Азия
                        <input type='radio' name='world_part' value='am' onClick={()=>setWorldPart('am')}/> Америка
                        <input type='radio' name='world_part' value='af' onClick={()=>setWorldPart('af')}/> Африка
                        <input type='radio' name='world_part' value='oc' onClick={()=>setWorldPart('oc')}/> Океания 
                    </form>
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <input type='text' placeholder='Страна' id='countryInput' className={styles.countryInput} onChange={(e)=>filterCountries(e.target.value)}/> {!showCountries && <ImCross width={20} height={20} className={styles.crossIco} onClick={()=>{setShowCountries(true); document.getElementById('countryInput').value = ''; setItems(null);setCountry(null);setHistoryMoment(null);filterCountries("")}}/>}
                    </div>
                </div>
                <div className={styles.catalogContentRowSearch}>
                    <input type="text" value={searchQuery} placeholder="Искать в каталоге..." className={styles.secondHeaderSearchfieldInput} onChange={(e)=>setSearchQuery(e.target.value)}/>
                    <IoMdSearch className={styles.secondHeaderSearchfieldImg} onClick={() => getItems()}/>
                    <div className={styles.showFiltersButton} onClick={()=>setShowFilters(true)}>
                        Расширенный поиск
                    </div>
                </div>
                {showCountries && filteredCountries && filteredCountries.map((iterCountry, index)=>{
                        if (index % countriesPerRow != 0) {
                            return
                        }
                        let resArray = []
                        for (let i = index; (i < index + countriesPerRow) && (i<filteredCountries.length); i++){
                            resArray.push(filteredCountries[i])
                        }
                        return(
                            <div className={styles.catalogContentRowFilter}>
                                {resArray.map((iterItem)=>{
                                    if (iterItem.country.name == iterItem.history_moment.name && iterItem.country.counter == iterItem.history_moment.counter && iterItem.country.id == iterItem.history_moment.id){
                                        return(
                                            <div className={styles.countrySelecting} onClick={()=>{setCountry(iterItem.country.id);document.getElementById('countryInput').value = iterItem.country.name}}>
                                                <img src={iterItem.country.flag_url} className={styles.countryFlagImage}/>{iterItem.country.name}({iterItem.country.counter})
                                            </div>
                                        )
                                    }
                                    return(
                                        <div className={styles.countrySelecting} onClick={()=>{setHistoryMoment(iterItem.history_moment.id);document.getElementById('countryInput').value = iterItem.history_moment.name}}>
                                            <img src={iterItem.country.flag_url} className={styles.countryFlagImage}/> {iterItem.history_moment.name}({iterItem.history_moment.counter})
                                        </div>
                                    )
                                })}
                            </div>
                        ) 
                    })
                }
                
                    
                { !showCountries && <>
                <div className={styles.catalogContentRow}>
                    { items !== null && !showCountries &&
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
                    {items !== null &&
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
                </div></>}
            </div>
            
        </div>
        
    )
}