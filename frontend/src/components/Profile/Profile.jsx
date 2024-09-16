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
    const [isMyAccount, setIsMyAccount] = useState(true);
    const [accountInfo, setAccountInfo] = useState({'account_url':'nothing'});
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
                console.log(response.data.data);
                setAccountInfo(response.data.data.user);
                setIsMyAccount(response.data.data.is_my_account);
            })
            .catch((err) => console.error(err))
    }

    useEffect(async () => {
        await get_user_info();
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
                                <img src={serverUrl+accountInfo.avatar_url} className={styles.profileAvatar} alt="avatar"/> {accountInfo.username}
                            </div>
                            <div className={styles.profileInfo}>
                                <div className={styles.profileInfoRow}>
                                    Полное имя: {accountInfo.fullname}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Email: {accountInfo.email}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Страна: {accountInfo.country}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Дата рождения: {accountInfo.birth_date}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    Языки: {accountInfo.languages}
                                </div>
                                <div className={styles.profileInfoRow}>
                                    О себе: {accountInfo.about}
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