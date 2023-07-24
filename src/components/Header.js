import React from "react";
import logoArt from "./../img/BendSpoon.svg"
import styles from "./Header.module.scss";

const { headerWrapper, imgContainer, logo, subheadWrap, tagWrap, empty, locWrap } = styles;

function Header () {
  return (
    <>
      <div className={headerWrapper}>
        <div className={imgContainer}>
          <img className={logo} src={logoArt} alt="Logo" />
          <div className={subheadWrap}>
            <div className={tagWrap}>BENDING BUSINESS TO CUSTOMER FORECASTS </div>
            <div className={empty}> </div>
            <div className={locWrap}>BEND, OREGON</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;