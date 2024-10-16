import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './Title.module.css';
import { MessageBoxError } from '../MessageBox/MessageBox.jsx';


const serverUrl = 'http://127.0.0.1:8080';
export function Title(){
    const [ title, setTitle ] = useState(null);
    const [ message, setMessage ] = useState('');
    const [ messageCounter, setMessageCounter ] = useState(0);

    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        const id = queryParameters.get("id")
        if (id === null || id === undefined || id === '') {
            setMessage('Некорректная ссылка');
            setMessageCounter(messageCounter + 1);
            window.location.href = '/';
        }
        axios
        .get(`${serverUrl}/api/get_titles/${id}/`)
        .then((response) => {
            if(response.data.status !== 'ok'){
                setMessage(response.data.message);
                setMessageCounter(messageCounter + 1);
                return;
            }
            console.log(response.data.data);
            setTitle(response.data.data);
        })
    }, [])

    return(
        <div className={styles.titleContainer}>
            { title!==null &&
            <>
                <div className={styles.titleHeader}>
                    {title.header}
                </div>
                <div className={styles.titleText}>
                    {title.text}
                </div>
            </>
            }
        </div>
    )
}