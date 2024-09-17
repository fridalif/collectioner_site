import styles from './LoginFields.module.css'
import { useEffect, useRef } from 'react'
import axios from 'axios';


const serverUrl  = 'http://127.0.0.1:8080';
export function LoginFields(){
    return(
        <>
            <div className={styles.loginHeader}>
                Вход
            </div>
            <input className={styles.loginInput} type='text' placeholder='Почта или Логин' id='login'/>
            <input className={styles.loginInput} type='password' placeholder='Пароль' id='password'/>
            <div className={styles.loginForgotPass}>
                Забыли пароль?
            </div>
        </>
    )
}

export function RegisterFields(){
    
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
            
        </>
    )
}