import styles from './Users.module.css'
import { IoMdSearch } from "react-icons/io";

export function Users(){
    return(
        <div className={styles.content}>
            <div className={styles.searchField}>
                <input type="text" placeholder="Искать пользователя..." className={styles.searchFieldInput} />
                <IoMdSearch className={styles.secondHeaderSearchfieldImg} />
            </div>
        </div>
    );
}