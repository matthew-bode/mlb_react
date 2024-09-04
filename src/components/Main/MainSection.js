import css from './MainSection.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from '../NavBar/NavBar';
import HitterVsPitcher from '../HitterVsPitcher';
import PitcherTable from '../PitcherTable';

const MainSection = ({ schedule }) => {
    const [hitterTrigger, setHitterTrigger] = useState(false);
    const [pitcherTrigger, setPItcherTrigger] = useState(false);
    const [playerIds, setPlayerIds] = useState();
    const [matchUps, setMatchUps] = useState([]);
    const [readyToPull, setReadyToPull] = useState(false);

    const handleHitterClick = () => {
        setHitterTrigger(true);
    };

    const handlePitcherClick = () => {
        setPItcherTrigger(true);
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
                                    if (link.text.length > 0 && link.href.includes("https://www.espn.com/mlb/player/_/id/")) {
                                        const playerId = link.href.split("id/")[1];
                                        const playerName = link.text;
                                        if (positions[p] === 'Pitchers') {
                                            pitcherIds.push({playerId: playerId, playerName: playerName});
                                        } else {
                                            hitterIds.push({playerId: playerId, playerName: playerName});
                                        }
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

    useEffect(() => {
        const MatchUpData = async () => {
          if (schedule !== null) {
            const newMatchUps = [];
            var keys = Object.keys(schedule);
            for (let n = 0; n < keys.length; n++) {
              let homePitcher = null;
              let homePitcherHand = null;
              let awayPitcher = null;
              let awayPitcherHand = null;
              let homeTeam = null;
              let awayTeam = null;
              let homeTeamAbr = "";
              let awayTeamAbr = "";
              let homeTeamFullName = "";
              let awayTeamFullName = "";
              let homeLogo = "";
              let awayLogo = "";
              const homePitcherURL = schedule[keys[n]].competitors[0]?.probable?.href;
              const homePitcherName = schedule[keys[n]].competitors[0]?.probable?.name;
              if (homePitcherURL) {
                const urlSplit = homePitcherURL.split("/id/");
                homePitcher = urlSplit[1] ?? null;
                const homePitcherData = await axios.get(
                  `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${homePitcher}`
                );
                const batsThrows = homePitcherData.data.athlete.displayBatsThrows;
                homePitcherHand = batsThrows.split('/')[1];
              }
              const awayPitcherURL = schedule[keys[n]].competitors[1]?.probable?.href;
              const awayPitcherName = schedule[keys[n]].competitors[1]?.probable?.name;
              if (awayPitcherURL) {
                const urlSplit = awayPitcherURL.split("/id/");
                awayPitcher = urlSplit[1] ?? null;
                const awayPitcherData = await axios.get(
                  `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${awayPitcher}`
                );
                const batsThrows = awayPitcherData.data.athlete.displayBatsThrows;
                awayPitcherHand = batsThrows.split('/')[1];
              }
              homeTeam = schedule[keys[n]].competitors[0]?.id;
              awayTeam = schedule[keys[n]].competitors[1]?.id;
              homeTeamAbr = schedule[keys[n]].competitors[0]?.abbrev;
              awayTeamAbr = schedule[keys[n]].competitors[1]?.abbrev;
              homeTeamFullName = schedule[keys[n]].competitors[0]?.displayName;
              awayTeamFullName = schedule[keys[n]].competitors[1]?.displayName;
              homeLogo = schedule[keys[n]].competitors[0]?.logo;
              awayLogo = schedule[keys[n]].competitors[1]?.logo;
              const venue = schedule.venue?.fullName;
              newMatchUps.push(
                {
                  pitcher: homePitcher,
                  pitcherName: homePitcherName,
                  pitcherThrows: homePitcherHand,
                  team: awayTeam,
                  batterLogo: awayLogo,
                  pitcherLogo: homeLogo,
                  batterTeam: awayTeamAbr,
                  pitcherTeam: homeTeamAbr,
                  batterTeamFullName: awayTeamFullName,
                  pitcherTeamFullName: homeTeamFullName,
                  isBatterHome: false,
                  venue: venue,
                },
                {
                  pitcher: awayPitcher,
                  pitcherName: awayPitcherName,
                  pitcherThrows: awayPitcherHand,
                  team: homeTeam,
                  batterLogo: homeLogo,
                  pitcherLogo: awayLogo,
                  batterTeam: homeTeamAbr,
                  pitcherTeam: awayTeamAbr,
                  batterTeamFullName: homeTeamFullName,
                  pitcherTeamFullName: awayTeamFullName,
                  isBatterHome: true,
                  venue: venue,
                }
              );
            }
            setMatchUps(newMatchUps);
            console.log("newMatchUps", newMatchUps);
          }
        }
    
        MatchUpData();
      }, [schedule]);

    return (
        <div>
            <NavBar />
            <div className={css.mainMainSectionDiv}>
                <button id={'hitter'} onClick={handleHitterClick} disabled={!readyToPull}>Generate Hitter Table</button>
                <button id={'pitcher'} onClick={handlePitcherClick} disabled={!matchUps}>Generate Pitcher Table</button>
                <button onClick={pullPlayerIds}>Pull Players</button>
                <HitterVsPitcher matchUps={matchUps} generateTable={hitterTrigger} playerIds={playerIds} />
                <PitcherTable matchUps={matchUps} generateTable={pitcherTrigger} />
            </div>
        </div>
    )
}

export default MainSection;