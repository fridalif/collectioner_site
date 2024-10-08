import styles from './LoginForm.module.css'
import { useRef, useState, useEffect } from "react";
import { LoginFields, RegisterFields  } from "../LoginFields/LoginFields";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import axios from 'axios';
import Cookies from 'js-cookie';
import { MessageBoxError, MessageBoxGood } from '../MessageBox/MessageBox.jsx';

const serverUrl  = 'http://127.0.0.1:8080/';
const loginToRegister = (elem) => {
    elem.style.transform = 'translateX(0px)';
}

const registerToLogin = (elem) => {
    if (window.innerWidth >= 1500){
        elem.style.transform = 'translateX(500px)';
    }
    if (window.innerWidth >= 1000 && window.innerWidth < 1500){
        elem.style.transform = 'translateX(480px)';
    }

}

export function LoginForm({isLoggedIn}){
    const loginWindow = useRef();
    const [mode, setMode] = useState('login');
    const [isCsrf, setIsCsrf] = useState(null);
    const [message, setMessage] = useState('');
    const [messageCounter, setMessageCounter] = useState(0);
    const [showText, setShowText] = useState(false);
    useEffect(() => {
        getCSRF();
        if(window.innerWidth>=1000){
            setShowText(true);
        }
    }, []);

    const getCSRF = async () => {
        let csrfToken = '';
        await axios.get(serverUrl + 'api/get_csrf/', { withCredentials: true })
        .then((res) => {
            csrfToken = res.headers.get('X-CSRFToken');
            setIsCsrf(csrfToken);
            return csrfToken;
        })
        .catch((err) => console.error(err))
        return csrfToken;
    }

    const loginAsync = async () => {
        let csrfToken = await getCSRF();
        const data = {
            username: document.getElementById('login').value,
            password: document.getElementById('password').value
        }
        axios.post(serverUrl + "api/login/", data, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            }
        })
        .then((res) => {
            res = res.data;
            if (res.status === 'ok') {
                window.location.href = '/';
                return;
            }
            setMessage(res.message);
            setMessageCounter(messageCounter + 1);
        })
        .catch((err) => {setMessage('Произошла непредвиденная ошибка');setMessageCounter(messageCounter + 1);})
    }
    

    const registerAsync = async () => {
        let csrfToken = await getCSRF()
        const data = {
            username: document.getElementById('login').value,
            password: document.getElementById('password').value,
            email: document.getElementById('email').value,
        }
        if (data.password !== document.getElementById('retypePassword').value) {
            setMessage('Пароли не совпадают');
            setMessageCounter(messageCounter + 1);
            return;
        }
        if (data.username == '' || data.password == '' || data.fullname == '' || data.email == '' || data.date_of_birth == '' || data.country == '') {
            setMessage('Заполните все обязательные поля');
            setMessageCounter(messageCounter + 1);
            return;
        }
        axios.post(serverUrl + "api/register/", data, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": csrfToken,
            }
        })
        .then((res) => {
            res = res.data;
            if (res.status === 'ok') {
                setMessage('Подтвердите регистрацию, перейдя по ссылке в письме');
                setMessageCounter(messageCounter + 1);
                return;
            }
            setMessage(res.message);
        })
        .catch((err) => {setMessage('Произошла непредвиденная ошибка');setMessageCounter(messageCounter + 1);})
    }

    return (
        <div className={styles.loginContainerHeight}>
            { message !== '' && message !== 'Подтвердите регистрацию, перейдя по ссылке в письме' && <MessageBoxError key={messageCounter} message={message} displayed={true}/> }
            { message === 'Подтвердите регистрацию, перейдя по ссылке в письме' && <MessageBoxGood key={messageCounter} message={message} displayed={true}/> }
            <div className={styles.loginContainerWidth}>
                <div className={styles.loginBlock}>
                    {showText &&<>
                    <div className={styles.titleAboutLogin}>
                        <div className={styles.headerAbout}>
                            С возвращением на наш сайт!
                        </div>
                        <div className={styles.textAbout}>    
                            Войдите в свою учетную запись, чтобы продолжить делиться своими находками, обмениваться опытом и находить единомышленников, которые разделяют вашу страсть к филателии.
                        </div>
                    </div>
                    <div className={styles.titleAboutRegister}>
                        <div className={styles.headerAbout}>
                            Добро пожаловать на наш сайт!
                        </div>
                        <div className={styles.textAbout}>      
                            Мы рады видеть вас в нашем сообществе увлеченных коллекционеров! Здесь вы сможете делиться своими находками, обмениваться опытом и находить единомышленников, которые разделяют вашу страсть к филателии. <br /> 
                            Зарегистрировавшись, вы получите доступ ко множеству полезных функций: создавайте свои коллекции, участвуйте в обсуждениях, получайте советы от экспертов и следите за новыми поступлениями на рынке. <br />
                            Присоединяйтесь к нам и погружайтесь в увлекательный мир марок. Ваши уникальные истории и открытия ждут своего часа!
                        </div>
                    </div>
                    </>}
                        
                    <div className={styles.loginWindow} ref={loginWindow}>
                        {mode == 'login' ? 
                            <>
                                <LoginFields />
                                <div className={styles.loginButton} onClick={() => {loginAsync()}}>
                                    Войти
                                </div>
                                <div className={styles.loginText} onClick={() => {loginToRegister(loginWindow.current);setMode('register')}}>
                                    <FaRegArrowAltCircleLeft /> Зарегистрироваться
                                </div>
                            </>
                         
                        :
                            <> 
                                <RegisterFields />
                                <div className={styles.loginButton} onClick={() => {registerAsync()}}>
                                    Зарегистрироваться
                                </div>
                                <div className={styles.loginText} onClick={() => {registerToLogin(loginWindow.current);setMode('login')}}>
                                     Войти <FaRegArrowAltCircleRight />
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}