import React from "react";
import PropTypes from 'prop-types';
import styles from "./GoodsList.module.scss";
import styles2 from "./AddNewInvoice.module.scss";
import { v4 } from 'uuid';

const {barWrapper, goodsListWrapper, nameWrapper, containerWrapper, nav6, newInvoiceWrapper, headAdd} = styles;
const {inv, navInvList3, invButton} = styles2;

function AddNewInvoice(props) {

  function handleNewInvoiceSubmission(event) {
    event.preventDefault();
    props.onNewInvoiceCreation({
      purveyor: event.target.purveyor.value,
      invoiceNumber: parseInt(event.target.invoiceNumber.value),
      date: event.target.date.value,
      key: v4()
    });
  }

  return (
    <>
      <div className={barWrapper}>
        <div className={nameWrapper}>
          COST OF GOODS
        </div>
        <div className={containerWrapper}>
          <button className={nav6} onClick={props.onReset}>CANCEL</button>
        </div>
      </div>
      <div className={goodsListWrapper}>
        <div className={newInvoiceWrapper}>
          <h4 className={headAdd}>START NEW INVOICE</h4>
          <form onSubmit={handleNewInvoiceSubmission}>
            <input
              className={inv}
              type='text'
              name='purveyor'
              placeholder='Purveyor' required/><br />
            <input 
            className={inv}
              type='number'
              name='invoiceNumber'
              placeholder='Invoice #' required/><br />
            <input 
              className={inv}
              type='date'
              name='date'
              placeholder='Date' required/><br />
            <button className={navInvList3} type='submit'>NEXT</button>
          </form>
        </div>
      </div>
    </>
  );
}

AddNewInvoice.propTypes = {
  onNewInvoiceCreation: PropTypes.func,
  onReset: PropTypes.func
};

export default AddNewInvoice;