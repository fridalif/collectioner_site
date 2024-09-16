import {Header} from '../components/Header/Header.jsx';
import {Body} from '../components/Body/Body.jsx';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const mode = 'Profile';
    const userId = 0;
    useEffect(() => {
        const queryParameters = new URLSearchParams(window.location.search)
        userId = queryParameters.get("userId")
    }, [])
    axios
    .get('http://127.0.0.1:8000/api/is_logged_in/',{ withCredentials: true })
    .then((response) => {
        setIsLoggedIn(response.data.data['is_logged_in']);
        console.log(response.data.data['is_logged_in']);
    })
    return (
        <>
            <Header />
            <Body isLoggedIn={isLoggedIn} mode={mode}/>
        </>
    )
}