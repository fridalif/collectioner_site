import styles from './LoginForm.module.css'
import { useRef, useState, useEffect } from "react";
import { LoginFields, RegisterFields  } from "../LoginFields/LoginFields";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import axios from 'axios';
import Cookies from 'js-cookie';


//const serverUrl  = 'http://127.0.0.1:8000/';
const serverUrl  = 'https://ae35-178-176-74-38.ngrok-free.app/';
const loginToRegister = (elem) => {
    elem.style.transform = 'translateX(0px)';
}

const registerToLogin = (elem) => {
    elem.style.transform = 'translateX(500px)';
}

export function LoginForm({isLoggedIn}){
    const loginWindow = useRef();
    const [mode, setMode] = useState('login');
    const [isCsrf, setIsCsrf] = useState(null);

    useEffect(() => {
        getCSRF();
    }, []);

    const getCSRF = async () => {
        await axios.get(serverUrl + 'api/get_csrf/', { withCredentials: true })
        .then((res) => {
            const csrfToken = res.headers.get('X-CSRFToken');
            setIsCsrf(csrfToken);
        })
        .catch((err) => console.error(err))
    }

    const loginAsync = async () => {
        const data = {
            username: document.getElementById('login').value,
            password: document.getElementById('password').value
        }
        axios.post(serverUrl + "api/login/", data, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": isCsrf,
            }
        })
        .then((res) => {
            res = res.data;
            if (res.status === 'ok') {
                window.location.href = '/';
                return;
            }
            alert(res.message);
        })
        .catch((err) => alert('Произошла непредвиденная ошибка'))
    }
    const registerAsync = async () => {
        const data = {
            username: document.getElementById('login').value,
            password: document.getElementById('password').value,
            fullname: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            date_of_birth: document.getElementById('dateOfBirth').value,
            country: document.getElementById('country').value,
            show_fullname: document.getElementById('showFullName').checked,
            show_birth_date: document.getElementById('showBirthDate').checked
        }
        if (data.password !== document.getElementById('retypePassword').value) {
            alert('Пароли не совпадают');
            return;
        }
        if (data.username == '' || data.password == '' || data.fullname == '' || data.email == '' || data.date_of_birth == '' || data.country == '') {
            alert('Заполните все обязательные поля');
            return;
        }
        axios.post(serverUrl + "api/register/", data, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": isCsrf,
            }
        })
        .then((res) => {
            res = res.data;
            if (res.status === 'ok') {
                alert('Подтвердите регистрацию, перейдя по ссылке в письме');
                return;
            }
            alert(res.message);
        })
        .catch((err) => alert('Произошла непредвиденная ошибка'))
    }

    return (
        <div className={styles.loginContainerHeight}>
            <div className={styles.loginContainerWidth}>
                <div className={styles.loginBlock}>
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