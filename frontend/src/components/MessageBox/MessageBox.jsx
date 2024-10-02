import styles from './MessageBox.module.css';
import { ImCross } from "react-icons/im";
import { useState } from 'react';

export function MessageBoxGood({message}){
    const [ display, setDisplay ] = useState(true);

    return(
        display &&
        <div className={styles.messageBoxGood}>
            <div className={styles.messageHeader}>   
                {message}
            </div>
            <ImCross className={styles.closeButton} onClick={() => setDisplay(false)}/>
        </div>
    )
}


export function MessageBoxError({message}){
    const [ display, setDisplay ] = useState(true);
    return(
        display &&
        <div className={styles.messageBoxError}>
            <div className={styles.messageHeader}>   
                {message}
            </div>
            <ImCross className={styles.closeButton} onClick={() => setDisplay(false)}/>
        </div>
    )
}