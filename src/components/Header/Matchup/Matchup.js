import css from './Matchup.module.css'

const Matchup = () => {
    const test = '';

    return (
        <div className={css.mainMatchupDiv}>
            <div className={css.teamsContainerDiv}>
                <div className={css.teamNameDiv}>
                    <span className={css.teamNameSpan}>Testing Team 1</span>
                </div>
                <div className={css.teamNameDiv}>
                    <span className={css.teamNameSpan}>Testing Team 2</span>
                </div>
            </div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    )
}

export default Matchup;