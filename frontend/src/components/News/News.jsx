import styles from './News.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { MessageBoxError } from '../MessageBox/MessageBox';
import { useWindowSize } from "@uidotdev/usehooks";
import { FaArrowRight } from "react-icons/fa";

const serverUrl = 'http://127.0.0.1:8080';

export function News(){
    const [ page, setPage ] = useState(1);
    const [ itemsInRow, setItemsInRow ] = useState(3);
    const [ itemInPage, setItemInPage ] = useState(12);
    const [ news, setNews ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);
    const size = useWindowSize();
    useEffect(() => {
        axios
        .get(`${serverUrl}/api/get_titles/?limit=${itemInPage}&offset=${(page-1)*itemInPage}`)
        .then((response) => {
            if(response.data.status !== 'ok'){
                setMessage(response.data.message);
                setMessageCounter(messageCounter + 1);
                return;
            }
            console.log(response.data.data);
            setNews([...news, ...response.data.data]);
        })
    }, [page])

    useEffect(() => {
        if (size.width <= 1000){
            setItemsInRow(1);
            return
        }
        if (size.width <= 1500){
            setItemsInRow(2);
            return
        }
        setItemsInRow(3);
    }, [size]);
    const handleScroll = () => {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight) {
            setPage(page + 1);
        } 
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    },[])

    return (
        <div className={styles.newsContainer}>
            {message!=='' && <MessageBoxError message={message} displayed={true}/>}
            {news.map((item, index) => {
                if (index % itemsInRow === 0){
                    return (
                        <div className={styles.newsRow}>
                            <div className={styles.titlesArticle}>
                                <div className={styles.titlesArticleHeader}>
                                    {item.header}
                                </div>
                                <div className={styles.titlesArticleTextContainer}>
                                    <div className={styles.titlesArticleText}>
                                        {item.text}
                                    </div>
                                    <a href={`/title?id=${news[index].id}`} className={styles.titlesArticleLink}>
                                        Читать далее <FaArrowRight /> 
                                    </a>
                                </div>

                            </div>
                            {index + 1 < index+itemsInRow && news.length > index+1 &&
                                <div className={styles.titlesArticle}>
                                    <div className={styles.titlesArticleHeader}>
                                        {news[index+1].header}
                                    </div>
                                    <div className={styles.titlesArticleTextContainer}>
                                        <div className={styles.titlesArticleText}>
                                            {news[index+1].text}
                                        </div>
                                        <a href={`/title?id=${news[index+1].id}`} className={styles.titlesArticleLink}>
                                            Читать далее <FaArrowRight /> 
                                        </a>
                                    </div>
                                </div>
                            }
                            {index + 2 < index+itemsInRow && news.length > index+2 &&
                                <div className={styles.titlesArticle}>
                                    <div className={styles.titlesArticleHeader}>
                                        {news[index+2].header}
                                    </div>
                                    <div className={styles.titlesArticleTextContainer}>
                                        <div className={styles.titlesArticleText}>
                                            {news[index+2].text}
                                        </div>
                                        <a href={`/title?id=${news[index+2].id}`} className={styles.titlesArticleLink}>
                                            Читать далее <FaArrowRight /> 
                                        </a>
                                    </div>
                                </div>
                            }
                        
                        </div>
                    )
                }
            })}
        </div>
    )
}