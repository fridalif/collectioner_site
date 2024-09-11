import styles from './Body.module.css';
import {SecondHeader} from '../SecondHeader/SecondHeader.jsx';
import {WelcomeMessage} from '../WelcomeMessage/WelcomeMessage.jsx';
import {LastAddedMarks} from '../LastAddedMarks/LastAddedMarks.jsx';

export function Body(){

    return(
        <div className={styles.body}>
            <SecondHeader />
            <WelcomeMessage />
            <LastAddedMarks />
        </div>
    )
}