import styles from './Titles.module.css'
import { FaArrowRight } from "react-icons/fa";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageBoxError } from '../MessageBox/MessageBox';

const serverUrl  = 'http://127.0.0.1:8080';

export function Titles({isNews}){
    const [ titles, setTitles ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);
    const size = useWindowSize();
    const [ counterPerPage, setCounterPerPage ] = useState(3);
    const [ lastAddedMarks, setLastAddedMarks ] = useState([])

    useEffect(() => {
        if (isNews){
            axios
            .get(`${serverUrl}/api/get_titles/?limit=3`)
            .then((response) => {
                if(response.data.status !== 'ok'){
                    setMessage(response.data.message);
                    setMessageCounter(messageCounter + 1);
                    return;
                }
                setTitles(response.data.data);
            })
        }
        else{
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
                    axios.get(`${serverUrl}/api/get_articles/`, {params: {items_ids: items_ids, only_main: true}})
                        .then(response_images => {
                            if (response_images.data.status !== 'ok'){
                                setMessages(response_images.data.message);
                                setMessageCounter(messageCounter + 1);
                                return;
                            }
                            setTitles(response_images.data.data);
                        })
                        .catch(error => console.error(error))    
                    return;
                }
                setMessages(response.message);
                setMessageCounter(messageCounter + 1);
                
            })
            .catch(error => console.error(error))
        }
    }, [])
    
    useEffect(() => {
        if (size.width <= 550){
            setCounterPerPage(2);
            return
        }
        setCounterPerPage(3);
    }, [size])
    return(
        <>
        {message && <MessageBoxError message={message} displayed={messageCounter > 0} />}
        <div className={styles.titles}>
            <div className={styles.titlesTitle}>
                {isNews ? 'Новости' : 'Статьи'}
            </div>
            {isNews &&titles.map((title, index) => {
                if (index > counterPerPage-1){
                    return(<></>);
                }
                return(
                    <div className={styles.titlesArticle} key={index}>
                        <div className={styles.titlesArticleHeader}>
                            {title.header}
                        </div>
                        <div className={styles.titlesArticleTextContainer}>
                            <div className={styles.titlesArticleText}>
                                {title.text}
                            </div>
                            <a href={`/title?id=${title.id}`} className={styles.titlesArticleLink}>
                                Читать далее<FaArrowRight/>
                            </a>
                        </div>
                    </div>
                )
            })}
            {!isNews &&titles.map((title, index) => {
                if (index > counterPerPage-1){
                    return(<></>);
                }
                return(
                    <div className={styles.titlesArticle} key={index}>
                        <div className={styles.titlesArticleHeader}>
                            {title.header}
                        </div>
                        <div className={styles.titlesArticleTextContainer}>
                            <div className={styles.titlesArticleText}>
                                {title.text}
                            </div>
                            <a href={title.link} className={styles.titlesArticleLink}>
                                Читать далее<FaArrowRight/>
                            </a>
                        </div>
                    </div>
                )
            })}
        </div>
        </>
    )
}


