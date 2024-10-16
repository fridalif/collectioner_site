import styles from './Titles.module.css'
import { FaArrowRight } from "react-icons/fa";
import { useWindowSize } from "@uidotdev/usehooks";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageBoxError } from '../MessageBox/MessageBox';

const serverUrl  = 'http://127.0.0.1:8080';

export function Titles(){
    const [ titles, setTitles ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);
    const size = useWindowSize();
    const [ counterPerPage, setCounterPerPage ] = useState(3);

    useEffect(() => {
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
                Статьи
            </div>
            {titles.map((title, index) => {
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
        </div>
        </>
    )
}


