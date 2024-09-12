import styles from './Header.module.css';


export function Header(){
    return(
        <header className={styles.header}>
            <div className={styles.headerNode}>
                Главная
            </div>
            <div className={styles.headerNode}>
                Новости
            </div>
            <div className={styles.headerNode}>
                Каталог
            </div>
            <div className={styles.headerNode}>
                Пользователи
            </div>
            <div className={styles.headerNode}>
                О нас
            </div>
        </header>
    )
}