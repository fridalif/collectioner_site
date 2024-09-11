import styles from './Body.module.css';
import {SecondHeader} from '../SecondHeader/SecondHeader.jsx';
export function Body(){

    return(
        <div className={styles.body}>
            <SecondHeader />
        </div>
    )
}