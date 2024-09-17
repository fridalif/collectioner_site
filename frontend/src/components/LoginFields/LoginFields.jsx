import styles from './LoginFields.module.css'
import { useEffect, useRef } from 'react'
import axios from 'axios';


//const serverUrl  = 'http://127.0.0.1:8000/';
const serverUrl  = 'https://ae35-178-176-74-38.ngrok-free.app';
export function LoginFields(){
    return(
        <>
            <div className={styles.loginHeader}>
                Вход
            </div>
            <input className={styles.loginInput} type='text' placeholder='Логин' id='login'/>
            <input className={styles.loginInput} type='password' placeholder='Пароль' id='password'/>
            <div className={styles.loginForgotPass}>
                Забыли пароль?
            </div>
        </>
    )
}

export function RegisterFields(){
    
    const contriesField = useRef();

    useEffect(() => {
        axios
            .get(`${serverUrl}/api/get_countries/`,{ withCredentials: true })
            .then((response) => {
                response = response.data;
                if (response.status === 'ok') {
                    let contriesHTML = "<option value=''>Страна</option>";
                    response.data.forEach((elem) => {
                        contriesHTML = contriesHTML + `<option value='${elem.id}'>${elem.name}</option>`
                    })
                    contriesField.current.innerHTML = contriesHTML;
                }
                else {
                    alert(response.message);
                }
            })
    }, [])


    return(
        <>
            <div className={styles.loginHeader}>
                Регистрация
            </div>
            <div className={styles.registerInputContainer}>
                <label className={styles.label} for='login'> Логин </label> 
                <input className={styles.registerInput} type='text' placeholder='Логин' id='login'/>
            </div>
            <div className={styles.registerInputContainer}>
                <label className={styles.label} for='fullName'> ФИО </label> 
                <input className={styles.registerInput} type='text' placeholder='ФИО' id='fullName'/>
            </div>
            <div className={styles.registerInputContainer}>
                <label className={styles.label} for='email'> Почта </label> 
                <input className={styles.registerInput} type='email' placeholder='Почта' id='email'/>
            </div>
            <div className={styles.registerInputContainer}>
                <label className={styles.label} for='password'> Пароль </label> 
                <input className={styles.registerInput} type='password' placeholder='Пароль' id='password'/>
            </div>
            <div className={styles.registerInputContainer}>
            <label className={styles.label} for='retypePassword'> Повторите пароль </label> 
                <input className={styles.registerInput} type='password' placeholder='Повторите пароль' id='retypePassword'/>
            </div>
            <div className={styles.registerInputContainer}>
                <label className={styles.labelBirth} for='dateOfBirth'> Дата рождения </label> 
                <input className={styles.registerInput} type='date' placeholder='Дата рождения' id='dateOfBirth'/>
            </div>
            <div className={styles.registerInputContainer}>
                <label className={styles.label} for='contry'> Страна </label> 
                <select className={styles.registerInput} type='text' placeholder='Страна' id='country' ref={contriesField}>
                    <option value=''>Страна</option>

                </select>
            </div>
            <div className={styles.registerInputContainer}>
                <input className={styles.registerInputCheckbox} type='checkbox' name='showFullName' id='showFullName' /> Отображать ФИО другим пользователям
            </div>
            <div className={styles.registerInputContainer}>
                <input className={styles.registerInputCheckbox} type='checkbox' name='showBirthDate' id='showBirthDate'/> Отображать дату рождения другим пользователям
            </div>
        </>
    )
}