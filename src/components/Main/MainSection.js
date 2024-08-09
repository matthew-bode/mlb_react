import css from './MainSection.module.css';
import React, { useState } from 'react';
import NavBar from '../NavBar/NavBar';
import HitterVsPitcher from '../HitterVsPitcher';

const MainSection = ({ schedule }) => {
    const [trigger, setTrigger] = useState(false);
    const [playerIds, setPlayerIds] = useState();
    const [readyToPull, setReadyToPull] = useState(false);

    const handleClick = () => {
        setTrigger(true); // Toggle the trigger state
    };

    const pullPlayerIds = async () => {
        let activePlayerIds = [];
        for (let i = 0; i < schedule.length; i++) {
            const teamURLs = [schedule[i]?.competitors[0]?.links, schedule[i]?.competitors[1]?.links]
            for (let t = 0; t < teamURLs.length; t++) {
                const teamAbbrev = schedule[i].competitors[t].abbrev;
                const urlParts = teamURLs[t].split('/');
                urlParts.splice(3, 0, 'roster');
                const teamRosterURL = urlParts.join('/');

                await fetch(teamRosterURL)
                    .then((response) => response.text())
                    .then((html) => {
                        // Initialize the DOM parser
                        const parser = new DOMParser();

                        // Parse the text into a DOM document
                        const doc = parser.parseFromString(html, "text/html");

                        const positions = ["Pitchers", "Catchers", "Infielders", "Outfielders", "Designated Hitter"];
                        let pitcherIds = [];
                        let hitterIds = [];

                        for (let p = 0; p < positions.length; p++) {
                            // Find the <div> with the text content for each position
                            const positionDiv = Array.from(doc.querySelectorAll("div")).find(
                                (div) => div.textContent.trim() === positions[p]
                            );

                            // If the <div> is found, get all <a> tags after it
                            let playerLinks = [];
                            if (positionDiv) {
                                let sibling = positionDiv.nextElementSibling;
                                let links = sibling.getElementsByTagName("a");

                                for (let link of links) {
                                    playerLinks.push(link.href);
                                }

                                // Remove duplicates from playerLinks and extract the values after "id/"
                                const playerIds = Array.from(new Set(playerLinks))
                                    .filter((href) =>
                                        href.includes("https://www.espn.com/mlb/player/_/id/")
                                    )
                                    .map((href) => href.split("id/")[1]);

                                if (positions[p] === 'Pitchers') {
                                    for (let n = 0; n < playerIds.length; n++) {
                                        pitcherIds.push(playerIds[n]);
                                    }
                                } else {
                                    for (let h = 0; h < playerIds.length; h++) {
                                        hitterIds.push(playerIds[h]);
                                    }
                                }
                            }
                        }
                        activePlayerIds.push(
                            {
                                team: teamAbbrev,
                                pitcherIds: pitcherIds,
                                hitterIds: hitterIds,
                            }
                        )
                    })
                    .catch((err) => {
                        console.log("Failed to fetch page: ", err);
                    });
            }
        }

        setPlayerIds(activePlayerIds);
        setReadyToPull(true);
    }

    console.log('playerIds', playerIds);

    return (
        <div>
            <NavBar />
            <div className={css.mainMainSectionDiv}>
                'Main Section'
                <HitterVsPitcher schedule={schedule} generateTable={trigger} playerIds={playerIds} />
                <button onClick={handleClick} disabled={!readyToPull}>Generate Table</button>
                <button onClick={pullPlayerIds}>Pull Players</button>
            </div>
        </div>
    )
}

export default MainSection;