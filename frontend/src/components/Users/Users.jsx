import styles from './Users.module.css'
import { IoMdSearch } from "react-icons/io";
import { useState, useEffect } from 'react'
import axios from 'axios';

const serverUrl = 'http://127.0.0.1:8080';
export function Users(){
    const [ users, setUsers ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    useEffect(() => {
        axios
        .get(`${serverUrl}/api/get_users_list/?offset=${offset}&limit=30`, { withCredentials: true })
        .then((response) => {
            if(response.data.status !== 'ok'){
                alert(response.data.message);
                return;
            }
            setUsers(response.data.data);
            console.log(response.data.data);
        })
        .catch((err) => console.error(err))
    }, [offset])

    return(
        <div className={styles.content}>
            <div className={styles.searchField}>
                <input type="text" placeholder="Искать пользователя..." className={styles.searchFieldInput} />
                <IoMdSearch className={styles.secondHeaderSearchfieldImg} />
            </div>
            <div className={styles.usersTable}>
                <div className={styles.usersTableRow}>

                </div>
            </div>
        </div>
    );
}