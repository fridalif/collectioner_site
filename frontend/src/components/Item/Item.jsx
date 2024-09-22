import styles from './Item.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';


const serverUrl = 'http://127.0.0.1:8080';
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
        axios.get(`${serverUrl}/api/get_item_image_urls/`, {params: {items_ids: [itemId]}})
        .then(response_images => {
            if (response_images.data.status !== 'ok'){
                alert(response_images.data.message);
                return;
            }
            console.log(response_images.data.data);
            setImagesList(response_images.data.data);
        })
        .catch((err)=>console.log(err))
    },[])
    return(
        <div className={styles.pageBody}>
            <div className={styles.contentContainer}>
                <div className={styles.contentImagesRow}>
                    <div className={styles.contentMainImage}>
                        <img src={imagesList!==null && imagesList[currentImage].image_url} style={{width:'200px', height:'200px'}}/>
                    </div>
                    { imagesList!==null && imagesList.map((element,index)=>{
                        if (index%2==1){
                            return(<></>);
                        }
                        return(
                            <div className={styles.contentMiniImagesColumn}>
                                <div className={index !== currentImage ? styles.contentMiniImage : styles.contentMiniImageChosen } onClick={()=>setCurrentImage(index)}>
                                    <img src={element.image_url} style={{width:'45px', height:'45px'}}/>
                                </div>
                                {imagesList.length>index+1 && 
                                    <div className={index+1 !== currentImage ? styles.contentMiniImage : styles.contentMiniImageChosen } onClick={()=>setCurrentImage(index+1)}>
                                        <img src={imagesList[index+1].image_url} style={{width:'45px', height:'45px'}}/>
                                    </div>
                                }
                            </div>
                        );
                    })}
                
                </div>
            </div>
        </div>
    )
}