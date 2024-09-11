import styles from './SecondHeader.module.css'
import { IoMdSearch } from "react-icons/io";
import { FaRegUserCircle } from "react-icons/fa";

export function SecondHeader(){
    return(
        <div class={styles.secondHeader}>
            <div class={styles.secondHeaderSearchfield}>
                <input type="text" placeholder="Искать на сайте..." class={styles.secondHeaderSearchfieldInput} />
                <IoMdSearch class={styles.secondHeaderSearchfieldImg} />
            </div>
            <div class={styles.secondHeaderCabinet}>
                 <FaRegUserCircle class={styles.secondHeaderCabinetImg} />Личный кабинет
            </div>
        </div>
    )
}