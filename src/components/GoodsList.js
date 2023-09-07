import React, { useEffect, useState } from "react";
import Goods from "./Goods";
import PropTypes from 'prop-types';
import styles from "./GoodsList.module.scss";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const {barWrapper, nameWrapper, containerWrapper, nav5, nav6, goodsListWrapper, iconWrapper, downWrap, goodsIcon, iconText, upWrap, invListWrapper} = styles;

function GoodsList (props) {

  const [goodsListCode, setGoodsListCode] = useState(null);
  const [goodsLoaded, setGoodsLoaded] = useState(false);
  const { goods } = props;

  useEffect(() => {
    const allItemCode = goods.reduce((array, value) => array.concat(value.itemCode), []);
    const uniqueGoodsCode = [...new Set(allItemCode)];
    const goodsList = uniqueGoodsCode.map(item => {
      return goods.filter(value => value.itemCode === item);
    });
    setGoodsListCode(goodsList);
    setGoodsLoaded(true);
  }, [goods])

  return (
    <>
      <div className={barWrapper}>
        <div className={nameWrapper}>
          COST OF GOODS
        </div>
        <div className={containerWrapper}>
          <button className={nav5} onClick={props.onManageInvoicesClick}>MANAGE INVOICES</button>
          <button className={nav6} onClick={props.onAddInvoiceClick}>ADD INVOICE</button>
        </div>
      </div>
      <div className={goodsListWrapper}>
        <div className={iconWrapper}>
          <div className={`${downWrap} ${goodsIcon}`}>
            <FaArrowDown />
            <span className={iconText}>COST DOWN</span>
          </div>
          <div className={`${upWrap} ${goodsIcon}`}>
            <FaArrowUp />
            <span className={iconText}>COST UP</span>
          </div>
        </div>    

        { 
        goodsLoaded ?
        <div className={invListWrapper}>
          {goodsListCode.map((entry, index) => 
            <Goods
              itemCodeList={entry} 
              key={index} />
          )}
        </div>
        :
          <p><em>...Loading</em></p>
        }
      </div>
    </>
  );
}

GoodsList.propTypes = {
  goods: PropTypes.array
};

export default GoodsList;