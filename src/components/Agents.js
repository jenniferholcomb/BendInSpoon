import React from "react";
import Header from "./Header";
import Weather from "./Weather";
import Calendar from "./Calendar";
// import Events from "./Events";
// import Holidays from "./Holidays";
import styles from "./Agents.module.scss";
import styled from 'styled-components';

// const AgentsWrapper = styled.section`
//   grid-column: 1;
//   width: 90%;
//   height: auto;
//   margin-right: -10px;
//   margin-top: 20px;
//   margin-left: 40px;
//   margin-bottom: 30px;
//   display: grid;
// `;

function Agents () {

  return (
    <div className={styles.agentsWrapper}>
      <Header />
      <Weather />
      <Calendar />
      {/* <Events /> */}
    </div>
  );
}

export default Agents;

