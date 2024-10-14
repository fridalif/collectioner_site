import styles from './Body.module.css';
import {SecondHeader} from '../SecondHeader/SecondHeader.jsx';
import {WelcomeMessage} from '../WelcomeMessage/WelcomeMessage.jsx';
import {LastAddedMarks} from '../LastAddedMarks/LastAddedMarks.jsx';
import {Titles} from '../Titles/Titles.jsx';
import {LoginForm} from '../LoginForm/LoginForm.jsx';
import {Profile} from '../Profile/Profile.jsx';
import { Catalog } from '../Catalog/Catalog.jsx';
import { Item } from '../Item/Item.jsx'
import { Users } from '../Users/Users.jsx'
import { AddItem } from '../AddItem/AddItem.jsx'
import { MessageBoxGood, MessageBoxError } from '../MessageBox/MessageBox';

export function Body({isLoggedIn, mode}){

    return(
        <div className={styles.body}>
            <SecondHeader isLoggedIn={isLoggedIn}/>
            { mode =='Home' &&
                <div className={styles.bodyContent}>
                    <WelcomeMessage />
                    <LastAddedMarks />
                    <Titles />
                </div>
            }
            { mode =='Login' &&
                <>
                    <LoginForm />
                </>
            } 
            {
                mode == 'Profile' && <div className={styles.bodyContent}><Profile /></div>
            }
            {
                mode == 'Catalog' && <div className={styles.bodyContent} style={{width:'100%', }}><Catalog /></div>
            }  
            {
                mode == 'Item' && <div className={styles.bodyContent}><Item isLoggedIn={isLoggedIn} /></div>
            }
            { 
                mode == 'Users' && <div className={styles.bodyContent}><Users /></div> 
            }
            {
                mode == 'AddItem' && <div className={styles.bodyContent}><AddItem /></div>
            }
            { mode == 'News' && <div className={styles.bodyContent}>News</div> }
        </div>
    )
}