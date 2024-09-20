import styles from './Catalog.module.css';
import { useState, useEffect } from 'react'

export function Catalog(){

    const [worldPart, setWorldPart] = useState(null);
    const [country, setCountry ] = useState(null);
    const [historyMoment, setHistoryMoment] = useState(null);



    return(
        <div className={styles.catalogContainer}>
            <div className={styles.catalogSideBar}>
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
                    </select>
                </div>
                <div className={styles.catalogSideBarFilterBlock}>
                    Исторический этап: <br />
                    <select id='selectHistoryMoment' className={styles.selecter} onChange={()=>setHistoryMoment(document.getElementById('selectHistoryMoment').value)}>
                        <option value={null}>{country === null ? <>Выберите страну</>:<>Исторический этап</>}</option>
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
                    Временной промежуток: <br />
                    От <input type="number" className={styles.selecter} id='year_ge'/>
                    До <input type="number" className={styles.selecter} id='year_le'/>
                </div>
                
            </div>
        </div>
    )
}