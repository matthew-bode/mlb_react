import { useState, useEffect } from 'react';
import axios from "axios";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const PitcherTable = ({ matchUps, generateTable }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rows = [];
                for (let i = 0; i < matchUps.length; i++) {
                    const pitcherId = matchUps[i].pitcher;
                    if (pitcherId) {
                        const playerData = await axios.get(
                            `https://site.web.api.espn.com/apis/common/v3/sports/baseball/mlb/athletes/${pitcherId}/splits`
                        );
                        if (playerData?.data?.splitCategories) {
                            const seasonStats = playerData?.data?.splitCategories[0]?.splits[0]?.stats;
                            const opponentBatting = playerData?.data?.splitCategories[1]?.splits[0]?.stats;
                            const rowData = {
                                id: pitcherId,
                                playerName: `${matchUps[i].pitcherName} (${matchUps[i].pitcherTeam})`,
                                oppTeam: matchUps[i].batterTeamFullName,
                                category: 'Season Stats',
                                era: seasonStats[0],
                                record: `="${seasonStats[1]} - ${seasonStats[2]}"`,
                                games: `="${seasonStats[5]} - ${seasonStats[6]}"`,
                                innings: seasonStats[8],
                                abs: opponentBatting[0],
                                homeRuns: seasonStats[12],
                                walks: seasonStats[13],
                                strikeouts: seasonStats[14],
                                battingAvg: seasonStats[15],
                                ops: opponentBatting[15],
                            }

                            rows.push(rowData);

                            const homeAwayStats = matchUps[i].isBatterHome
                                ? playerData?.data?.splitCategories[2]?.splits[1]?.stats
                                : playerData?.data?.splitCategories[2]?.splits[0]?.stats;
                            const homeAwayString = matchUps[i].isBatterHome ? 'Away' : 'Home';
                            if (homeAwayStats) {
                                const homeAwayRowData = {
                                    id: 1000 + pitcherId,
                                    playerName: "=\"\"",
                                    oppTeam: "=\"\"",
                                    category: `${homeAwayString} Stats`,
                                    era: homeAwayStats[0],
                                    record: `="${homeAwayStats[1]} - ${homeAwayStats[2]}"`,
                                    games: `="${homeAwayStats[5]} - ${homeAwayStats[6]}"`,
                                    abs: "=\"\"",
                                    innings: homeAwayStats[8],
                                    homeRuns: homeAwayStats[12],
                                    walks: homeAwayStats[13],
                                    strikeouts: homeAwayStats[14],
                                    battingAvg: homeAwayStats[15],
                                }

                                rows.push(homeAwayRowData);
                            }

                            const leftStats = playerData?.data?.splitCategories[3]?.splits[0]?.stats;
                            if (leftStats) {
                                const leftRowData = {
                                    id: 2000 + pitcherId,
                                    playerName: "=\"\"",
                                    oppTeam: "=\"\"",
                                    category: 'Vs. Left Stats',
                                    era: "=\"\"",
                                    record: "=\"\"",
                                    games: "=\"\"",
                                    innings: "=\"\"",
                                    abs: leftStats[0],
                                    homeRuns: leftStats[5],
                                    walks: leftStats[7],
                                    strikeouts: leftStats[9],
                                    battingAvg: leftStats[12],
                                    ops: leftStats[15],
                                }

                                rows.push(leftRowData);
                            }

                            const rightStats = playerData?.data?.splitCategories[3]?.splits[1]?.stats;
                            if (rightStats) {
                                const rightRowData = {
                                    id: 3000 + pitcherId,
                                    playerName: "=\"\"",
                                    oppTeam: "=\"\"",
                                    category: 'Vs. Right Stats',
                                    era: "=\"\"",
                                    record: "=\"\"",
                                    games: "=\"\"",
                                    innings: "=\"\"",
                                    abs: rightStats[0],
                                    homeRuns: rightStats[5],
                                    walks: rightStats[7],
                                    strikeouts: rightStats[9],
                                    battingAvg: rightStats[12],
                                    ops: rightStats[15],
                                }

                                rows.push(rightRowData);
                            }

                            const blankRowData = {
                                id: 9000 + i,
                                playerName: "=\"\"",
                                oppTeam: "=\"\"",
                                category: "=\"\"",
                                era: "=\"\"",
                                record: "=\"\"",
                                games: "=\"\"",
                                innings: "=\"\"",
                                abs: "=\"\"",
                                homeRuns: "=\"\"",
                                walks: "=\"\"",
                                strikeouts: "=\"\"",
                                battingAvg: "=\"\"",
                                ops: "=\"\"",
                            }

                            rows.push(blankRowData);
                        }
                    }
                }

                setData(rows);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        if (generateTable) {
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
        { field: "playerName", headerName: "Pitcher", width: 175 },
        { field: "oppTeam", headerName: "Opposing Team", width: 175 },
        { field: "category", headerName: "Category", width: 175 },
        { field: "era", headerName: "ERA", width: 60, type: "number" },
        { field: "record", headerName: "W-L", width: 60 },
        { field: "games", headerName: "GP-GS", width: 80 },
        { field: "innings", headerName: "IP", width: 60, type: "number" },
        { field: "abs", headerName: "ABs", width: 60, type: "number" },
        { field: "homeRuns", headerName: "HR", width: 20, type: "number" },
        { field: "walks", headerName: "BB", width: 20, type: "number" },
        { field: "strikeouts", headerName: "K", width: 20, type: "number" },
        { field: "battingAvg", headerName: "OBA", width: 60, type: "number" },
        { field: "ops", headerName: "OPS", width: 60, type: "number" },
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
                }}
            />
        </div>
    );
}

export default PitcherTable;