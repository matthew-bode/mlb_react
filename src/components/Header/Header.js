import css from './Header.module.css';
import Matchup from './Matchup/Matchup';

const Header = () => {
    const test = '';

    return (
        <div className={css.mainHeaderDiv}>
            <Matchup />
        </div>
    )
}

export default Header;