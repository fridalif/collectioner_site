import styles from './Body.module.css';
import {SecondHeader} from '../SecondHeader/SecondHeader.jsx';
export function Body(){

    return(
        <div class={styles.body}>
            <SecondHeader />
        </div>
    )
}