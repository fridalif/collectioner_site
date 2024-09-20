import styles from './Catalog.module.css';


export function Catalog(){
    return(
        <div className={styles.catalogContainer}>
            <div className={styles.catalogSideBar}>
                <div className={styles.catalogSideBarTitle}>
                    Фильтры
                </div>
            </div>
        </div>
    )
}