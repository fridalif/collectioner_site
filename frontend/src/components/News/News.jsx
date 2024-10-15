import styles from './News.module.css'
import { useEffect, useState } from 'react'
import axios from 'axios';
import { MessageBoxError } from '../MessageBox/MessageBox';

const serverUrl = 'http://127.0.0.1:8080';

export function News(){
    const [ page, setPage ] = useState(1);
    const [ itemsInRow, setItemsInRow ] = useState(3);
    const [ itemInPage, setItemInPage ] = useState(12);
    const [ news, setNews ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);

    useEffect(() => {
        axios
        .get(`${serverUrl}/api/get_titles/?limit=${itemInPage}&offset=${(page-1)*itemInPage}`)
        .then((response) => {
            if(response.data.status !== 'ok'){
                setMessage(response.data.message);
                setMessageCounter(messageCounter + 1);
                return;
            }
            setNews(response.data.data);
        })
    }, [page])

    return (
        <div className={styles.newsContainer}>
            {message!=='' && <MessageBoxError message={message} displayed={true}/>}
        </div>
    )
}