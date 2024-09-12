import styles from './LoginForm.module.css'
import { useRef, useState } from "react";

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
                    <div className={styles.loginWindow} ref={loginWindow} onClick={
                        mode == 'login' ? 
                            () => {loginToRegister(loginWindow.current); setMode('register')} 
                        : 
                            () => {registerToLogin(loginWindow.current); setMode('login')}
                    }>
                        jklhfdkha
                    </div>
                </div>
            </div>
        </div>
    )

}