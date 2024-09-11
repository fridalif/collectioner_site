import styles from './Header.module.css';


export function Header(){
    return(
        <header class={styles.header}>
            <div class={styles.headerNode}>
                Главная
            </div>
            <div class={styles.headerNode}>
                Новости
            </div>
            <div class={styles.headerNode}>
                Каталог
            </div>
            <div class={styles.headerNode}>
                Пользователи
            </div>
            <div class={styles.headerNode}>
                О нас
            </div>
        </header>
    )
}