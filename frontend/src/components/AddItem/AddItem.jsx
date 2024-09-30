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

    const getCSRF = async () => {
        let csrfToken = '';
        await axios.get(serverUrl + 'api/get_csrf/', { withCredentials: true })
        .then((res) => {
            csrfToken = res.headers.get('X-CSRFToken');
            return csrfToken;
        })
        .catch((err) => console.error(err))
        return csrfToken;
    }

    const addNewItem = async () => {
        let csrfToken = await getCSRF();
        const formData = new FormData();
        if (file1){
            formData.append('file1', file1);
        }
        if (file2){
            formData.append('file2', file2);
        }
        if (file3){
            formData.append('file3', file3);
        }
        if (file4){
            formData.append('file4', file4);
        }
        if (file5){
            formData.append('file5', file5);
        }
        if (historyMoment === null || historyMoment === '') {
            alert('Не выбран исторический момент');
            return;
        }
        formData.append('history_moment', historyMoment);
        let itemName = document.getElementById('itemName').value;
        if (itemName === '') {
            alert('Не указано название');
            return;
        }
        formData.append('name', itemName);
        let itemYear = document.getElementById('itemYear').value;
        let itemCategory = document.getElementById('itemCategory').value;
        let itemEmission = document.getElementById('itemEmission').value;
        let itemFormat = document.getElementById('itemFormat').value;
        let itemStamp = document.getElementById('itemStamp').value;
        let itemColor = document.getElementById('itemColor').value;
        let itemGlue = document.getElementById('itemGlue').value;
        let itemTheme = document.getElementById('itemTheme').value;
        let itemWatermark = document.getElementById('itemWatermark').value;
        let itemCurrency = document.getElementById('itemCurrency').value;
        let itemPressure = document.getElementById('itemPress').value;
        let itemDesignerSurname = document.getElementById('itemDesignerSurname').value;
        let itemDesignerName = document.getElementById('itemDesignerName').value;
        let itemNominal = document.getElementById('itemNominal').value;
        let itemWidth = document.getElementById('itemWidth').value;
        let itemHeight = document.getElementById('itemHeight').value;
        let itemCatalog = document.getElementById('itemCatalog').value;
        formData.append('year', itemYear);
        formData.append('category', itemCategory);
        formData.append('emission', itemEmission);
        formData.append('format', itemFormat);
        formData.append('stamp', itemStamp);
        formData.append('color', itemColor);
        formData.append('glue', itemGlue);
        formData.append('theme', itemTheme);
        formData.append('watermark', itemWatermark);
        formData.append('currency', itemCurrency);
        formData.append('pressure', itemPressure);
        formData.append('designer_surname', itemDesignerSurname);
        formData.append('designer_name', itemDesignerName);
        formData.append('nominal', itemNominal);
        formData.append('width', itemWidth);
        formData.append('height', itemHeight);
        formData.append('catalog', itemCatalog);
        axios.post(serverUrl + "api/add_item/", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            }
        })
    }

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
                <input className={styles.input} type="text" placeholder='Клей' id='itemGlue'/>
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
            <div className={styles.usersTableRow} style={{justifyContent: 'center'}} onClick={()=>addNewItem()}>
                <div className={styles.settingsButton}>
                    Добавить
                </div>
            </div>
        </div>
    )

}