import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

const today = 20240719;

const HitterVsPitcher = ({ schedule }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchUps, setMatchUps] = useState([]);

  useEffect(() => {
    if (schedule !== null) {
      const newMatchUps = [];
      var keys = Object.keys(schedule);
      for (let n = 0; n < keys.length; n++) {
        let homePitcher = null;
        let awayPitcher = null;
        let homeTeam = null;
        let awayTeam = null;
        let homeLogo = '';
        let awayLogo = '';
        const homePitcherURL = schedule[keys[n]].competitors[0]?.probable?.href;
        if (homePitcherURL) {
          const urlSplit = homePitcherURL.split('/id/');
          homePitcher = urlSplit[1] ?? null;
        }
        const awayPitcherURL = schedule[keys[n]].competitors[1]?.probable?.href;
        if (awayPitcherURL) {
          const urlSplit = awayPitcherURL.split('/id/');
          awayPitcher = urlSplit[1] ?? null;
        }
        homeTeam = schedule[keys[n]].competitors[0]?.id;
        awayTeam = schedule[keys[n]].competitors[1]?.id;
        homeLogo = schedule[keys[n]].competitors[0]?.logo;
        awayLogo = schedule[keys[n]].competitors[1]?.logo;
        newMatchUps.push(
          {
            pitcher: homePitcher,
            team: awayTeam,
            batterLogo: awayLogo,
            pitcherLogo: homeLogo,
          },
          {
            pitcher: awayPitcher,
            team: homeTeam,
            batterLogo: homeLogo,
            pitcherLogo: awayLogo,
          }
        );
      }
      setMatchUps(newMatchUps);
    }
  }, [schedule]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newRows = [];
        for (let i = 0; i < matchUps.length; i++) {
          if (matchUps[i].pitcher) {
            const response = await axios.get(
              `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${matchUps[i].pitcher}/vsathlete?region=us&lang=en&contentorigin=espn&teamId=${matchUps[i].team}`
            );
            if (response) {
              const players = response.data?.statistics?.statistics ?? [];
              const pitcherString = response.data?.statistics?.displayName ?? '';
              const pitcherStringSplit = pitcherString.split('vs. ');
              const pitcher = pitcherStringSplit[1] ?? '';
              for (let j = 0; j < players.length; j++) {
                const batter = players[j].stats;
                const batterLogo = matchUps[i]?.batterLogo ?? '';
                const pitcherLogo = matchUps[i]?.pitcherLogo ?? '';
                const rowData = {
                  id: players[j].uid,
                  playerName: [batterLogo, players[j].displayName],
                  oppPitcher: [pitcherLogo, pitcher],
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
                };
                if (batter[0] >= 6) {
                  newRows.push(rowData);
                }
              }
            }
          }
        }
        setData(newRows);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (matchUps.length > 0) {
      fetchData();
    }
  }, [matchUps]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const columns = [
    { field: "id", headerName: "ID", width: 100, hide: true },
    {
      field: "playerName",
      headerName: "Batter",
      renderCell: (params) => (
        <div>
          <img src={params.value[0]} width={30} />
          <span>{params.value[1]}</span>
        </div>
      ),
      width: 175
    },
    {
      field: "oppPitcher",
      headerName: "Pitcher",
      renderCell: (params) => (
        <div>
          <img src={params.value[0]} width={30} />
          <span>{params.value[1]}</span>
        </div>
      ),
      width: 175
    },
    { field: "atBats", headerName: "ABs", width: 20 },
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
  ];

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        initialState={{
          columns: {
            columnVisibilityModel: {
              id: false,
            },
          },
        }}
      />
    </div>
  );
};

export default HitterVsPitcher;
