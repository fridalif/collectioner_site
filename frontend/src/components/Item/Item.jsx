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
        axios.get(`${serverUrl}/api/get_items/${itemId}/`, { withCredentials: true })
        .then((response) => {
            if (response.data.status !== 'ok') {
                alert(response.data.message);
                return;
            }
            console.log(response.data.data);
            setCharacteristics(response.data.data);
        })
        .catch((err) => console.error(err))
    },[])
    return(
        <div className={styles.pageBody}>
            <div className={styles.contentContainer}>
                <div className={styles.contentImagesRow}>
                    <div className={styles.contentMainImage}>
                        <img src={imagesList!==null && imagesList.length>0 &&imagesList[currentImage].image_url} style={{width:'200px', height:'200px'}} alt='Нет изображения'/>
                    </div>
                    { imagesList!==null &&imagesList.map((element,index)=>{
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
                <div className={styles.contentCharacteristicAndAddtoCollection}>
                    <div className={styles.contentCharacteristics}>
                        { characteristics!==null && characteristics.name!==null &&
                        <div className={styles.contentCharacteristicsRow} style={{fontWeight:'bold', fontSize:'24px'}}>
                            {characteristics.name}
                        </div>
                        }
                        { characteristics !== null && characteristics.country_name!==null &&
                        <div className={styles.contentCharacteristicsRow}>
                            <div>
                                Страна:
                            </div>
                            <div>
                                <img src={characteristics.country_flag} style={{width:'20px', height:'20px'}} alt=''/>{characteristics.country_name}
                            </div>
                        </div>
                        }
                        {
                            characteristics !== null && characteristics.history_moment_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Исторический момент:
                                </div>
                                <div>
                                    {characteristics.history_moment_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.year!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Год:
                                </div>
                                <div>
                                    {characteristics.year}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.width!==null && characteristics.height !== null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Размер:
                                </div>
                                <div>
                                    {characteristics.width}x{characteristics.height}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.format_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Формат:
                                </div>
                                <div>
                                    {characteristics.format_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.currency_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Валюта:
                                </div>
                                <div>
                                    {characteristics.currency_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.press_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Типография:
                                </div>
                                <div>
                                    {characteristics.press_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.designer_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Дизайнер:
                                </div>
                                <div>
                                    {characteristics.designer_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.emission_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Эмиссия:
                                </div>
                                <div>
                                    {characteristics.emission_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.glue_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Клей:
                                </div>
                                <div>
                                    {characteristics.glue_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.nominal!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Номинал:
                                </div>
                                <div>
                                    {characteristics.nominal}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.stamp_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Печать:
                                </div>
                                <div>
                                    {characteristics.stamp_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.watermark_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Водяной знак:
                                </div>
                                <div>
                                    {characteristics.watermark_name}
                                </div>
                            </div>
                        }
                        {
                            characteristics !== null && characteristics.theme_name!==null &&
                            <div className={styles.contentCharacteristicsRow}>
                                <div>
                                    Тема:
                                </div>
                                <div>
                                    {characteristics.theme_name}
                                </div>
                            </div>
                        }
                    </div>
                    <div className={styles.contentCharacteristics}>
                        { isLoggedIn && 
                        <>
                            <div className={styles.contentCharacteristicsRow} style={{fontWeight:'bold', fontSize:'24px'}}>
                                Добавить в коллекцию
                            </div>
                        </>
                        }
                        
                    </div>
                </div>
            </div>
        </div>
    )
}