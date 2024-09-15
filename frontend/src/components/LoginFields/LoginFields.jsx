import styles from './LoginFields.module.css'

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
                <input className={styles.registerInput} type='text' placeholder='Страна' id='country'/>
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