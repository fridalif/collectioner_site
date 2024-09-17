import styles from './Profile.module.css'
import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { FaRegUserCircle } from "react-icons/fa";
import { GiChest } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";
import Cookies from 'js-cookie';


//const serverUrl  = 'http://127.0.0.1:8000/';
const serverUrl  = 'https://ae35-178-176-74-38.ngrok-free.app';

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

    useEffect(async () => {
        await get_user_info();
        return;
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
                                <img src={serverUrl+avatar} className={styles.profileAvatar} alt="avatar"/> <input type="text" style={{width: '300px', height: '30px', fontSize: '20px'}} value={username}/>
                            </div>
                            <div className={styles.profileInfo}>
                            <div className={styles.profileInfoRow}>
                                    Новый пароль: <input type="password" value='' style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Полное имя: <input type="text" value={fullname} style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Email: <input type="text" value={email} style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Страна: <select style={{width: '300px', fontSize: '18px', marginTop: '10px'}} ref={countryField} onClick={() => get_countries()}>
                                        <option value=''> Страна </option>  
                                    </select>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Город: <input type="text" value={city} style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Дата рождения: <input type="date" value={birth_date} style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Языки: <input type="text" value={languages} style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    О себе: <textarea type="text" value={about} style={{width: '300px', fontSize: '18px', marginTop: '10px'}}/>
                                </div>
                                <div className={styles.profileInfoRow}>
                                    <button onClick={() => alert('Отпарвка на сервер ещё не сделана')} className={styles.settingsButton}>Сохранить</button>
                                </div>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        </div>
    )
}