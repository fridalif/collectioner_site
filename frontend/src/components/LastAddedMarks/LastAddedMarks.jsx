import styles from './LastAddedMarks.module.css'
import Image from 'next/image'
import markImage from './mark.jpg'
import { useState, useEffect } from 'react'
import axios from 'axios'



const serverUrl  = 'http://127.0.0.1:8080';
export function LastAddedMarks(){
    const [ lastAddedMarks, setLastAddedMarks ] = useState([])

    useEffect(() => {
        axios
            .get(`${serverUrl}/api/get_items/?offset=0&limit=10`)
            .then(response => {
                console.log(response.data);
                response = response.data;
                if (response.status === 'ok'){
                    setLastAddedMarks(response.data);
                    return;
                }
                alert(response.message);
            })
            .catch(error => console.error(error))
        },
        []
    )
    return(
        <div className={styles.lastAddedMarksContainer}>
        <div className={styles.lastAddedMarks}>
            <div className={styles.lastAddedMarksTitle}>
                Последние добавленные марки
            </div>
            { lastAddedMarks.length > 0 && lastAddedMarks.map((mark) => (
                <div className={styles.lastAddedMarksMark}>
                <Image src={markImage} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                <div className={styles.lastAddedMarksMarkText} id={mark.id}>
                    {mark.name}
                </div>
                </div>
            ))
            }
        </div>
        </div>
    )
}