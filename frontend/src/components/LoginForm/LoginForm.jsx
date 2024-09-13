import styles from './LoginForm.module.css'
import { useRef, useState } from "react";
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

    const getCSRF = () => {
        axios.get(serverUrl + 'api/get_csrf/', { withCredentials: true })
        .then((res) => {
            const csrfToken = res.headers.get('X-CSRFToken');
            setIsCsrf(csrfToken);
        })
        .catch((err) => console.error(err))
    }

    const loginAsync = async () => {
        getCSRF();
        console.log(isCsrf);
        await axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/auth/login/',
            data: { username: 'stackoverflowGuru' },
            headers: { 'X-CSRFToken': isCsrf },
            timeout: 5000 // Ограничение времени ожидания запроса
        });
    }
    

    return (
        <div className={styles.loginContainerHeight}>
            <div className={styles.loginContainerWidth}>
                <div className={styles.loginBlock}>
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