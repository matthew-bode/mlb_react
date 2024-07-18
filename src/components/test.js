import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import { teamName } from "./enums";

const url =
"https://baseballsavant.mlb.com/statcast_search?hfPT=&hfAB=&hfGT=R%7CPO%7C&hfPR=&hfZ=&hfStadium=680%7C&hfBBL=&hfNewZones=&hfPull=&hfC=&hfSea=2024%7C2023%7C2022%7C2021%7C2020%7C2019%7C2018%7C2017%7C2016%7C2015%7C2014%7C2013%7C2012%7C2011%7C2010%7C2009%7C2008%7C&hfSit=&player_type=batter&hfOuts=&hfOpponent=&hfSA=&game_date_gt=&game_date_lt=&hfMo=&hfTeam=HOU%7C&home_road=&hfRO=&position=&hfInfield=&hfOutfield=&hfInn=&hfBBT=&batters_lookup%5B%5D=514888&hfFlag=&metric_1=&group_by=name&min_pitches=0&min_results=0&min_pas=0&sort_col=ba&player_event_sort=api_p_release_speed&sort_order=desc&chk_stats_abs=on&chk_stats_hits=on&chk_stats_singles=on&chk_stats_dbls=on&chk_stats_triples=on&chk_stats_hrs=on&chk_stats_so=on&chk_stats_bb=on&chk_stats_xba=on&chk_stats_xobp=on&chk_stats_xslg=on#results";
const today = 20240719;

const test = () => {
  const [data, setData] = useState([]);
  const [playerIds, setPlayerIds] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchUps, setMatchUps] = useState([]);

  useEffect(() => {
    const GetESPNIds = async () => {
      try {
        const response = await axios.get(
          "https://sports.core.api.espn.com/v3/sports/baseball/mlb/athletes?limit=20000"
        );
        // filter to only show active players
        const activePlayers = response.data.items.filter(
          (player) => player.active === true
        );
        // Transform the items array into an object with custom keys
        const modifiedData = {};
        activePlayers.forEach((item) => {
          // Replace `customKeyPrefix` with the desired prefix or key naming convention
          const customKey = `${item.uid}`;
          modifiedData[customKey] = item;
        });
        console.log(modifiedData);
        setPlayerIds(modifiedData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    GetESPNIds();
  }, []);

  useEffect(() => {
    const GetSchedules = async () => {
      try {
        const response = await axios.get(
          `/mlb/schedule/_/date/${today}?_xhr=pageContent&refetchShell=false&offset=-05%3A00&original=date%3D${today}&date=${today}`
        );
        setSchedule(response.data.events);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    GetSchedules();
  }, []);

  console.log('schedule', schedule.length);

  useEffect(() => {
    if (schedule) {
      const newMatchUps = [];
      for (let n = 0; n < schedule.events.length; n++) {
        const homePitcher =
          schedule?.events?.[n].competitions?.[0].competitors?.[0]
            .probables?.[0].athlete?.id ?? null;
        const awayPitcher =
          schedule?.events?.[n].competitions?.[0].competitors?.[1]
            .probables?.[0].athlete?.id ?? null;
        const homeTeam =
          schedule?.events?.[n].competitions?.[0].competitors?.[0].id ?? null;
        const awayTeam =
          schedule?.events?.[n].competitions?.[0].competitors?.[1].id ?? null;
        newMatchUps.push(
          {
            pitcher: homePitcher,
            team: awayTeam,
          },
          {
            pitcher: awayPitcher,
            team: homeTeam,
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
              for (let j = 0; j < players.length; j++) {
                const player = players[j].stats;
                const rowData = {
                  id: players[j].uid,
                  playerName: players[j].displayName,
                  team: teamName?.matchUps?.[i].team ?? "",
                  atBats: player[0],
                  hits: player[1],
                  doubles: player[2],
                  triples: player[3],
                  homeRuns: player[4],
                  rbi: player[5],
                  walks: player[6],
                  strikeouts: player[7],
                  battingAvg: player[8],
                  obp: player[9],
                  slug: player[10],
                  ops: player[11],
                };
                if (player[0] >= 10) {
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
    { field: "playerName", headerName: "Player Name", width: 150 },
    { field: "team", headerName: "Team", width: 150 },
    { field: "atBats", headerName: "At Bats", width: 100 },
    { field: "hits", headerName: "Hits", width: 100 },
    { field: "doubles", headerName: "Doubles", width: 100 },
    { field: "triples", headerName: "Triples", width: 100 },
    { field: "homeRuns", headerName: "Home Runs", width: 100 },
    { field: "rbi", headerName: "RBIs", width: 100 },
    { field: "walks", headerName: "Walks", width: 100 },
    { field: "strikeouts", headerName: "Strikeouts", width: 100 },
    { field: "battingAvg", headerName: "Batting Average", width: 150 },
    { field: "obp", headerName: "On Base %", width: 100 },
    { field: "slug", headerName: "Slugging %", width: 100 },
    { field: "ops", headerName: "OPS", width: 100 },
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

export default test;
