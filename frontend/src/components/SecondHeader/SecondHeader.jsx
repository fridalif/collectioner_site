import styles from './SecondHeader.module.css'
import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";

export function SecondHeader(){
    return(
        <div className={styles.secondHeader}>
            <div className={styles.secondHeaderSearchfield}>
                <input type="text" placeholder="Искать на сайте..." className={styles.secondHeaderSearchfieldInput} />
                <IoMdSearch className={styles.secondHeaderSearchfieldImg} />
            </div>
            <div className={styles.secondHeaderCabinet}>
                 <FaRegUserCircle className={styles.secondHeaderCabinetImg} />Личный кабинет
            </div>
        </div>
    )
}