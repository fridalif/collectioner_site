import styles from './Profile.module.css'
import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { FaRegUserCircle } from "react-icons/fa";
import { GiChest } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";
import Cookies from 'js-cookie';
import { CiLock } from "react-icons/ci";


const serverUrl  = 'http://127.0.0.1:8080';

export function Profile(){
    const [mode, setMode] = useState('Profile');
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
                    alert(response.data.message);
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
        await axios.get(serverUrl + '/api/get_csrf/', { withCredentials: true })
        .then((res) => {
            const csrfToken = res.headers.get('X-CSRFToken');
            setIsCsrf(csrfToken);
        })
        .catch((err) => console.error(err))
    }

    const changeUserInfo = async () => {
        await getCSRF();
        var formData = new FormData();
        var imagefile = document.getElementById("avatar");
        formData.append("image", imagefile.files[0]);
        await axios.post(serverUrl + "/api/change_avatar/", formData, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',"X-CSRFToken": isCsrf,
            }
        })
        .then((res) => {
            res = res.data
            if (res.status === 'ok') {
                setAvatar(res.data.avatar_url);
            }
            else {
                if (res.message!=='Не указана картинка'){
                    alert(res.message)
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
                "X-CSRFToken": isCsrf,
              }})
            .then((response) => {
                if (response.data.status !== 'ok') {
                    alert(response.data.message);
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
                alert('Изменения сохранены');
            })
            .catch((err) => console.error(err))
    }

    const logout = async () => {
        await getCSRF();
        await axios
            .post(serverUrl + "/api/logout/", { withCredentials: true , headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": isCsrf,
              }})
            .then((response) => {
                if (response.data.status !== 'ok') {
                    alert(response.data.message);

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
                alert(response.message);
                return [];
            }
        })
        .catch((err) => {console.error(err); return [];})
    }
    return(
        <div className={styles.profileContainerHeight}>
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
                                <img src={serverUrl+avatar} className={styles.profileAvatar} alt="avatar"/> {username}
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
                                <img src={serverUrl+avatar} className={styles.profileAvatar} alt="avatar"/> <input type="text" placeholder='Никнейм' id='username' style={{width: '300px', height: '30px', fontSize: '20px'}} className={styles.standartInput} defaultValue={username!=null?username:''}/>
                            </div>
                            <div className={styles.profileInfoRow} style={{'fontSize': '24px','fontFamily': 'Sofia-Sans', 'marginLeft': '40px'}}>
                                 Изменить аватарку: <input type="file" id="avatar" className={styles.standartInput} style={{'boxShadow': 'none','height': '40px', 'borderRadius':'0px'}}/>
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
                            dasdadad
                        </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}