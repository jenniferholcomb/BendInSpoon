import React from "react"
import styles from "./Invoice.module.scss";
import PropTypes from 'prop-types';

const {itemCard1, invoiceList, listHeaderInv, listValuesInv} = styles;

function Invoice(props) {
  return (
    <>
      <div onClick = {() => props.whenInvoiceClicked(props.invoiceNumber)}>
        <div className={itemCard1}>
          <table>
            <tbody>
              <tr>
                <th className={listHeaderInv}>INVOICE#</th>
                <td className={listValuesInv}>{props.invoiceNumber}</td>
              </tr>
              <tr>
                <th className={listHeaderInv}>DATE</th>
                <td className={listValuesInv}>{props.date}</td>
              </tr>
              <tr>
                <th className={listHeaderInv}>PURVEYOR</th>
                <td className={listValuesInv}>{props.purveyor}</td>
              </tr>
              <tr>
                <th className={listHeaderInv}>NO. ITEMS</th>
                <td className={listValuesInv}>{props.numberItems}</td>
              </tr>
              <tr>
                <th className={listHeaderInv}>TOTAL</th>
                <td className={listValuesInv}>${props.total}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Invoice.propTypes = {
  onInvoiceSelection: PropTypes.func,
  purveyor: PropTypes.string,
  invoiceNumber: PropTypes.number,
  date: PropTypes.string,
  numberItems: PropTypes.number,
  total: PropTypes.number
};

export default Invoice;

