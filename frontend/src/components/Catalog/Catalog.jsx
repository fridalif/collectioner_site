import styles from './Catalog.module.css';
import { useState, useEffect } from 'react'

export function Catalog(){

    const [worldPart, setWorldPart] = useState(null);
    const [country, setCountry ] = useState(null);
    return(
        <div className={styles.catalogContainer}>
            <div className={styles.catalogSideBar}>
                <div className={styles.catalogSideBarFilterBlock}>
                    Части света{worldPart}:<br />
                    <form>
                        <input type='radio' name='world_part' value='eu' onClick={()=>setWorldPart('eu')}/> Европа <br />
                        <input type='radio' name='world_part' value='as' onClick={()=>setWorldPart('as')}/> Азия <br />
                        <input type='radio' name='world_part' value='af' onClick={()=>setWorldPart('af')}/> Африка <br />
                        <input type='radio' name='world_part' value='am' onClick={()=>setWorldPart('am')}/> Америка <br />
                        <input type='radio' name='world_part' value='ok' onClick={()=>setWorldPart('ok')}/> Океания <br />
                    </form>
                </div>
                <div className={styles.catalogSideBarFilterBlock}>
                    Страны:<br />
                    <select>
                        <option value={null}>{worldPart !== null ? <>Страны</> : <>Выберите часть света</>}</option>
                    </select>
                </div>
                <div className={styles.catalogSideBarFilterBlock}>
                    Исторические этапы: <br />
                    <select>
                        <option>Страны</option>
                    </select>
                </div>
            </div>
        </div>
    )
}