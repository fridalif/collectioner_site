import styles from './LastAddedMarks.module.css'
import Image from 'next/image'
import markImage from './mark.jpg'
export function LastAddedMarks(){
    return(
        <div className={styles.lastAddedMarksContainer}>
        <div className={styles.lastAddedMarks}>
            <div className={styles.lastAddedMarksTitle}>
                Последние добавленные марки
            </div>
            <div className={styles.lastAddedMarksMark}>
                <Image src={markImage} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                <div className={styles.lastAddedMarksMarkText}>
                    Новая марка
                </div>
            </div>
            <div className={styles.lastAddedMarksMark}>
                <Image src={markImage} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                <div className={styles.lastAddedMarksMarkText}>
                    Новая марка
                </div>
            </div>
        </div>
        </div>
    )
}