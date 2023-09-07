import React from "react";
import styles from "./InvoiceList.module.scss";
import PropTypes from 'prop-types';

const {barInvWrapper, nameInvWrapper, containerInvWrapper, navInvList1, navInvList2, invoiceListWrapper, invoiceDetContainer, invPrintWrapper, headingWrapper, dateWrapper, buttonWrapper, detailTable, detHead1, detHead2, detHead3, detHead4, detHead5} = styles;

function InvoiceDetail (props) {
  const { invoice } = props;
  console.log(invoice)
  return (
    <>
      <div className={barInvWrapper}>
        <div className={nameInvWrapper}>
          INVOICE DETAIL
        </div>
        <div className={containerInvWrapper}>
          <button className={navInvList1} onClick={props.onReset}>BACK TO LIST</button>
        </div>
      </div>

      <div className={invoiceListWrapper}>
        <div className={invoiceDetContainer}>
          <div className={headingWrapper}>
            <h3>INVOICE# {invoice[0].invoiceNumber}</h3>
            <h5>TOTAL <strong>${invoice[0].total}</strong></h5>
          </div>  
            <div className={dateWrapper}>
              {invoice[0].date}
            </div>
            <div className={invPrintWrapper}>
            <table className={detailTable}>
              <tr>
                <th className={detHead1}>No.</th>
                <th className={detHead2}>Item#</th>
                <th className={detHead5}>Description</th>
                <th className={detHead2}>Units</th>
                <th className={detHead3}>Unit/Price</th>
                <th className={detHead4}>Amount</th>
              </tr>
              
              {invoice.slice(1).map((item, index) => 
                <>
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item.itemCode}</td>
                    <td>{item.description}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unitPrice.toFixed(2)}</td>
                    <td>{item.extendedAmount.toFixed(2)}</td>
                  </tr>
                </>
              )}
            </table>
            <div className={buttonWrapper}>
              <button className={navInvList2} onClick={props.onClickingEdit}>EDIT INVOICE</button>
              <button className={navInvList2} onClick={props.onClickingDelete}>DELETE INVOICE</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

InvoiceDetail.propTypes = {
  invoice: PropTypes.array,
  onClickingDelete: PropTypes.func,
  onClickingEdit: PropTypes.func,
  onManageInvoices: PropTypes.func
}

export default InvoiceDetail;

