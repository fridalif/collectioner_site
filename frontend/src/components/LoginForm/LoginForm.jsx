import styles from './LoginForm.module.css'
import { useRef, useState, useEffect } from "react";
import { LoginFields, RegisterFields  } from "../LoginFields/LoginFields";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import axios from 'axios';
import Cookies from 'js-cookie';


const serverUrl  = 'http://127.0.0.1:8000/';
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
        console.log(isCsrf);
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
            console.log(res.data);
        });
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
                                <div className={styles.loginButton}>
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