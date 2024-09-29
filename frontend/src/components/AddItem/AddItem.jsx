import styles from './AddItem.module.css'
import { useEffect, useState } from 'react';
import axios from 'axios';


const serverUrl  = 'http://127.0.0.1:8080';
export function AddItem(){
    const [worldPart, setWorldPart] = useState(null);
    const [countries, setCountries] = useState([]);
    const [historyMoments, setHistoryMoments] = useState([]);
    const [historyMoment, setHistoryMoment] = useState(null);
    const [country, setCountry ] = useState(null);
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
    return(
        <div className={styles.content}>
            <div className={styles.usersTableRowHeader}>
                Заполните известную Вам информацию
            </div>
            <div className={styles.usersTableRow}>
                <select className={styles.selecter} onChange={(e) => setWorldPart(e.target.value)}>
                    <option>Часть света</option>
                    <option value='eu'>Европа</option>
                    <option value="as">Азия</option>
                    <option value="am">Америка</option>
                    <option value='af'>Африка</option>
                    <option value='oc'>Океания</option>
                </select>
                <select className={styles.selecter} onChange={(e) => setCountry(e.target.value)}>
                    {worldPart === null ? <option>Выберите часть света</option>: <option>Страна</option>}
                    {
                        countries!==null && countries.length > 0 &&
                        countries.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)
                    }
                </select>
                <select className={styles.selecter} onChange={(e) => setHistoryMoment(e.target.value)}>
                    {country === null ? <option>Выберите страну</option>: <option>Исторический момент</option>}
                    {
                        historyMoments!==null && historyMoments.length > 0 &&
                        historyMoments.map((country) => <option key={country.id} value={country.id}>{country.name}</option>)
                    }
                </select>
            </div>
            <div className={styles.usersTableRow}>
                <input className={styles.input} type="text" placeholder='Название'/>
                <input className={styles.input} type="text" placeholder='Год'/>
                <select className={styles.selecter}>
                    <option>Категория</option>
                    <option value='mark'>Марка</option>
                    <option value='philatel'>Филателистический продукт</option>
                </select>
            </div>
        </div>
    )

}