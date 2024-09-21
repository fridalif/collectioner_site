import styles from './Catalog.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

const serverUrl  = 'http://127.0.0.1:8080';
export function Catalog(){

    const [worldPart, setWorldPart] = useState(null);
    const [country, setCountry ] = useState(null);
    const [historyMoment, setHistoryMoment] = useState(null);
    const [filters, setFilters] = useState(null);
    const [countries, setCountries] = useState([]);
    const [historyMoments, setHistoryMoments] = useState([]);

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
    },[])

    useEffect(()=>{
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
    },[worldPart])

    useEffect(()=>{
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
    },[country])

    

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
                            <option value={null}>{worldPart !== null ? <>Страна</> : <>Выберите часть света</>}</option>
                            {countries !== null && countries.map((new_country)=>{return <option value={new_country.id}>{new_country.name}</option>})}
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Исторический этап: <br />
                        <select id='selectHistoryMoment' className={styles.selecter} onChange={()=>setHistoryMoment(document.getElementById('selectHistoryMoment').value)}>
                            <option value={null}>{country === null ? <>Выберите страну</>:<>Исторический этап</>}</option>
                            {historyMoments !== null && historyMoments.map((historyMoment)=>{return <option value={historyMoment.id}>{historyMoment.name}</option>})}
                        </select>
                    </div>
                    <div className={styles.catalogSideBarFilterBlock}>
                        Категория: <br />
                        <select id='selectCategory' className={styles.selecter}>
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                            <option value={null}> Все </option>
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
                <div className={styles.catalogCommitFilters}>
                    Применить фильтры
                </div>
            </div>
            <div className={styles.catalogContent}>
                <div className={styles.catalogContentRow}>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                </div>
                <div className={styles.catalogContentRow}>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                    <div className={styles.lastAddedMarksMark}>
                            <img src='/image.png' alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                            <div className={styles.lastAddedMarksMarkText} id="1">
                                dfsopfjops
                            </div>
                    </div>
                </div>
                
            </div>
            
        </div>
        
    )
}