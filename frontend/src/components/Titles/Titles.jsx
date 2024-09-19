import styles from './Titles.module.css'
import { FaArrowRight } from "react-icons/fa";

export function Titles(){

    return(
        <div className={styles.titlesContainer}>
        <div className={styles.titles}>
            <div className={styles.titlesTitle}>
                Статьи
            </div>
            <div className={styles.titlesArticle}>
                <div className={styles.titlesArticleHeader}>
                    Загадочная марка: "Летучая мышь" из Гренады
                </div>
                <div className={styles.titlesArticleTextContainer}>
                    <div className={styles.titlesArticleText}>
                        Одной из самых уникальных и загадочных марок в мире является "Летучая мышь", выпущенная в 1970 году в Гренаде. Эта марка привлекла внимание коллекционеров благодаря своему необычному дизайну и интересной истории.
                        <br />
                        Марка изображает летучую мышь, которая является символом ночи и таинственности. Дизайнеры использовали яркие цвета, чтобы подчеркнуть детали, такие как крылья и глаза животного. Интересно, что на марке также присутствует изображение тропического леса, что подчеркивает естественную среду обитания летучих мышей.
                        <br />
                        В 1970-х годах Гренада активно развивала свою почтовую систему и стремилась привлечь внимание к своей культуре и природе. Выпуск марки с изображением летучей мыши стал частью программы по охране окружающей среды и сохранению биоразнообразия. В то время многие виды летучих мышей находились под угрозой исчезновения из-за уничтожения их естественной среды обитания.
                    </div>
                    <a href='.' className={styles.titlesArticleLink}> Читать далее <FaArrowRight /> </a>
                </div>
            </div>
        </div>
        </div>
    )
}

