import React from 'react';
import GoodsControl from './GoodsControl';
import Agents from './Agents';
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.bodyWrapper}>
      <Agents />
      <GoodsControl />
    </div>
  );
}

export default App;
