import css from './MainSection.module.css';
import NavBar from '../NavBar/NavBar';
import HitterVsPitcher from '../HitterVsPitcher';

const MainSection = ({ schedule }) => {
    const test = '';

    return (
        <div>
            <NavBar />
            <div className={css.mainMainSectionDiv}>
                'Main Section'
                <HitterVsPitcher schedule={schedule}/>
            </div>
        </div>
    )
}

export default MainSection;