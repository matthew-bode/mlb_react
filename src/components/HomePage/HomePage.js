import React, { useEffect, useState } from "react";
import axios from "axios";
import css from "./HomePage.module.css";
import Header from "../Header/Header.js";
import LeftPanel from "../LeftPanel/LeftPanel.js";
import RightPanel from "../RightPanel/RightPanel";
import MainSection from "../Main/MainSection";

const today = 20240904;

const HomePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const GetSchedules = async () => {
      try {
        const response = await axios.get(
          `/mlb/schedule/_/date/${today}?_xhr=pageContent&refetchShell=false&offset=-05%3A00&original=date%3D${today}&date=${today}`
        );
        const events = response.data.events;
        if (events) {
          var keys = Object.keys(events);

          setSchedule(events[keys[1]]);
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    GetSchedules();
  }, []);

  console.log("schedule", schedule);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className={css.mainHomePageDiv}>
      {error && <div>Error: {error.message}</div>}
      <Header />
      <LeftPanel />
      <MainSection schedule={schedule} />
      <RightPanel />
    </div>
  );
};

export default HomePage;
