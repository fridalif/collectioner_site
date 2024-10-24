import styles from './Profile.module.css'
import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { FaRegUserCircle } from "react-icons/fa";
import { GiChest } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";
import Cookies from 'js-cookie';
import { CiLock } from "react-icons/ci";
import { FaPlusCircle } from "react-icons/fa";
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
import { MessageBoxError, MessageBoxGood } from '../MessageBox/MessageBox.jsx';
const serverUrl  = 'http://127.0.0.1:8080';

export function Profile(){
    const [mode, setMode] = useState('Profile');
    const [collections, setCollections] = useState([]);
    const [ chosenCollection, setChosenCollection ] = useState(null);
    const [ collectionItems, setCollectionItems ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [isMyAccount, setIsMyAccount] = useState(false);
    const [email, setEmail] = useState(null);
    const [username, setUsername] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [fullname, setFullname] = useState(null);
    const [country, setCountry] = useState(null);
    const [city, setCity] = useState(null);
    const [birth_date, setBirth_date] = useState(null);
    const [languages, setLanguages] = useState(null);
    const [about, setAbout] = useState(null);
    const [isCsrf, setIsCsrf] = useState(null);
    let countryField = useRef();
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ privateSettings, setPrivateSettings ] = useState(null);
    const [ message, setMessage ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);

    const addCollection = async () => {
        let csrfToken = await getCSRF();
        let collectionName = document.getElementById('collectionName').value;
        if (collectionName === '') {
            setMessage('Название коллекции не может быть пустым');
            setMessageCounter(messageCounter + 1);
            return;
        }
        let data = {
            collection_name: collectionName
        }
        axios
            .post(serverUrl + "/api/add_collection/", data, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,
                }
            })
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }
                setCollections([...collections, response.data.data]);
                setMessage('Коллекция создана');
                setMessageCounter(messageCounter + 1);
            })
            .catch((err) => console.error(err));
    }
    const get_user_info = async () => {
        const queryParameters = new URLSearchParams(window.location.search)
        const user_id = queryParameters.get("user_id")
        let result_url = serverUrl + "/api/get_user/"
        if (user_id) {
            result_url += `${user_id}/`
        }
        await axios
            .get(result_url, { withCredentials: true })
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    window.location.href = '/';
                    return;
                }
                let data = response.data.data;
                console.log(data)
                setUsername(data.user.username);
                setAvatar(data.user.avatar_url);
                setFullname(data.user.fullname);
                setCountry(data.user.country);
                setCity(data.user.city);
                setEmail(data.user.email);
                setBirth_date(data.user.birth_date);
                setLanguages(data.user.languages);
                setAbout(data.user.about);
                setIsMyAccount(data.isMyAccount);
            })
            .catch((err) => console.error(err))
    }

    const getCSRF = async () => {
        let csrfToken = '';
        await axios.get(serverUrl + '/api/get_csrf/', { withCredentials: true })
        .then((res) => {
            csrfToken = res.headers.get('X-CSRFToken');
            setIsCsrf(csrfToken);
            return csrfToken;
        })
        .catch((err) => console.error(err))
        return csrfToken;
    }

    const changeUserInfo = async () => {
        let csrfToken = await getCSRF();
        var formData = new FormData();
        var imagefile = document.getElementById("avatar");
        formData.append("image", imagefile.files[0]);
        await axios.post(serverUrl + "/api/change_avatar/", formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',"X-CSRFToken": csrfToken,
            }
        })
        .then((res) => {
            res = res.data
            if (res.status === 'ok') {
                setAvatar(res.data.avatar_url);
            }
            else {
                if (res.message!=='Не указана картинка'){
                    setMessage(res.message);
                    setMessageCounter(messageCounter + 1);
                }
            }
        })
        .catch((err) => {
            console.error(err)
        })
        var username = document.getElementById("username").value
        var fullname = document.getElementById("fullname").value
        var country = document.getElementById("country").value
        var city = document.getElementById("city").value
        var birth_date = document.getElementById("birth_date").value
        var languages = document.getElementById("languages").value
        var about = document.getElementById("about").value
        var email = document.getElementById("email").value
        var password = document.getElementById("password").value
        var about = document.getElementById("about").value

        var data = {}

        if (username) {
            data["username"] = username
        }
        if (fullname) {
            data["fullname"] = fullname
        }
        if (country) {
            data["country"] = country
        }
        if (city) {
            data["city"] = city
        }
        if (birth_date) {
            data["birth_date"] = birth_date
        }
        if (languages) {
            data["languages"] = languages
        }
        if (about) {
            data["about"] = about
        }
        if (email) {
            data["email"] = email
        }
        if (password) {
            data["password"] = password
        }
        await axios
            .post(serverUrl + "/api/change_other_user_info/", data, { withCredentials: true , headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
              }})
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }
                var responseData = response.data.data;
                setUsername(responseData.username);
                setFullname(responseData.fullname);
                setCity(responseData.city);
                setCountry(responseData.country);
                setEmail(responseData.email);
                setBirth_date(responseData.birth_date);
                setLanguages(responseData.languages);
                setAbout(responseData.about);
                setMessage('Изменения сохранены');
                setMessageCounetr(messageCounter + 1);
            })
            .catch((err) => console.error(err))
    }

    const changePrivateSettings = async () => {
        if (mode !== 'SettingsPrivate' || !isMyAccount) {
            return;
        }
        let csrfToken = await getCSRF();
        let data = {
            show_fullname: document.getElementById("showFullname").checked,
            show_birth_date: document.getElementById("showBirthdate").checked,
            collection_id: chosenCollection,
            collection_can_see_other: document.getElementById("canSeeOther").checked
        }

        await axios
            .post(serverUrl + "/api/change_private_settings/", data, { withCredentials: true , headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
              }})
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }
                setMessage('Изменения сохранены');
                setMessageCounter(messageCounter + 1);
            })
            .catch((err) => console.error(err))
    }

    const logout = async () => {
        let csrfToken = await getCSRF();
        console.log(csrfToken);
        await axios.post(serverUrl + "/api/logout/", {}, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',"X-CSRFToken": csrfToken,
            }
        })
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }

                Cookies.remove('sessionid');
                window.location.href = '/login';
            })
            .catch((err) => console.error(err))
    }

    useEffect(() => {
        async function fetchData() {
            await get_user_info();
        }
        fetchData();
    }, []);

    useEffect(()=>{
        if (mode != 'Collection' && mode !== 'SettingsPrivate'){
            return;
        }
        const queryParameters = new URLSearchParams(window.location.search);
        const user_id = queryParameters.get("user_id");
        let result_url = serverUrl + "/api/get_user_collections/";
        if (user_id) {
            result_url += `${user_id}/`
        }
        axios.get(result_url, { withCredentials: true })
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }  
                setCollections(response.data.data);
                if (response.data.data.length > 0) {
                    setChosenCollection(response.data.data[0].collection_id);
                }
            })
        if (mode == 'SettingsPrivate'){
            axios.get(serverUrl + "/api/get_my_private_settings/", { withCredentials: true })
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }
                setPrivateSettings(response.data.data);
            })
        }
    },[mode])

    useEffect(()=>{
        if (chosenCollection === null){
            return;
        }
        const queryParameters = new URLSearchParams(window.location.search);
        const user_id = queryParameters.get("user_id");
        let result_url = serverUrl + "/api/get_items_from_collection/";
        result_url += `?collection_id=${chosenCollection}`;
        if (user_id) {
            result_url += `&user_id=${user_id}`;
        }
        result_url += `&limit=3`;
        result_url += `&offset=${(currentPage-1)*3}`;
        axios.get(result_url, { withCredentials: true })
            .then((response) => {
                if (response.data.status !== 'ok') {
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }
                console.log(response.data.data)
                setCollectionItems(response.data.data.items);
                setTotal(response.data.data.total);
            })
            .catch((err) => console.error(err));
    },[chosenCollection, currentPage])
const get_countries = async () => {
        await axios
        .get(`${serverUrl}/api/get_countries/`,{ withCredentials: true })
        .then((response) => {
            response = response.data;
            if (response.status === 'ok') {
                let contriesHTML = '<option value="">Страна</option>';
                response.data.forEach((country) => {
                    contriesHTML += `<option value="${country.id}">${country.name}</option>`
                })
                countryField.current.innerHTML = contriesHTML;
            }
            else {
                setMessage(response.message);
                setMessageCounter(messageCounter + 1);
                return [];
            }
        })
        .catch((err) => {console.error(err); return [];})
    }
    return(
        <div className={styles.profileContainerHeight}>
            { message !== '' && message !== 'Изменения сохранены' && message !== 'Коллекция создана' && <MessageBoxError key={messageCounter} message={message} displayed={true}/>}
            { message == 'Изменения сохранены' || message == 'Коллекция создана' && <MessageBoxGood key={messageCounter} message={message} displayed={true}/>}
            <div className={styles.profileContainerWidth}>
                <div className={styles.profileBlock}>
                    <div className={styles.sideBar}>
                        <div className={mode == 'Profile' ? styles.sideBarBlockChosen : styles.sideBarBlock} onClick={() => setMode('Profile')}>
                            <FaRegUserCircle className={styles.sideBarIcon}/> Профиль
                        </div>
                        <div className={mode == 'Collection' ? styles.sideBarBlockChosen : styles.sideBarBlock} onClick={() => setMode('Collection')}>
                            <GiChest className={styles.sideBarIcon}/> Коллекция
                        </div>
                        { isMyAccount &&
                            <div className={mode == 'Settings' ? styles.sideBarBlockChosen : styles.sideBarBlock} onClick={() => setMode('Settings')}>
                                <FaGear className={styles.sideBarIcon}/> Настройки
                            </div>
                        }
                        { isMyAccount &&
                            <div className={mode == 'SettingsPrivate' ? styles.sideBarBlockChosen : styles.sideBarBlock} onClick={() => setMode('SettingsPrivate')}>
                                <CiLock className={styles.sideBarIcon}/> Настройки приватности
                            </div>
                        }
                        { isMyAccount &&
                            <div className={mode == 'Logout' ? styles.sideBarBlockChosen : styles.sideBarBlock} onClick={() => logout()}>
                                <GiExitDoor className={styles.sideBarIcon}/> Выход
                            </div>
                        }
                    </div>
                    <div className={styles.profileContent}>
                        { mode == 'Profile' &&
                        <>
                            <div className={styles.profileAvatarAndName}>
                                <div className={styles.profileAvatarContainer}><img src={serverUrl+avatar} className={styles.profileAvatar} alt="avatar"/></div> {username}
                            </div>
                            <div className={styles.profileInfo}>
                                <div className={styles.profileInfoRow}>
                                    Полное имя: {fullname}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Email: {email}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Страна: {country}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Город: {city}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Дата рождения: {birth_date}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Языки: {languages}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    О себе: {about}
                                </div>
                            </div>
                            
                        </>
                        }
                        { mode == 'Settings' &&
                        <>
                            <div className={styles.profileAvatarAndName}>
                                <img src={serverUrl+avatar} className={styles.profileAvatar} alt="avatar"/> <input type="text" placeholder='Никнейм' id='username' className={styles.standartInput} defaultValue={username!=null?username:''}/>
                            </div>
                            <div className={styles.profileInfoRow}>
                                Изменить аватарку: <input type="file" id="avatar" className={styles.standartInputImage}/>
                            </div>

                            <div className={styles.profileInfo}>
                                <div className={styles.profileInfoRow}>
                                    Новый пароль: <input type="password" placeholder='Новый пароль' id='password' defaultValue='' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Полное имя: <input type="text" defaultValue={fullname!=null?fullname:''} placeholder='Полное имя' id='fullname' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Email: <input type="text" defaultValue={email!=null?email:''} placeholder='Email' id='email' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Страна: <select className={styles.standartInput} id='country' defaultValue='' ref={countryField} onClick={() => get_countries()}>
                                        <option value=''> Страна </option>  
                                    </select>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Город: <input type="text" defaultValue={city!==null?city:''} placeholder='Город' id='city' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Дата рождения: <input type="date" defaultValue={birth_date!=null?birth_date:''} placeholder='Дата рождения' id='birth_date' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Языки: <input type="text" defaultValue={languages!==null?languages:''} placeholder='Языки' id='languages' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    О себе: <textarea type="text" defaultValue={about!==null?about:''} placeholder='О себе' id='about' className={styles.standartInput}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    <button onClick={() => changeUserInfo()} className={styles.settingsButton}>Сохранить</button>
                                </div>
                            </div>
                        </>}
                        { mode == 'Collection' && 
                        <>
                            { isMyAccount && <div className={styles.addCatalogRow}>
                                <input type="text" placeholder='Добавить коллекцию' id='collectionName' className={styles.addCatalogInput} />
                                <FaPlusCircle className={styles.addCatalogButton} onClick={() => addCollection()}/>
                            </div>}
                            <div className={styles.addCatalogRow}>
                                <select className={styles.selectCatalog} id='selectCollection' onChange={() => setChosenCollection(document.getElementById('selectCollection').value)}>
                                    { collections.map((item)=>(
                                        <option value={item.collection_id}>{item.collection_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.collectionBody}>
                                { currentPage === 1 &&
                                <div className={styles.prevPageChosen}>
                                    <IoIosArrowDropleftCircle style={{width:'40px',height:'40px'}}/>
                                </div>
                                }
                                { currentPage !== 1 &&
                                <div className={styles.prevPage} onClick={()=>setCurrentPage(currentPage-1)}>
                                    <IoIosArrowDropleftCircle style={{width:'40px',height:'40px'}}/>
                                </div>}
                                {
                                    collectionItems != [] && [0,1,2].map((index)=>{
                                        if (collectionItems[index]!==undefined){
                                            console.log(collectionItems[index]);
                                            return(
                                                <div className={styles.lastAddedMarksMark} onClick={() => window.location.href='/item?item_id='+collectionItems[index].id}>
                                                    {collectionItems[index].image && <div className={styles.lastAddedMarksMarkImgField}><img src={collectionItems[index].image} className={styles.lastAddedMarksMarkImg}/> </div>}
                                                    <div className={styles.lastAddedMarksMarkName}>{collectionItems[index].name}</div>
                                                    <div>
                                                        Низкое: {collectionItems[index].qualities_counters.bad}
                                                    </div>
                                                    <div>
                                                        Высокое: {collectionItems[index].qualities_counters.good}
                                                    </div>
                                                </div>
                                            )
                                        }
                                        return(
                                            <div className={styles.placeholder}>
                                                
                                            </div>
                                        )
                                    })
                                }
                                { currentPage*3 < total &&
                                <div className={styles.prevPage} onClick={()=>setCurrentPage(currentPage+1)}>
                                    <IoIosArrowDroprightCircle style={{width:'40px',height:'40px'}}/>
                                </div>
                                }
                                { currentPage*3 >= total &&
                                <div className={styles.prevPageChosen}>
                                    <IoIosArrowDroprightCircle style={{width:'40px',height:'40px'}}/>
                                </div>
                                }
                            </div>
                        </>
                        }
                        {
                            mode === 'SettingsPrivate' && isMyAccount &&
                            <>
                                <div className={styles.profileInfoRow} style={{'marginTop':'50px'}}>
                                    <div>
                                        {privateSettings !== null && privateSettings.show_fullname ? <input type='checkbox' name='show_fullname' id='showFullname' defaultChecked/> :<input type='checkbox' name='show_fullname' id='showFullname'/>} Показывать полное имя
                                    </div>
                                </div>
                                <div className={styles.profileInfoRow} style={{'marginTop':'50px'}}>
                                    <div>
                                        {privateSettings !== null && privateSettings.show_birth_date ? <input type='checkbox' name='show_birth_date' id='showBirthdate' defaultChecked/> :<input type='checkbox' name='show_birth_date' id='showBirthdate'/>} Показывать дату рождения
                                    </div>
                                </div>
                                <div className={styles.profileInfoRow} style={{'marginTop':'50px'}}>
                                    <div>
                                        <select className={styles.selectCatalog} id='selectCollection' onChange={() => setChosenCollection(document.getElementById('selectCollection').value)}>
                                        { collections.map((item)=>(
                                            <option value={item.collection_id}>{item.collection_name}</option>
                                        ))}
                                        </select>
                                        {
                                            chosenCollection !== null && collections.map((item)=>{
                                                if (item.collection_id == chosenCollection){
                                                    if (item.can_see_other){
                                                        return (<><br/><input type='checkbox' name='can_see_other' id='canSeeOther' defaultChecked /> Показывать коллекцию </>)
                                                    }
                                                    return (<><br/><input type='checkbox' name='can_see_other' id='canSeeOther'/> Показывать коллекцию </>)
                                                    
                                                }
                                                return (<></>)
                                            })
                                        }
                                        <div className={styles.profileInfoRow} style={{'marginTop':'30px','fontSize':'24px'}}>
                                            <button onClick={() => changePrivateSettings()} className={styles.settingsButton}>Сохранить</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}