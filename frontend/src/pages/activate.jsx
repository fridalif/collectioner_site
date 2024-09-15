import {Header} from '../components/Header/Header.jsx';
import {Body} from '../components/Body/Body.jsx';
import { useEffect } from 'react';
import axios from 'axios';

export default function Activate(){
    
    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        const hash = queryParameters.get("hash")
        if (!hash) {
            window.location.href = '/login';
        }
        axios.
            get(`http://127.0.0.1:8000/api/activate_user/${hash}/`).
            then((response) => {
                response = response.data;
                if (response.status === 'ok') {
                    alert('Активация прошла успешно');
                    window.location.href = '/';
                }
                else {

                    alert(response.message);
                    window.location.href = '/login';
                }
            })
            .catch((err) => console.error(err))
    }, [])
    return(
        <div>
           Активация акканута
        </div>
    )
}