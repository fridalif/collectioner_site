import styles from './Item.module.css';
import { useState, useEffect } from 'react';

const serverUrl = 'http://127.0.0.1';
export function Item({isLoggedIn}){
    let itemId = 1;
    const [ imagesList, setImagesList ] = useState(null);
    const [ currentImage, setCurrentImage ] = useState(0);
    const [ characteristics, setCharacteristics] = useState(null);

    useEffect(()=>{
        const query = new URLSearchParams(window.location.search);
        itemId = query.get('item_id');
        if (itemId === null || itemId === ''){
            window.location.href = '/catalog';
            return;
        }
    },[])
    return(
        <div className={styles.pageBody}>
            <div className={styles.contentContainer}>
                <div className={styles.contentImagesRow}>
                    <div className={styles.contentMainImage}>
                        <img src='/media/images/avatar.png' style={{width:'200px', height:'200px'}}/>
                    </div>
                    <div className={styles.contentMiniImagesColumn}>
                        <div className={styles.contentMiniImage}>
                            <img src='/media/images/avatar.png' style={{width:'45px', height:'45px'}}/>
                        </div>
                        <div className={styles.contentMiniImage}>
                            
                        </div>
                    </div>
                
                </div>
            </div>
        </div>
    )
}