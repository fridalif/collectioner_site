import styles from './Profile.module.css'
import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { FaRegUserCircle } from "react-icons/fa";
import { GiChest } from "react-icons/gi";
import { FaGear } from "react-icons/fa6";
import { GiExitDoor } from "react-icons/gi";



const serverUrl  = 'http://127.0.0.1:8000/';

export function Profile(){
    const [mode, setMode] = useState('Profile');
    const [isMyAccount, setIsMyAccount] = useState(true);
    const [accountInfo, setAccountInfo] = useState({});

    useEffect(() => {
        
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
                </div>
            </div>
        </div>
    )
}