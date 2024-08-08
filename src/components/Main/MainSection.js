import css from './MainSection.module.css';
import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import HitterVsPitcher from '../HitterVsPitcher';

const MainSection = ({ schedule }) => {
    const [trigger, setTrigger] = useState(false);

    const handleClick = () => {
        setTrigger(true); // Toggle the trigger state
      };

    return (
        <div>
            <NavBar />
            <div className={css.mainMainSectionDiv}>
                'Main Section'
                <HitterVsPitcher schedule={schedule} generateTable={trigger}/>
                <button onClick={handleClick}>Generate Table</button>
            </div>
        </div>
    )
}

export default MainSection;