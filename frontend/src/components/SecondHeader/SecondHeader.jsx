import styles from './SecondHeader.module.css'

export function SecondHeader(){
    return(
        <div class={styles.secondHeader}>
            <div class={styles.secondHeaderSearchfield}>
                <input type="text" placeholder="Искать на сайте..." class={styles.secondHeaderSearchfieldInput} />
                <img src="lupa.png" class={styles.secondHeaderSearchfieldImg} />
            </div>
            <div class={styles.secondHeaderCabinet}>
                 Личный кабинет
            </div>
        </div>
    )
}