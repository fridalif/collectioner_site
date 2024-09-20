import styles from './Catalog.module.css';


export function Catalog(){
    return(
        <div className={styles.catalogContainer}>
            <div className={styles.catalogSideBar}>
                <div className={styles.catalogSideBarTitle}>
                    Фильтры
                </div>
                <div className={styles.catalogSideBarFilterBlock}>
                    Части света:<br />
                    <input type='checkbox' value='eu'/> Европа <br />
                    <input type='checkbox' value='as'/> Азия <br />
                    <input type='checkbox' value='af'/> Африка <br />
                    <input type='checkbox' value='am'/> Америка <br />
                    <input type='checkbox' value='ok'/> Океания <br />
                </div>
            </div>
        </div>
    )
}