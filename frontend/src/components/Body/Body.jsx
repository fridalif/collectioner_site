import styles from './Body.module.css';
import {SecondHeader} from '../SecondHeader/SecondHeader.jsx';
import {WelcomeMessage} from '../WelcomeMessage/WelcomeMessage.jsx';
import {LastAddedMarks} from '../LastAddedMarks/LastAddedMarks.jsx';
import {Titles} from '../Titles/Titles.jsx';

export function Body({isLoggedIn, mode}){

    return(
        <div className={styles.body}>
            <SecondHeader isLoggedIn={isLoggedIn}/>
            { mode =='Home' ?
                <>
                    <WelcomeMessage />
                    <LastAddedMarks />
                    <Titles />
                </>
            :
                <>
                </>
            }   
        </div>
    )
}