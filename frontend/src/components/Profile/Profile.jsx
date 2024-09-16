import styles from './Profile.module.css'
import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { FaRegUserCircle } from "react-icons/fa";
import { GiChest } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";
import Image from 'next/image'


const serverUrl  = 'http://127.0.0.1:8000';

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

    useEffect(async () => {
        await get_user_info();
        return;
    }, []);

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
                            <div className={mode == 'Logout' ? styles.sideBarBlockChosen : styles.sideBarBlock}>
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
                    </div>
                </div>
            </div>
        </div>
    )
}