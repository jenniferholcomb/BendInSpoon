import React from "react";
import Invoice from "./Invoice";
import "./InvoiceList.module.scss";
import PropTypes from 'prop-types';

function InvoiceList (props) {
  return (
    <>
      <div className="bar-inv-wrapper">
        <div className="name-inv-wrapper">
          MANAGE INVOICES
        </div>
        <div className="container-inv-wrapper">
          <button className="nav-inv-list-1" onClick={props.onReset}>BACK TO GOODS</button>
        </div>
      </div>
      <div className="invoice-list-wrapper">
        <div className="invoice-list-container">
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
// className="inv-list-btn"