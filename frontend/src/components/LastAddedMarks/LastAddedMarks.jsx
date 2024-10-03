import styles from './LastAddedMarks.module.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { IoIosArrowDroprightCircle, IoIosArrowDropleftCircle } from "react-icons/io";
import { MessageBoxError, MessageBoxGood } from '../MessageBox/MessageBox.jsx';


const serverUrl  = 'http://127.0.0.1:8080';
export function LastAddedMarks(){
    const [ lastAddedMarks, setLastAddedMarks ] = useState([])
    const [ startFrom, setStartFrom ] = useState(0)
    const [ messages, setMessages ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);

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
                                setMessages(response_images.data.message);
                                setMessageCounter(messageCounter + 1);
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
                setMessages(response.message);
                setMessageCounter(messageCounter + 1);
            })
            .catch(error => console.error(error))
        },
        []
    )
    const prevCard = () => {
        if (startFrom>0){
            setStartFrom(startFrom-1);
        }
    }

    const nextCard = () => {
        if (startFrom+5<10){
            setStartFrom(startFrom+1);
        }
    }

    return(
        <div className={styles.lastAddedMarksContainer}>
            { messages !== '' && <MessageBoxError message={messages} key={messageCounter} displayed={true}/> }
        <div className={styles.lastAddedMarks}>
            <div className={styles.lastAddedMarksTitle}>
                Последние добавленные марки
            </div>
            { lastAddedMarks.length > 0 && lastAddedMarks.length <=6 && lastAddedMarks.map((mark) => (
                <div className={styles.lastAddedMarksMark}>
                <img src={mark.image_url} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                <div className={styles.lastAddedMarksMarkText} id={mark.id}>
                    {mark.name}
                </div>
                </div>
            ))
            }
            { lastAddedMarks.length > 6 && startFrom==0 &&
                    <div className={styles.prevButtonChosen}>
                        <IoIosArrowDropleftCircle />
                    </div>
            }
            { lastAddedMarks.length > 6 && startFrom>0 &&
                    <div className={styles.prevButton} onClick={()=>prevCard()}>
                        <IoIosArrowDropleftCircle />
                    </div>
            }
            {
                lastAddedMarks.length > 6 && lastAddedMarks.map((mark,index)=>(
                    startFrom<=index && index<startFrom+5 &&
                    <div className={styles.lastAddedMarksMark} onClick={()=>window.location.href=`/item?item_id=${mark.id}`}>
                        <img src={mark.image_url} alt="mark" width={150} height={150} className={styles.lastAddedMarksMarkImg} /><br />
                        <div className={styles.lastAddedMarksMarkText} id={mark.id}>
                            {mark.name}
                        </div>
                    </div>
                ))
            }
            { lastAddedMarks.length > 6 && startFrom+5 < 10 &&
                    <div className={styles.prevButton} onClick={()=>nextCard()}>
                        <IoIosArrowDroprightCircle />
                    </div>
            }
            { lastAddedMarks.length > 6 && startFrom+5 >= 10 &&
                    <div className={styles.prevButtonChosen}>
                        <IoIosArrowDroprightCircle />
                    </div>
            }
        </div>
        </div>
    )
}