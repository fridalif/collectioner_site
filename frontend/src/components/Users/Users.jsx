import styles from './Users.module.css'
import { IoMdSearch } from "react-icons/io";
import { useState, useEffect } from 'react'
import axios from 'axios';
import { MessageBoxError, MessageBoxGood } from '../MessageBox/MessageBox.jsx';

const serverUrl = 'http://127.0.0.1:8080';
export function Users(){
    const [ users, setUsers ] = useState([]);
    const [ offset, setOffset ] = useState(0);
    const [ total, setTotal ] = useState(0);
    const [ message, setMessage ] = useState('');
    const limit = 30;

    const getInfoWithQuery = async ()=>{
        let query = document.querySelector('#searchUsers').value;
        axios
        .get(`${serverUrl}/api/get_users_list/?offset=${offset}&limit=${limit}&query=${query}`, { withCredentials: true })
        .then((response) => {
            if(response.data.status !== 'ok'){
                setMessage(response.data.message);
                return;
            }
            if(users.length > 0){
                setUsers([...users, ...response.data.data]);
            }
            else{
                setUsers(response.data.data);
            }
            setTotal(response.data.total);
            console.log(response.data.data);
        })
        .catch((err) => console.error(err))
    }

    useEffect(() => {
        const getInfo = async ()=>{
            let data = await getInfoWithQuery();
        }

        getInfo();
    },[offset]);

    return(
        <div className={styles.content}>
            {message!=='' && <MessageBoxError message={message} displayed={true}/>}
            <div className={styles.searchField}>
                <input type="text" placeholder="Искать пользователя..." className={styles.searchFieldInput} id='searchUsers'/>
                <IoMdSearch className={styles.secondHeaderSearchfieldImg} onClick={() => getInfoWithQuery()}/>
            </div>
            <div className={styles.usersTable}>
                {
                    users.length > 0 && users.map((user) => (
                        <div className={styles.usersTableRow} onClick={() => window.location.href='/profile/?user_id='+user.id}>
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <img style={{width: '40px', height: '40px', borderRadius: '3px'}} src={user.avatar_url} alt=""/>
                                {user.username}
                            </div>
                            {user.country != null && 
                            <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                {user.country}
                                {user.flag !== null && <img style={{width: '20px', height: '20px', borderRadius: '3px'}} src={user.flag} alt=""/>}
                            </div>}
                        </div>       
                    ))
                }
                {
                    users.length > 0 && total>0 && users.length < total &&
                    <div className={styles.usersTableRow} style={{display:'flex',justifyContent:'center',alignItems:'center'}} onClick={() => setOffset(offset+limit)}>
                            Загрузить ещё
                    </div>
                }
            </div>
        </div>
    );
}