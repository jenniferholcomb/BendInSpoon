import React from "react";
import Header from "./Header";
import Weather from "./Weather";
import Calendar from "./Calendar";
import Events from "./Events";
import Holidays from "./Holidays";
import styles from "./Agents.module.scss";

function Agents () {

  return (
    <div className={styles.agentsWrapper}>
      <Header />
      <Weather />
      <Calendar />
      <Holidays />
      <Events />
    </div>
  );
}

export default Agents;

