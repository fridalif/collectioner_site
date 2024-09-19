import styles from './LastAddedMarks.module.css'
import Image from 'next/image'
import markImage from './mark.jpg'
import { useState, useEffect } from 'react'
import axios from 'axios'



const serverUrl  = 'http://127.0.0.1:8080';
export function LastAddedMarks(){
    const [ lastAddedMarks, setLastAddedMarks ] = useState([])

    useEffect(async () => {
        axios
            .get(`${serverUrl}/api/get_items/?offset=0&limit=10`)
            .then(response => {
                console.log(response.data);
                response = response.data;
                if (response.status === 'ok'){
                    let items_ids = []
                    for (let i = 0; i < response.data.length; i++){
                        items_ids.push(response.data[i].id)
                    }
                    axios.get(`${serverUrl}/api/get_item_image_urls/`, {params: {items_ids: items_ids, only_main: true}})
                        .then(response_images => {
                            if (response_images.data.status !== 'ok'){
                                alert(response_images.data.message);
                                return;
                            }
                            for (let i = 0; i < response.data.length; i++){
                                for (let j = 0; j < response_images.data.data.length; j++){
                                    if (response.data[i].id === response_images.data.data[j].item_id){
                                        response.data[i].image_url = response_images.data.data[j].image_url
                                    }
                                }
                            }
                            console.log(response.data);
                            setLastAddedMarks(response.data);
                        })
                        .catch(error => console.error(error))    
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
                <img src={mark.image_url} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
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