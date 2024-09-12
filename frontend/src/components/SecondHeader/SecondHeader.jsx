import styles from './SecondHeader.module.css'
import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";
import { IoEnter } from "react-icons/io5";

export function SecondHeader({isLoggedIn}){
    return(
        <div className={styles.secondHeader}>
            <div className={styles.secondHeaderSearchfield}>
                <input type="text" placeholder="Искать на сайте..." className={styles.secondHeaderSearchfieldInput} />
                <IoMdSearch className={styles.secondHeaderSearchfieldImg} />
            </div>
            <div className={styles.secondHeaderCabinet}>

                {
                isLoggedIn ? 
                    <>
                        <FaRegUserCircle className={styles.secondHeaderCabinetImg} /> Личный кабинет 
                    </>
                :
                    <>
                        <IoEnter className={styles.secondHeaderCabinetImg} /> Вход/Регистрация
                    </>
                }
            </div>
        </div>
    )
}