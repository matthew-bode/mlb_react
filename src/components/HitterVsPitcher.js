import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const HitterVsPitcher = ({ schedule, generateTable, playerIds }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchUps, setMatchUps] = useState([]);

  useEffect(async () => {
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
        let homeLogo = "";
        let awayLogo = "";
        const homePitcherURL = schedule[keys[n]].competitors[0]?.probable?.href;
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
        homeLogo = schedule[keys[n]].competitors[0]?.logo;
        awayLogo = schedule[keys[n]].competitors[1]?.logo;
        const venue = schedule.venue?.fullName;
        newMatchUps.push(
          {
            pitcher: homePitcher,
            pitcherThrows: homePitcherHand,
            team: awayTeam,
            batterLogo: awayLogo,
            pitcherLogo: homeLogo,
            batterTeam: awayTeamAbr,
            pitcherTeam: homeTeamAbr,
            isBatterHome: false,
            venue: venue,
          },
          {
            pitcher: awayPitcher,
            pitcherThrows: awayPitcherHand,
            team: homeTeam,
            batterLogo: homeLogo,
            pitcherLogo: awayLogo,
            batterTeam: homeTeamAbr,
            pitcherTeam: awayTeamAbr,
            isBatterHome: true,
            venue: venue,
          }
        );
      }
      setMatchUps(newMatchUps);
      console.log("newMatchUps", newMatchUps);
    }
  }, [schedule]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const battersArray = [];
        const newRows = [];
        const seasonStats = [];
        const venueStats = [];
        const throwHandStats = [];
        const homeAwayStats = [];
        const sevenDaysStats = [];
        const fifteenDaysStats = [];
        const thirtyDaysStats = [];
        for (let i = 0; i < matchUps.length; i++) {
          if (matchUps[i].pitcher) {
            const batterIdIndex = playerIds.findIndex(
              (x) => x.team === matchUps[i].batterTeam
            );
            const batterIds = playerIds[batterIdIndex].hitterIds;
            const response = await axios.get(
              `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${matchUps[i].pitcher}/vsathlete?region=us&lang=en&contentorigin=espn&teamId=${matchUps[i].team}`
            );
            if (response) {
              const players = response.data?.statistics?.statistics ?? [];
              const pitcherString =
                response.data?.statistics?.displayName ?? "";
              const pitcherStringSplit = pitcherString.split("vs. ");
              const pitcher = pitcherStringSplit[1] ?? "";
              const venue = matchUps[i].venue;
              const pitcherThrowHand = matchUps[i].pitcherThrows;
              const RorL = pitcherThrowHand.charAt(0);
              for (let j = 0; j < players.length; j++) {
                const batter = players[j].stats;
                // const batterLogo = matchUps[i]?.batterLogo ?? "";
                // const pitcherLogo = matchUps[i]?.pitcherLogo ?? "";
                const batterTeam = matchUps[i]?.batterTeam ?? "";
                const pitcherTeam = matchUps[i]?.pitcherTeam ?? "";
                const playerIdString = players[j].uid;
                const playerId = playerIdString.substring(
                  playerIdString.lastIndexOf(":") + 1
                );
                const rowData = {
                  id: playerId,
                  // playerName: [batterLogo, players[j].displayName],
                  // oppPitcher: [pitcherLogo, pitcher],
                  playerName: `${players[j].displayName} (${batterTeam})`,
                  oppPitcher: `${pitcher} (${pitcherTeam})`,
                  atBats: batter[0],
                  hits: batter[1],
                  doubles: batter[2],
                  triples: batter[3],
                  homeRuns: batter[4],
                  rbi: batter[5],
                  walks: batter[6],
                  strikeouts: batter[7],
                  battingAvg: batter[8],
                  obp: batter[9],
                  ops: batter[11],
                  pitcherThrowHand: RorL,
                  throwHandBattingAvg: -1,
                  throwHandObp: -1,
                  throwHandOps: -1,
                  homeAwayBattingAvg: -1,
                  homeAwayObp: -1,
                  homeAwayOps: -1,
                  sevDayBattingAvg: -1,
                  sevDayObp: -1,
                  sevDayOps: -1,
                  fifDayBattingAvg: -1,
                  fifDayObp: -1,
                  fifDayOps: -1,
                  thirDayBattingAvg: -1,
                  thirDayObp: -1,
                  thirDayOps: -1,
                  seasonBattingAvg: -1,
                  seasonObp: -1,
                  seasonOps: -1,
                  percentile: -1,
                  vsPercentile: -1,
                  seasonPercentile: -1,
                  venuePercentile: -1,
                  totalDaysPercentile: -1,
                  throwHandPercentile: -1,
                  homeAwayPercentile: -1,
                  vsPitcherBAPctl: -1,
                  vsPitcherOBPPctl: -1,
                  vsPitcherOPSPctl: -1,
                };
                const playerData = await axios.get(
                  `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${playerId}/splits`
                );
                if (playerData) {
                  // Season Data
                  const seasonData =
                    playerData.data.splitCategories[0].splits[0].stats;
                  const seasonRowData = {
                    id: playerId,
                    atBats: seasonData[0],
                    hits: seasonData[2],
                    doubles: seasonData[3],
                    triples: seasonData[4],
                    homeRuns: seasonData[5],
                    rbi: seasonData[6],
                    walks: seasonData[7],
                    strikeouts: seasonData[9],
                    battingAvg: seasonData[12],
                    obp: seasonData[13],
                    ops: seasonData[15],
                    percentile: -1,
                    seasonBAPctl: -1,
                    seasonOBPPctl: -1,
                    seasonOPSPctl: -1,
                  };
                  seasonStats.push(seasonRowData);
                  rowData.seasonBattingAvg = seasonData[12] ?? "-";
                  rowData.seasonObp = seasonData[13] ?? "-";
                  rowData.seasonOps = seasonData[15] ?? "-";

                  // Venue Data
                  const venueArray = playerData.data.splitCategories[4].splits;
                  const venueIndex = venueArray.findIndex(
                    (x) => x.displayName === venue
                  );
                  let venueData = [];
                  if (venueIndex > -1) {
                    venueData = venueArray[venueIndex].stats;
                  }
                  const venueRowData = {
                    id: playerId,
                    atBats: venueData[0] ?? 0,
                    hits: venueData[2] ?? 0,
                    doubles: venueData[3] ?? 0,
                    triples: venueData[4] ?? 0,
                    homeRuns: venueData[5] ?? 0,
                    rbi: venueData[6] ?? 0,
                    walks: venueData[7] ?? 0,
                    strikeouts: venueData[9] ?? 0,
                    battingAvg: venueData[12] ?? 0,
                    obp: venueData[13] ?? 0,
                    ops: venueData[15] ?? 0,
                    percentile: -1,
                    venueBAPctl: -1,
                    venueOBPPctl: -1,
                    venueOPSPctl: -1,
                  };
                  venueStats.push(venueRowData);

                  // vs right/left
                  const throwHandArray = playerData.data.splitCategories[1].splits;
                  const displayName = matchUps[i].pitcherThrows = 'right' ? 'vs. Right' : 'vs. Left';
                  const throwHandIndex = throwHandArray.findIndex(
                    (x) => x.displayName === displayName
                  );
                  let throwHandData = [];
                  if (throwHandIndex > -1) {
                    throwHandData = throwHandArray[throwHandIndex].stats;
                  }
                  const throwHandRowData = {
                    id: playerId,
                    atBats: throwHandData[0] ?? 0,
                    hits: throwHandData[2] ?? 0,
                    doubles: throwHandData[3] ?? 0,
                    triples: throwHandData[4] ?? 0,
                    homeRuns: throwHandData[5] ?? 0,
                    rbi: throwHandData[6] ?? 0,
                    walks: throwHandData[7] ?? 0,
                    strikeouts: throwHandData[9] ?? 0,
                    battingAvg: throwHandData[12] ?? 0,
                    obp: throwHandData[13] ?? 0,
                    ops: throwHandData[15] ?? 0,
                    percentile: -1,
                    throwHandBAPctl: -1,
                    throwHandOBPPctl: -1,
                    throwHandOPSPctl: -1,
                  };
                  throwHandStats.push(throwHandRowData);
                  rowData.throwHandBattingAvg = throwHandData[12] ?? "-";
                  rowData.throwHandObp = throwHandData[13] ?? "-";
                  rowData.throwHandOps = throwHandData[15] ?? "-";

                  // home/away stats
                  const isBatterHome = matchUps[i].isBatterHome;
                  const homeAwayArray = playerData.data.splitCategories[1].splits;
                  const homeAwayString = isBatterHome ? 'Home' : 'Away';
                  const homeAwayIndex = homeAwayArray.findIndex(
                    (x) => x.displayName === homeAwayString
                  );
                  let homeAwayData = [];
                  if (homeAwayIndex > -1) {
                    homeAwayData = homeAwayArray[homeAwayIndex].stats;
                  }
                  const homeAwayRowData = {
                    id: playerId,
                    atBats: homeAwayData[0] ?? 0,
                    hits: homeAwayData[2] ?? 0,
                    doubles: homeAwayData[3] ?? 0,
                    triples: homeAwayData[4] ?? 0,
                    homeRuns: homeAwayData[5] ?? 0,
                    rbi: homeAwayData[6] ?? 0,
                    walks: homeAwayData[7] ?? 0,
                    strikeouts: homeAwayData[9] ?? 0,
                    battingAvg: homeAwayData[12] ?? 0,
                    obp: homeAwayData[13] ?? 0,
                    ops: homeAwayData[15] ?? 0,
                    percentile: -1,
                    homeAwayBAPctl: -1,
                    homeAwayOBPPctl: -1,
                    homeAwayOPSPctl: -1,
                  };
                  homeAwayStats.push(homeAwayRowData);
                  rowData.homeAwayBattingAvg = homeAwayData[12] ?? "-";
                  rowData.homeAwayObp = homeAwayData[13] ?? "-";
                  rowData.homeAwayOps = homeAwayData[15] ?? "-";

                  // Recent Days
                  const splitsByDays =
                    playerData.data.splitCategories[2].splits;
                  let sevenDaysData = [];
                  let fifteenDaysData = [];
                  let thirtyDaysData = [];
                  let sevenDaysAtBats = 0;
                  let fifteenDaysAtBats = 0;
                  for (let i = 0; i < splitsByDays.length; i++) {
                    switch (splitsByDays[i].displayName) {
                      case "Last 7 Days":
                        sevenDaysData = splitsByDays[i].stats;
                        sevenDaysAtBats = splitsByDays[i].stats[0];
                        break;
                      case "Last 15 Days":
                        if (sevenDaysAtBats !== splitsByDays[i].stats[0]) {
                          fifteenDaysData = splitsByDays[i].stats;
                          fifteenDaysAtBats = splitsByDays[i].stats[0];
                        }
                        break;
                      case "Last 30 Days":
                        if (
                          sevenDaysAtBats !== splitsByDays[i].stats[0] &&
                          fifteenDaysAtBats !== splitsByDays[i].stats[0]
                        ) {
                          thirtyDaysData = splitsByDays[i].stats;
                        }
                        break;
                      default:
                        break;
                    }
                  }

                  // Last 7 Days Data
                  const sevenDaysRowData = {
                    id: playerId,
                    atBats: sevenDaysData[0] ?? 0,
                    hits: sevenDaysData[2] ?? 0,
                    doubles: sevenDaysData[3] ?? 0,
                    triples: sevenDaysData[4] ?? 0,
                    homeRuns: sevenDaysData[5] ?? 0,
                    rbi: sevenDaysData[6] ?? 0,
                    walks: sevenDaysData[7] ?? 0,
                    strikeouts: sevenDaysData[9] ?? 0,
                    battingAvg: sevenDaysData[12] ?? 0,
                    obp: sevenDaysData[13] ?? 0,
                    ops: sevenDaysData[15] ?? 0,
                    percentile: -1,
                    sevenDaysBAPctl: -1,
                    sevenDaysOBPPctl: -1,
                    sevenDaysOPSPctl: -1,
                  };
                  sevenDaysStats.push(sevenDaysRowData);
                  rowData.sevDayBattingAvg = sevenDaysData[12] ?? "-";
                  rowData.sevDayObp = sevenDaysData[13] ?? "-";
                  rowData.sevDayOps = sevenDaysData[15] ?? "-";

                  // Last 15 Days Data
                  const fifteenDaysRowData = {
                    id: playerId,
                    atBats: fifteenDaysData[0] ?? 0,
                    hits: fifteenDaysData[2] ?? 0,
                    doubles: fifteenDaysData[3] ?? 0,
                    triples: fifteenDaysData[4] ?? 0,
                    homeRuns: fifteenDaysData[5] ?? 0,
                    rbi: fifteenDaysData[6] ?? 0,
                    walks: fifteenDaysData[7] ?? 0,
                    strikeouts: fifteenDaysData[9] ?? 0,
                    battingAvg: fifteenDaysData[12] ?? 0,
                    obp: fifteenDaysData[13] ?? 0,
                    ops: fifteenDaysData[15] ?? 0,
                    percentile: -1,
                    fifteenDaysBAPctl: -1,
                    fifteenDaysOBPPctl: -1,
                    fifteenDaysOPSPctl: -1,
                  };
                  fifteenDaysStats.push(fifteenDaysRowData);
                  rowData.fifDayBattingAvg = fifteenDaysData[12] ?? "-";
                  rowData.fifDayObp = fifteenDaysData[13] ?? "-";
                  rowData.fifDayOps = fifteenDaysData[15] ?? "-";

                  // Last 30 Days Data
                  const thirtyDaysRowData = {
                    id: playerId,
                    atBats: thirtyDaysData[0] ?? 0,
                    hits: thirtyDaysData[2] ?? 0,
                    doubles: thirtyDaysData[3] ?? 0,
                    triples: thirtyDaysData[4] ?? 0,
                    homeRuns: thirtyDaysData[5] ?? 0,
                    rbi: thirtyDaysData[6] ?? 0,
                    walks: thirtyDaysData[7] ?? 0,
                    strikeouts: thirtyDaysData[9] ?? 0,
                    battingAvg: thirtyDaysData[12] ?? 0,
                    obp: thirtyDaysData[13] ?? 0,
                    ops: thirtyDaysData[15] ?? 0,
                    percentile: -1,
                    thirtyDaysBAPctl: -1,
                    thirtyDaysOBPPctl: -1,
                    thirtyDaysOPSPctl: -1,
                  };
                  thirtyDaysStats.push(thirtyDaysRowData);
                  rowData.thirDayBattingAvg = thirtyDaysData[12] ?? "-";
                  rowData.thirDayObp = thirtyDaysData[13] ?? "-";
                  rowData.thirDayOps = thirtyDaysData[15] ?? "-";
                }
                newRows.push(rowData);
                battersArray.push(playerId);
              }
            }
          }
        }

        // Batting Average Percentile Section
        let validVsPitcherStats = newRows
          .filter((x) => x.atBats > 5)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validSeasonStats = seasonStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validVenueStats = venueStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validThrowHandStats = throwHandStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validHomeAwayStats = homeAwayStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validSevenDaysStats = sevenDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validFifteenDaysStats = fifteenDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        let validThirtyDaysStats = thirtyDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.battingAvg - a.battingAvg);
        for (let p = 0; p < battersArray.length; p++) {
          const playerId = battersArray[p];
          // Find index of playerId in each array
          const vsPitcherIndex = validVsPitcherStats.findIndex(
            (x) => x.id === playerId
          );
          const seasonIndex = validSeasonStats.findIndex(
            (x) => x.id === playerId
          );
          const venueIndex = validVenueStats.findIndex(
            (x) => x.id === playerId
          );
          const throwHandIndex = validThrowHandStats.findIndex(
            (x) => x.id === playerId
          );
          const homeAwayIndex = validHomeAwayStats.findIndex(
            (x) => x.id === playerId
          );
          const sevenDaysIndex = validSevenDaysStats.findIndex(
            (x) => x.id === playerId
          );
          const fifteenDaysIndex = validFifteenDaysStats.findIndex(
            (x) => x.id === playerId
          );
          const thirtyDaysIndex = validThirtyDaysStats.findIndex(
            (x) => x.id === playerId
          );

          // If index is found, find percentile and set the value
          if (vsPitcherIndex > -1) {
            const vsPitcherBAPctl =
              ((validVsPitcherStats.length - (vsPitcherIndex + 1)) /
                validVsPitcherStats.length) *
              100;
            const rowIndex = newRows.findIndex((x) => x.id === playerId);
            newRows[rowIndex].vsPitcherBAPctl = vsPitcherBAPctl;
          }
          if (seasonIndex > -1) {
            const seasonBAPctl =
              ((validSeasonStats.length - (seasonIndex + 1)) /
                validSeasonStats.length) *
              100;
            const rowIndex = seasonStats.findIndex((x) => x.id === playerId);
            seasonStats[rowIndex].seasonBAPctl = seasonBAPctl;
          }
          if (venueIndex > -1) {
            const venueBAPctl =
              ((validVenueStats.length - (venueIndex + 1)) /
                validVenueStats.length) *
              100;
            const rowIndex = venueStats.findIndex((x) => x.id === playerId);
            venueStats[rowIndex].venueBAPctl = venueBAPctl;
          }
          if (throwHandIndex > -1) {
            const throwHandBAPctl =
              ((validThrowHandStats.length - (throwHandIndex + 1)) /
                validThrowHandStats.length) *
              100;
            const rowIndex = throwHandStats.findIndex((x) => x.id === playerId);
            throwHandStats[rowIndex].throwHandBAPctl = throwHandBAPctl;
          }
          if (homeAwayIndex > -1) {
            const homeAwayBAPctl =
              ((validHomeAwayStats.length - (homeAwayIndex + 1)) /
                validHomeAwayStats.length) *
              100;
            const rowIndex = homeAwayStats.findIndex((x) => x.id === playerId);
            homeAwayStats[rowIndex].homeAwayBAPctl = homeAwayBAPctl;
          }
          if (sevenDaysIndex > -1) {
            const sevenDaysBAPctl =
              ((validSevenDaysStats.length - (sevenDaysIndex + 1)) /
                validSevenDaysStats.length) *
              100;
            const rowIndex = sevenDaysStats.findIndex((x) => x.id === playerId);
            sevenDaysStats[rowIndex].sevenDaysBAPctl = sevenDaysBAPctl;
          }
          if (fifteenDaysIndex > -1) {
            const fifteenDaysBAPctl =
              ((validFifteenDaysStats.length - (fifteenDaysIndex + 1)) /
                validFifteenDaysStats.length) *
              100;
            const rowIndex = fifteenDaysStats.findIndex(
              (x) => x.id === playerId
            );
            fifteenDaysStats[rowIndex].fifteenDaysBAPctl = fifteenDaysBAPctl;
          }
          if (thirtyDaysIndex > -1) {
            const thirtyDaysBAPctl =
              ((validThirtyDaysStats.length - (thirtyDaysIndex + 1)) /
                validThirtyDaysStats.length) *
              100;
            const rowIndex = thirtyDaysStats.findIndex(
              (x) => x.id === playerId
            );
            thirtyDaysStats[rowIndex].thirtyDaysBAPctl = thirtyDaysBAPctl;
          }
        }

        // OB% Percentile Section
        validVsPitcherStats = newRows
          .filter((x) => x.atBats > 5)
          .sort((a, b) => b.obp - a.obp);
        validSeasonStats = seasonStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        validVenueStats = venueStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        validThrowHandStats = throwHandStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        validHomeAwayStats = homeAwayStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        validSevenDaysStats = sevenDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        validFifteenDaysStats = fifteenDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        validThirtyDaysStats = thirtyDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.obp - a.obp);
        for (let p = 0; p < battersArray.length; p++) {
          const playerId = battersArray[p];
          // Find index of playerId in each array
          const vsPitcherIndex = validVsPitcherStats.findIndex(
            (x) => x.id === playerId
          );
          const seasonIndex = validSeasonStats.findIndex(
            (x) => x.id === playerId
          );
          const venueIndex = validVenueStats.findIndex(
            (x) => x.id === playerId
          );
          const throwHandIndex = validThrowHandStats.findIndex(
            (x) => x.id === playerId
          );
          const homeAwayIndex = validHomeAwayStats.findIndex(
            (x) => x.id === playerId
          );
          const sevenDaysIndex = validSevenDaysStats.findIndex(
            (x) => x.id === playerId
          );
          const fifteenDaysIndex = validFifteenDaysStats.findIndex(
            (x) => x.id === playerId
          );
          const thirtyDaysIndex = validThirtyDaysStats.findIndex(
            (x) => x.id === playerId
          );

          // If index is found, find percentile and set the value
          if (vsPitcherIndex > -1) {
            const vsPitcherOBPPctl =
              ((validVsPitcherStats.length - (vsPitcherIndex + 1)) /
                validVsPitcherStats.length) *
              100;
            const rowIndex = newRows.findIndex((x) => x.id === playerId);
            newRows[rowIndex].vsPitcherOBPPctl = vsPitcherOBPPctl;
          }
          if (seasonIndex > -1) {
            const seasonOBPPctl =
              ((validSeasonStats.length - (seasonIndex + 1)) /
                validSeasonStats.length) *
              100;
            const rowIndex = seasonStats.findIndex((x) => x.id === playerId);
            seasonStats[rowIndex].seasonOBPPctl = seasonOBPPctl;
          }
          if (venueIndex > -1) {
            const venueOBPPctl =
              ((validVenueStats.length - (venueIndex + 1)) /
                validVenueStats.length) *
              100;
            const rowIndex = venueStats.findIndex((x) => x.id === playerId);
            venueStats[rowIndex].venueOBPPctl = venueOBPPctl;
          }
          if (throwHandIndex > -1) {
            const throwHandOBPPctl =
              ((validThrowHandStats.length - (throwHandIndex + 1)) /
                validThrowHandStats.length) *
              100;
            const rowIndex = throwHandStats.findIndex((x) => x.id === playerId);
            throwHandStats[rowIndex].throwHandOBPPctl = throwHandOBPPctl;
          }
          if (homeAwayIndex > -1) {
            const homeAwayOBPPctl =
              ((validHomeAwayStats.length - (homeAwayIndex + 1)) /
                validHomeAwayStats.length) *
              100;
            const rowIndex = homeAwayStats.findIndex((x) => x.id === playerId);
            homeAwayStats[rowIndex].homeAwayOBPPctl = homeAwayOBPPctl;
          }
          if (sevenDaysIndex > -1) {
            const sevenDaysOBPPctl =
              ((validSevenDaysStats.length - (sevenDaysIndex + 1)) /
                validSevenDaysStats.length) *
              100;
            const rowIndex = sevenDaysStats.findIndex((x) => x.id === playerId);
            sevenDaysStats[rowIndex].sevenDaysOBPPctl = sevenDaysOBPPctl;
          }
          if (fifteenDaysIndex > -1) {
            const fifteenDaysOBPPctl =
              ((validFifteenDaysStats.length - (fifteenDaysIndex + 1)) /
                validFifteenDaysStats.length) *
              100;
            const rowIndex = fifteenDaysStats.findIndex(
              (x) => x.id === playerId
            );
            fifteenDaysStats[rowIndex].fifteenDaysOBPPctl = fifteenDaysOBPPctl;
          }
          if (thirtyDaysIndex > -1) {
            const thirtyDaysOBPPctl =
              ((validThirtyDaysStats.length - (thirtyDaysIndex + 1)) /
                validThirtyDaysStats.length) *
              100;
            const rowIndex = thirtyDaysStats.findIndex(
              (x) => x.id === playerId
            );
            thirtyDaysStats[rowIndex].thirtyDaysOBPPctl = thirtyDaysOBPPctl;
          }
        }

        // OPS Percentile Section
        validVsPitcherStats = newRows
          .filter((x) => x.atBats > 5)
          .sort((a, b) => b.ops - a.ops);
        validSeasonStats = seasonStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        validVenueStats = venueStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        validThrowHandStats = throwHandStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        validHomeAwayStats = homeAwayStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        validSevenDaysStats = sevenDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        validFifteenDaysStats = fifteenDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        validThirtyDaysStats = thirtyDaysStats
          .filter((x) => x.atBats > 0)
          .sort((a, b) => b.ops - a.ops);
        for (let p = 0; p < battersArray.length; p++) {
          const playerId = battersArray[p];
          // Find index of playerId in each array
          const vsPitcherIndex = validVsPitcherStats.findIndex(
            (x) => x.id === playerId
          );
          const seasonIndex = validSeasonStats.findIndex(
            (x) => x.id === playerId
          );
          const venueIndex = validVenueStats.findIndex(
            (x) => x.id === playerId
          );
          const throwHandIndex = validThrowHandStats.findIndex(
            (x) => x.id === playerId
          );
          const homeAwayIndex = validHomeAwayStats.findIndex(
            (x) => x.id === playerId
          );
          const sevenDaysIndex = validSevenDaysStats.findIndex(
            (x) => x.id === playerId
          );
          const fifteenDaysIndex = validFifteenDaysStats.findIndex(
            (x) => x.id === playerId
          );
          const thirtyDaysIndex = validThirtyDaysStats.findIndex(
            (x) => x.id === playerId
          );

          // If index is found, find percentile and set the value
          if (vsPitcherIndex > -1) {
            const vsPitcherOPSPctl =
              ((validVsPitcherStats.length - (vsPitcherIndex + 1)) /
                validVsPitcherStats.length) *
              100;
            const rowIndex = newRows.findIndex((x) => x.id === playerId);
            newRows[rowIndex].vsPitcherOPSPctl = vsPitcherOPSPctl;
          }
          if (seasonIndex > -1) {
            const seasonOPSPctl =
              ((validSeasonStats.length - (seasonIndex + 1)) /
                validSeasonStats.length) *
              100;
            const rowIndex = seasonStats.findIndex((x) => x.id === playerId);
            seasonStats[rowIndex].seasonOPSPctl = seasonOPSPctl;
          }
          if (venueIndex > -1) {
            const venueOPSPctl =
              ((validVenueStats.length - (venueIndex + 1)) /
                validVenueStats.length) *
              100;
            const rowIndex = venueStats.findIndex((x) => x.id === playerId);
            venueStats[rowIndex].venueOPSPctl = venueOPSPctl;
          }
          if (throwHandIndex > -1) {
            const throwHandOPSPctl =
              ((validThrowHandStats.length - (throwHandIndex + 1)) /
                validThrowHandStats.length) *
              100;
            const rowIndex = throwHandStats.findIndex((x) => x.id === playerId);
            throwHandStats[rowIndex].throwHandOPSPctl = throwHandOPSPctl;
          }
          if (homeAwayIndex > -1) {
            const homeAwayOPSPctl =
              ((validHomeAwayStats.length - (homeAwayIndex + 1)) /
                validHomeAwayStats.length) *
              100;
            const rowIndex = homeAwayStats.findIndex((x) => x.id === playerId);
            homeAwayStats[rowIndex].homeAwayOPSPctl = homeAwayOPSPctl;
          }
          if (sevenDaysIndex > -1) {
            const sevenDaysOPSPctl =
              ((validSevenDaysStats.length - (sevenDaysIndex + 1)) /
                validSevenDaysStats.length) *
              100;
            const rowIndex = sevenDaysStats.findIndex((x) => x.id === playerId);
            sevenDaysStats[rowIndex].sevenDaysOPSPctl = sevenDaysOPSPctl;
          }
          if (fifteenDaysIndex > -1) {
            const fifteenDaysOPSPctl =
              ((validFifteenDaysStats.length - (fifteenDaysIndex + 1)) /
                validFifteenDaysStats.length) *
              100;
            const rowIndex = fifteenDaysStats.findIndex(
              (x) => x.id === playerId
            );
            fifteenDaysStats[rowIndex].fifteenDaysOPSPctl = fifteenDaysOPSPctl;
          }
          if (thirtyDaysIndex > -1) {
            const thirtyDaysOPSPctl =
              ((validThirtyDaysStats.length - (thirtyDaysIndex + 1)) /
                validThirtyDaysStats.length) *
              100;
            const rowIndex = thirtyDaysStats.findIndex(
              (x) => x.id === playerId
            );
            thirtyDaysStats[rowIndex].thirtyDaysOPSPctl = thirtyDaysOPSPctl;
          }
        }

        // Total Percentile Calculation Section
        for (let p = 0; p < battersArray.length; p++) {
          // vsPitcher
          const vsPitcherPctlArray = [
            newRows[p].atBats > 5 ? newRows[p].vsPitcherBAPctl : -1,
            newRows[p].atBats > 5 ? newRows[p].vsPitcherOBPPctl : -1,
            newRows[p].atBats > 5 ? newRows[p].vsPitcherOPSPctl : -1
          ];
          vsPitcherPctlArray.filter((x) => x > -1);
          const vsPitcherPctl = vsPitcherPctlArray.length > 0 ? (vsPitcherPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / vsPitcherPctlArray.length) : -1;

          // season
          const seasonPctlArray = [seasonStats[p].seasonBAPctl, seasonStats[p].seasonOBPPctl, seasonStats[p].seasonOPSPctl];
          seasonPctlArray.filter((x) => x > -1);
          const seasonPctl = seasonPctlArray.length > 0 ? (seasonPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / seasonPctlArray.length) : -1;

          // venue
          const venuePctlArray = [venueStats[p].venueBAPctl, venueStats[p].venueOBPPctl, venueStats[p].venueOPSPctl];
          venuePctlArray.filter((x) => x > -1);
          const venuePctl = venuePctlArray.length > 0 ? (venuePctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / venuePctlArray.length) : -1;

          // Throw Hand
          const throwHandPctlArray = [throwHandStats[p].throwHandBAPctl, throwHandStats[p].throwHandOBPPctl, throwHandStats[p].throwHandOPSPctl];
          throwHandPctlArray.filter((x) => x > -1);
          const throwHandPctl = throwHandPctlArray.length > 0 ? (throwHandPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / throwHandPctlArray.length) : -1;

          // Home/Away
          const homeAwayPctlArray = [homeAwayStats[p].homeAwayBAPctl, homeAwayStats[p].homeAwayOBPPctl, homeAwayStats[p].homeAwayOPSPctl];
          homeAwayPctlArray.filter((x) => x > -1);
          const homeAwayPctl = homeAwayPctlArray.length > 0 ? (homeAwayPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / homeAwayPctlArray.length) : -1;

          // recent days
          // seven days
          const sevenDaysPctlArray = [sevenDaysStats[p].sevenDaysBAPctl, sevenDaysStats[p].sevenDaysOBPPctl, sevenDaysStats[p].sevenDaysOPSPctl];
          sevenDaysPctlArray.filter((x) => x > -1);
          const sevenDaysPctl = sevenDaysPctlArray.length > 0 ? (sevenDaysPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / sevenDaysPctlArray.length) : -1;

          // fifteen days
          const fifteenDaysPctlArray = [fifteenDaysStats[p].fifteenDaysBAPctl, fifteenDaysStats[p].fifteenDaysOBPPctl, fifteenDaysStats[p].fifteenDaysOPSPctl];
          fifteenDaysPctlArray.filter((x) => x > -1);
          const fifteenDaysPctl = fifteenDaysPctlArray.length > 0 ? (fifteenDaysPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / fifteenDaysPctlArray.length) : -1;

          // thirty days
          const thirtyDaysPctlArray = [thirtyDaysStats[p].thirtyDaysBAPctl, thirtyDaysStats[p].thirtyDaysOBPPctl, thirtyDaysStats[p].thirtyDaysOPSPctl];
          thirtyDaysPctlArray.filter((x) => x > -1);
          const thirtyDaysPctl = thirtyDaysPctlArray.length > 0 ? (thirtyDaysPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / thirtyDaysPctlArray.length) : -1;

          // total recent days
          // seven days
          const totalDaysPctlArray = [sevenDaysPctl, fifteenDaysPctl, thirtyDaysPctl];
          totalDaysPctlArray.filter((x) => x > -1);
          const totalDaysPctl = totalDaysPctlArray.length > 0 ? (totalDaysPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / totalDaysPctlArray.length) : -1;

          const validPercentiles = [
            vsPitcherPctl,
            throwHandPctl,
            homeAwayPctl,
            totalDaysPctl,
            seasonPctl,
            venuePctl,
          ];
          let totalPercentiles = 0;
          let divideNum = 0;
          let percentile = 0;
          for (let i = 0; i < validPercentiles.length; i++) {
            if (validPercentiles[i] > -1) {
              totalPercentiles += validPercentiles[i];
              divideNum += 1;
            }
          }
          if (totalPercentiles > 0 && divideNum > 0) {
            percentile = totalPercentiles / divideNum;
          }

          newRows[p].percentile = percentile;
          newRows[p].vsPercentile = vsPitcherPctl;
          newRows[p].seasonPercentile = seasonPctl;
          newRows[p].venuePercentile = venuePctl;
          newRows[p].totalDaysPercentile = totalDaysPctl;
          newRows[p].throwHandPercentile = throwHandPctl;
          newRows[p].homeAwayPercentile = homeAwayPctl;
        }
        setData(newRows);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (matchUps.length > 0 && generateTable) {
      fetchData();
    }
  }, [matchUps, generateTable]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100, hide: true },
    // {
    //   field: "playerName",
    //   headerName: "Batter",
    //   renderCell: (params) => (
    //     <div>
    //       <img src={params.value[0]} width={30} />
    //       <span>{params.value[1]}</span>
    //     </div>
    //   ),
    //   width: 175
    // },
    // {
    //   field: "oppPitcher",
    //   headerName: "Pitcher",
    //   renderCell: (params) => (
    //     <div>
    //       <img src={params.value[0]} width={30} />
    //       <span>{params.value[1]}</span>
    //     </div>
    //   ),
    //   width: 175
    // },
    { field: "playerName", headerName: "Batter", width: 175 },
    { field: "oppPitcher", headerName: "Pitcher", width: 175 },
    { field: "atBats", headerName: "ABs", width: 20, type: "number" },
    { field: "hits", headerName: "Hits", width: 20 },
    { field: "doubles", headerName: "2B", width: 20 },
    { field: "triples", headerName: "3B", width: 20 },
    { field: "homeRuns", headerName: "HR", width: 20 },
    { field: "rbi", headerName: "RBIs", width: 20 },
    { field: "walks", headerName: "BB", width: 20 },
    { field: "strikeouts", headerName: "K", width: 20 },
    { field: "battingAvg", headerName: "BA", width: 60 },
    { field: "obp", headerName: "OB%", width: 60 },
    { field: "ops", headerName: "OPS", width: 60 },
    { field: "pitcherThrowHand", headerName: "R/L", width: 20 },
    { field: "throwHandBattingAvg", headerName: "BA", width: 60 },
    { field: "throwHandObp", headerName: "OB%", width: 60 },
    { field: "throwHandOps", headerName: "OPS", width: 60 },
    { field: "homeAwayBattingAvg", headerName: "BA", width: 60 },
    { field: "homeAwayObp", headerName: "OB%", width: 60 },
    { field: "homeAwayOps", headerName: "OPS", width: 60 },
    { field: "sevDayBattingAvg", headerName: "BA", width: 60 },
    { field: "sevDayObp", headerName: "OB%", width: 60 },
    { field: "sevDayOps", headerName: "OPS", width: 60 },
    { field: "fifDayBattingAvg", headerName: "BA", width: 60 },
    { field: "fifDayObp", headerName: "OB%", width: 60 },
    { field: "fifDayOps", headerName: "OPS", width: 60 },
    { field: "thirDayBattingAvg", headerName: "BA", width: 60 },
    { field: "thirDayObp", headerName: "OB%", width: 60 },
    { field: "thirDayOps", headerName: "OPS", width: 60 },
    { field: "seasonBattingAvg", headerName: "BA", width: 60 },
    { field: "seasonObp", headerName: "OB%", width: 60 },
    { field: "seasonOps", headerName: "OPS", width: 60 },
    { field: "percentile", headerName: "Pctl", width: 60 },
    // { field: "vsPercentile", headerName: "vs", width: 60 },
    // { field: "throwHandPercentile", headerName: "R/L", width: 60 },
    // { field: "seasonPercentile", headerName: "Season", width: 60 },
    // { field: "venuePercentile", headerName: "venue", width: 60 },
    // { field: "totalDaysPercentile", headerName: "total Days", width: 60 },
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        slots={{ toolbar: GridToolbar }}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
          // filter: {
          //   filterModel: {
          //     items: [{ field: 'atBats', operator: '>', value: '10' }],
          //   },
          // },
        }}
      />
    </div>
  );
};

export default HitterVsPitcher;
