import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const HitterVsPitcher = ({ matchUps, generateTable, playerIds }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const battersArray = [];
        const newRows = [];
        let matchUpData = [];
        const matchUpStats = [];
        const seasonStats = [];
        const venueStats = [];
        const throwHandStats = [];
        const homeAwayStats = [];
        const sevenDaysStats = [];
        const fifteenDaysStats = [];
        const thirtyDaysStats = [];
        for (let i = 0; i < matchUps.length; i++) {
          const batterIdIndex = playerIds.findIndex(
            (x) => x.team === matchUps[i].batterTeam
          );
          const batterIds = playerIds[batterIdIndex].hitterIds;
          const matchUpPlayersArray = [];
          const matchUpUIDArray = [];
          if (matchUps[i].pitcher) {
            matchUpData = await axios.get(
              `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${matchUps[i].pitcher}/vsathlete?region=us&lang=en&contentorigin=espn&teamId=${matchUps[i].team}`
            );
            if (matchUpData) {
              const matchUpPlayers = matchUpData?.data?.statistics?.statistics ?? [];
              if (matchUpPlayers.length > 0) {
                for (let m = 0; m < matchUpPlayers.length; m++) {
                  const playerUID = matchUpPlayers[m].uid;
                  const playerId = playerUID.substring(
                    playerUID.lastIndexOf(":") + 1
                  );
                  matchUpPlayersArray.push(playerId);
                  matchUpUIDArray.push(playerUID);
                }
              }
            }
          }
          for (let p = 0; p < batterIds.length; p++) {
            const playerData = await axios.get(
              `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${batterIds[p].playerId}/splits`
            );
            if (playerData?.data?.splitCategories) {
              const venue = matchUps[i].venue;
              const pitcherThrowHand = matchUps[i].pitcherThrows ?? "-";
              const RorL = pitcherThrowHand.charAt(0);
              // const batterLogo = matchUps[i]?.batterLogo ?? "";
              // const pitcherLogo = matchUps[i]?.pitcherLogo ?? "";
              const batterTeam = matchUps[i]?.batterTeam ?? "";
              const pitcherTeam = matchUps[i]?.pitcherTeam ?? "";
              const pitcherName = matchUps[i]?.pitcherName ?? "";
              const playerId = batterIds[p].playerId;
              const rowData = {
                id: playerId,
                // playerName: [batterLogo, players[j].displayName],
                // oppPitcher: [pitcherLogo, pitcher],
                playerName: `${batterIds[p].playerName} (${batterTeam})`,
                oppPitcher: `${pitcherName} (${pitcherTeam})`,
                atBats: 0,
                hits: 0,
                doubles: 0,
                triples: 0,
                homeRuns: 0,
                rbi: 0,
                walks: 0,
                strikeouts: 0,
                battingAvg: 0,
                obp: 0,
                ops: 0,
                pitcherThrowHand: RorL,
                throwHandAtBats: -1,
                throwHandBattingAvg: -1,
                throwHandObp: -1,
                throwHandOps: -1,
                homeAwayAtBats: -1,
                homeAwayBattingAvg: -1,
                homeAwayObp: -1,
                homeAwayOps: -1,
                sevDayAtBats: -1,
                sevDayBattingAvg: -1,
                sevDayObp: -1,
                sevDayOps: -1,
                fifDayAtBats: -1,
                fifDayBattingAvg: -1,
                fifDayObp: -1,
                fifDayOps: -1,
                thirDayAtBats: -1,
                thirDayBattingAvg: -1,
                thirDayObp: -1,
                thirDayOps: -1,
                seasonAtBats: -1,
                seasonBattingAvg: -1,
                seasonObp: -1,
                seasonOps: -1,
                percentile: -1,
                matchUpPercentile: -1,
                seasonPercentile: -1,
                venuePercentile: -1,
                totalDaysPercentile: -1,
                throwHandPercentile: -1,
                homeAwayPercentile: -1,
                vsPitcherBAPctl: -1,
                vsPitcherOBPPctl: -1,
                vsPitcherOPSPctl: -1,
              };

              // Matchup Data
              if (matchUpPlayersArray.includes(playerId)) {
                const matchUp = matchUpData?.data?.statistics?.statistics ?? [];
                const matchUpIndex = matchUp.findIndex((x) => x.uid.substring(
                  x.uid.lastIndexOf(":") + 1
                ) === playerId);
                const matchUpPlayerData = matchUp[matchUpIndex].stats;
                const matchUpRowData = {
                  id: playerId,
                  atBats: matchUpPlayerData[0] ?? 0,
                  hits: matchUpPlayerData[1] ?? 0,
                  doubles: matchUpPlayerData[2] ?? 0,
                  triples: matchUpPlayerData[3] ?? 0,
                  homeRuns: matchUpPlayerData[4] ?? 0,
                  rbi: matchUpPlayerData[5] ?? 0,
                  walks: matchUpPlayerData[6] ?? 0,
                  strikeouts: matchUpPlayerData[7] ?? 0,
                  battingAvg: matchUpPlayerData[8] ?? 0,
                  obp: matchUpPlayerData[9] ?? 0,
                  ops: matchUpPlayerData[11] ?? 0,
                  percentile: -1,
                  matchUpBAPctl: -1,
                  matchUpOBPPctl: -1,
                  matchUpOPSPctl: -1,
                }
                matchUpStats.push(matchUpRowData);
                rowData.atBats = matchUpPlayerData[0] ?? 0;
                rowData.hits = matchUpPlayerData[1] ?? 0;
                rowData.doubles = matchUpPlayerData[2] ?? 0;
                rowData.triples = matchUpPlayerData[3] ?? 0;
                rowData.homeRuns = matchUpPlayerData[4] ?? 0;
                rowData.rbi = matchUpPlayerData[5] ?? 0;
                rowData.walks = matchUpPlayerData[6] ?? 0;
                rowData.strikeouts = matchUpPlayerData[7] ?? 0;
                rowData.battingAvg = matchUpPlayerData[8] ?? 0;
                rowData.obp = matchUpPlayerData[9] ?? 0;
                rowData.ops = matchUpPlayerData[11] ?? 0;
              };

              // Season Data
              const seasonData =
                playerData?.data?.splitCategories[0]?.splits?.[0]?.stats ?? [];
              const seasonRowData = {
                id: playerId,
                atBats: seasonData[0] ?? 0,
                hits: seasonData[2] ?? 0,
                doubles: seasonData[3] ?? 0,
                triples: seasonData[4] ?? 0,
                homeRuns: seasonData[5] ?? 0,
                rbi: seasonData[6] ?? 0,
                walks: seasonData[7] ?? 0,
                strikeouts: seasonData[9] ?? 0,
                battingAvg: seasonData[12] ?? 0,
                obp: seasonData[13] ?? 0,
                ops: seasonData[15] ?? 0,
                percentile: -1,
                seasonBAPctl: -1,
                seasonOBPPctl: -1,
                seasonOPSPctl: -1,
              };
              seasonStats.push(seasonRowData);
              rowData.seasonAtBats = seasonData[0] ?? 0;
              rowData.seasonBattingAvg = seasonData[12] ?? "-";
              rowData.seasonObp = seasonData[13] ?? "-";
              rowData.seasonOps = seasonData[15] ?? "-";

              // Venue Data
              const venueArray = playerData?.data?.splitCategories[4]?.splits ?? [];
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
              const throwHandArray = playerData?.data?.splitCategories[1]?.splits ?? [];
              const displayName = matchUps[i].pitcherThrows === 'Right' ? 'vs. Right' : 'vs. Left';
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
              rowData.throwHandAtBats = throwHandData[0] ?? 0;
              rowData.throwHandBattingAvg = throwHandData[12] ?? "-";
              rowData.throwHandObp = throwHandData[13] ?? "-";
              rowData.throwHandOps = throwHandData[15] ?? "-";

              // home/away stats
              const isBatterHome = matchUps[i].isBatterHome;
              const homeAwayArray = playerData?.data?.splitCategories[1]?.splits ?? [];
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
              rowData.homeAwayAtBats = homeAwayData[0] ?? 0;
              rowData.homeAwayBattingAvg = homeAwayData[12] ?? "-";
              rowData.homeAwayObp = homeAwayData[13] ?? "-";
              rowData.homeAwayOps = homeAwayData[15] ?? "-";

              // Recent Days
              const splitsByDays =
                playerData?.data?.splitCategories[2]?.splits ?? [];
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
              rowData.sevDayAtBats = sevenDaysData[0] ?? 0;
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
              rowData.fifDayAtBats = fifteenDaysData[0] ?? 0;
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
              rowData.thirDayAtBats = thirtyDaysData[0] ?? 0;
              rowData.thirDayBattingAvg = thirtyDaysData[12] ?? "-";
              rowData.thirDayObp = thirtyDaysData[13] ?? "-";
              rowData.thirDayOps = thirtyDaysData[15] ?? "-";

              if (newRows.includes((x) => x.playerId === rowData.playerId)) {
                newRows.playerId = 1000 + playerId
              }
              newRows.push(rowData);
              battersArray.push(playerId);
            }
          }
        }

        // Batting Average Percentile Section
        let validMatchUpStats = matchUpStats
          .filter((x) => x?.atBats > 5)
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
          const matchUpIndex = validMatchUpStats.findIndex(
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
          if (matchUpIndex > -1) {
            const matchUpBAPctl =
              ((validMatchUpStats.length - (matchUpIndex + 1)) /
                validMatchUpStats.length) *
              100;
            const rowIndex = matchUpStats.findIndex((x) => x.id === playerId);
            matchUpStats[rowIndex].matchUpBAPctl = matchUpBAPctl;
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
        validMatchUpStats = matchUpStats
          .filter((x) => x?.atBats > 5)
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
          const matchUpIndex = validMatchUpStats.findIndex(
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
          if (matchUpIndex > -1) {
            const matchUpOBPPctl =
              ((validMatchUpStats.length - (matchUpIndex + 1)) /
                validMatchUpStats.length) *
              100;
            const rowIndex = matchUpStats.findIndex((x) => x.id === playerId);
            matchUpStats[rowIndex].matchUpOBPPctl = matchUpOBPPctl;
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
        validMatchUpStats = matchUpStats
          .filter((x) => x?.atBats > 5)
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
          const matchUpIndex = validMatchUpStats.findIndex(
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
          if (matchUpIndex > -1) {
            const matchUpOPSPctl =
              ((validMatchUpStats.length - (matchUpIndex + 1)) /
                validMatchUpStats.length) *
              100;
            const rowIndex = matchUpStats.findIndex((x) => x.id === playerId);
            matchUpStats[rowIndex].matchUpOPSPctl = matchUpOPSPctl;
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
          let matchUpPctlArray = [];
          const index = matchUpStats.findIndex((x) => x.id === battersArray[p]);
          if (index > -1 && matchUpStats[index]?.atBats > 5) {
            matchUpPctlArray = [matchUpStats[index].matchUpBAPctl, matchUpStats[index].matchUpOBPPctl, matchUpStats[index].matchUpOPSPctl];
          }
          const matchUpPctl = matchUpPctlArray.length > 0 ? (matchUpPctlArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / matchUpPctlArray.length) : -1;

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
            matchUpPctl,
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
          newRows[p].matchUpPercentile = matchUpPctl;
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
      setLoading(true);
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
    { field: "throwHandAtBats", headerName: "ABs", width: 20 },
    { field: "throwHandBattingAvg", headerName: "BA", width: 60 },
    { field: "throwHandObp", headerName: "OB%", width: 60 },
    { field: "throwHandOps", headerName: "OPS", width: 60 },
    { field: "homeAwayAtBats", headerName: "ABs", width: 20 },
    { field: "homeAwayBattingAvg", headerName: "BA", width: 60 },
    { field: "homeAwayObp", headerName: "OB%", width: 60 },
    { field: "homeAwayOps", headerName: "OPS", width: 60 },
    { field: "sevDayAtBats", headerName: "ABs", width: 20 },
    { field: "sevDayBattingAvg", headerName: "BA", width: 60 },
    { field: "sevDayObp", headerName: "OB%", width: 60 },
    { field: "sevDayOps", headerName: "OPS", width: 60 },
    { field: "fifDayAtBats", headerName: "ABs", width: 20 },
    { field: "fifDayBattingAvg", headerName: "BA", width: 60 },
    { field: "fifDayObp", headerName: "OB%", width: 60 },
    { field: "fifDayOps", headerName: "OPS", width: 60 },
    { field: "thirDayAtBats", headerName: "ABs", width: 20 },
    { field: "thirDayBattingAvg", headerName: "BA", width: 60 },
    { field: "thirDayObp", headerName: "OB%", width: 60 },
    { field: "thirDayOps", headerName: "OPS", width: 60 },
    { field: "seasonAtBats", headerName: "ABs", width: 20 },
    { field: "seasonBattingAvg", headerName: "BA", width: 60 },
    { field: "seasonObp", headerName: "OB%", width: 60 },
    { field: "seasonOps", headerName: "OPS", width: 60 },
    { field: "percentile", headerName: "Pctl", width: 60, type: "number" },
    // { field: "matchUpPercentile", headerName: "vs", width: 60 },
    // { field: "throwHandPercentile", headerName: "R/L", width: 60 },
    // { field: "seasonPercentile", headerName: "Season", width: 60 },
    // { field: "venuePercentile", headerName: "venue", width: 60 },
    // { field: "totalDaysPercentile", headerName: "total Days", width: 60 },
  ];

  return (
    <div style={{ height: "500px", width: "100%" }}>
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
