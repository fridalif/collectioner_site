import {Header} from '../components/Header/Header.jsx';
import {Body} from '../components/Body/Body.jsx';
import { useState } from 'react';
import axios from 'axios';

export default function Home(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const mode = 'Login';
    axios
    .get('http://127.0.0.1:8000/api/is_logged_in/')
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