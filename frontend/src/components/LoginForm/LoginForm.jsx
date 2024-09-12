import styles from './LoginForm.module.css'
import { useRef, useState } from "react";
import { LoginFields, RegisterFields  } from "../LoginFields/LoginFields";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";

const loginToRegister = (elem) => {
    elem.style.transform = 'translateX(0px)';
}

const registerToLogin = (elem) => {
    elem.style.transform = 'translateX(500px)';
}

export function LoginForm({isLoggedIn}){
    const loginWindow = useRef();
    const [mode, setMode] = useState('login');
    return (
        <div className={styles.loginContainerHeight}>
            <div className={styles.loginContainerWidth}>
                <div className={styles.loginBlock}>
                    <div className={styles.loginWindow} ref={loginWindow}>
                        {mode == 'login' ? 
                            <>
                                <LoginFields />
                                <div className={styles.loginButton}>
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