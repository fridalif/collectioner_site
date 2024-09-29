import {Header} from '../components/Header/Header.jsx';
import {Body} from '../components/Body/Body.jsx';
import { useState } from 'react';
import axios from 'axios';

const serverUrl  = 'http://127.0.0.1:8080';
export default function CatalogIndex(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const mode = 'Catalog';
    axios
    .get(`${serverUrl}/api/is_logged_in/`,{ withCredentials: true })
    .then((response) => {
        setIsLoggedIn(response.data.data['is_logged_in']);
        console.log(response.data.data['is_logged_in']);
    })
    return (
        <>
            <Header isLoggedIn={isLoggedIn} />
            <Body isLoggedIn={isLoggedIn} mode={mode}/>
        </>
    )
}