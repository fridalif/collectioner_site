import styles from './SecondHeader.module.css'
import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoEnter } from "react-icons/io5";
import { useState } from 'react';

export function SecondHeader({isLoggedIn}){
    const [ search, setSearch ] = useState('');
    const [ searchResults, setSearchResults ] = useState([]);

    return(
        <div className={styles.secondHeader}>
            <div className={styles.secondHeaderSearchfield}>
                <input type="text" placeholder="Искать на сайте..." className={styles.secondHeaderSearchfieldInput} />
                <IoMdSearch className={styles.secondHeaderSearchfieldImg} />
                
            </div>
            <div className={styles.secondHeaderCabinet}>

                {
                isLoggedIn ? 
                    <a href='/profile' className={styles.secondHeaderCabinetLink}>
                        <FaRegUserCircle className={styles.secondHeaderCabinetImg} /> Личный кабинет 
                    </a>
                :
                    <a href='/login' className={styles.secondHeaderCabinetLink}>
                        <IoEnter className={styles.secondHeaderCabinetImg}/> Вход/Регистрация
                    </a>
                }
            </div>
        </div>
    )
}