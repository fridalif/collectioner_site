import styles from './Header.module.css';


export function Header({isLoggedIn, isSuperuser}){
    return(
        <header className={styles.header}>
            <div className={styles.headerNode}>
                <a href='/' className={styles.headerLink}>
                    Главная
                </a>
            </div>
            <div className={styles.headerNode}>
                Новости
            </div>
            <div className={styles.headerNode}>
                <a href='/catalog' className={styles.headerLink}>
                    Каталог
                </a>
            </div>
            <div className={styles.headerNode}>
                <a href='/users' className={styles.headerLink}>
                    Пользователи
                </a>
            </div>
            <div className={styles.headerNode}>
                О нас
            </div>
            { isLoggedIn && 
            <div className={styles.headerNode}>
                <a href='/add_item' className={styles.headerLink}>
                    Добавить предмет  
                </a> 
            </div> }
            { isSuperuser && 
            <div className={styles.headerNode}>
                <a href='/admin-panel-collectioner/' className={styles.headerLink}>
                    Админ-панель  
                </a> 
            </div> }
        </header>
    )
}