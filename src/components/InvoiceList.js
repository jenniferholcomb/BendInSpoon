import React from "react";
import Invoice from "./Invoice";
import styles from "./InvoiceList.module.scss";
import PropTypes from 'prop-types';

const {barInvWrapper, nameInvWrapper, containerInvWrapper, navInvList1, invoiceListWrapper, invoiceListContainer} = styles;

function InvoiceList (props) {
  return (
    <>
      <div className={barInvWrapper}>
        <div className={nameInvWrapper}>
          MANAGE INVOICES
        </div>
        <div className={containerInvWrapper}>
          <button className={navInvList1} onClick={props.onReset}>BACK TO GOODS</button>
        </div>
      </div>
      <div className={invoiceListWrapper}>
        <div className={invoiceListContainer}>
          {props.invoices.map((entry, index) => 
            <Invoice
              whenInvoiceClicked= {props.onInvoiceSelection}
              purveyor={entry.purveyor}
              invoiceNumber={entry.invoiceNumber}
              date={entry.date}
              numberItems={entry.numberItems}
              total={entry.total}
              // onInvList={props.onManageInvoices}
              onReset={props.onReset}
              key={index} />
          )}
        </div>
      </div>
    </>
  );
}

InvoiceList.propTypes = {
  onInvoiceSelection: PropTypes.func,
  invoices: PropTypes.array,
  onReset: PropTypes.func,
  onManageInvoices: PropTypes.func
};

export default InvoiceList;
