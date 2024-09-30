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
    const [ file1, setFile1 ] = useState(null);
    const [ file2, setFile2 ] = useState(null);
    const [ file3, setFile3 ] = useState(null);
    const [ file4, setFile4 ] = useState(null);
    const [ file5, setFile5 ] = useState(null);
    

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
                <input className={styles.input} type="text" placeholder='Название' id='itemName'/>
                <input className={styles.input} type="text" placeholder='Год' id='itemYear'/>
                <select className={styles.selecter} id='itemCategory'>
                    <option>Категория</option>
                    <option value='mark'>Марка</option>
                    <option value='philatel'>Филателистический продукт</option>
                </select>
            </div>
            <div className={styles.usersTableRow}>
                <input className={styles.input} type="text" placeholder='Эмиссия' id='itemEmission'/>
                <input className={styles.input} type="text" placeholder='Формат' id='itemFormat'/>
                <input className={styles.input} type="text" placeholder='Штамп' id='itemStamp'/>
            </div>
            <div className={styles.usersTableRow}>
                <input className={styles.input} type="text" placeholder='Цвет' id='itemColor'/>
                <input className={styles.input} type="text" placeholder='Клей' id='itemKey'/>
                <input className={styles.input} type="text" placeholder='Типография' id='itemPress'/>
            </div>
            <div className={styles.usersTableRow}>
                <input className={styles.input} type="text" placeholder='Водяной знак' id='itemWatermark'/>
                <input className={styles.input} type="text" placeholder='Валюта' id='itemCurrency'/>
                <input className={styles.input} type="text" placeholder='Тема' id='itemTheme'/>
            </div>
            <div className={styles.usersTableRow}>
                <input className={styles.input} type="text" placeholder='Фамилия дизайнера' id='itemDesignerSurname'/>
                <input className={styles.input} type="text" placeholder='Имя дизайнера' id='itemDesignerName'/>
                <input className={styles.input} type="text" placeholder='Номинал' id='itemNominal'/>
            </div>
            <div className={styles.usersTableRow}>
                <input className={styles.input} type="text" placeholder='Высота' id='itemHeight'/>
                <input className={styles.input} type="text" placeholder='Ширина' id='itemWidth'/>
                <input className={styles.input} type="text" placeholder='Каталог' id='itemCatalog'/>
            </div>
            <div className={styles.usersTableRow} style={{justifyContent: 'center'}}>
                <div className={file1 === null ? styles.fileInput : styles.fileInputActive} id='fileInputBlock1' onClick={() => document.getElementById('fileInput1').click()}>
                    Фото
                    <input type="file" id="fileInput1" hidden onChange={(e) => setFile1(e.target.files[0])}/>
                </div>
                <div className={file2 === null ? styles.fileInput : styles.fileInputActive} id='fileInputBlock2' onClick={() => document.getElementById('fileInput2').click()}>
                    Фото
                    <input type="file" id="fileInput2" hidden onChange={(e) => setFile2(e.target.files[0])}/>
                </div>
                <div className={file3 === null ? styles.fileInput : styles.fileInputActive} id='fileInputBlock3' onClick={() => document.getElementById('fileInput3').click()}>
                    Фото
                    <input type="file" id="fileInput3" hidden onChange={(e) => setFile3(e.target.files[0])}/>
                </div>
                <div className={file4 === null ? styles.fileInput : styles.fileInputActive} id='fileInputBlock4' onClick={() => document.getElementById('fileInput4').click()}>
                    Фото
                    <input type="file" id="fileInput4" hidden  onChange={(e) => setFile4(e.target.files[0])}/>
                </div>
                <div className={file5 === null ? styles.fileInput : styles.fileInputActive} id='fileInputBlock5' onClick={() => document.getElementById('fileInput5').click()}>
                    Фото
                    <input type="file" id="fileInput5" hidden onChange={(e) => setFile5(e.target.files[0])}/>
                </div>
            </div>
            <div className={styles.usersTableRow} style={{justifyContent: 'center'}}>
                <div className={styles.settingsButton}>
                    Добавить
                </div>
            </div>
        </div>
    )

}