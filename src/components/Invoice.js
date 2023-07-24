import React from "react"
import "./Invoice.module.scss";
import PropTypes from 'prop-types';

function Invoice(props) {
  return (
    <>
      <div onClick = {() => props.whenInvoiceClicked(props.invoiceNumber)}>
        <div className="itemCard-1">
          <table>
            <tbody className="invoice-list">
              <tr>
                <th className="list-header-inv">INVOICE#</th>
                <td className="list-values-inv">{props.invoiceNumber}</td>
              </tr>
              <tr>
                <th className="list-header-inv">DATE</th>
                <td className="list-values-inv">{props.date}</td>
              </tr>
              <tr>
                <th className="list-header-inv">PURVEYOR</th>
                <td className="list-values-inv">{props.purveyor}</td>
              </tr>
              <tr>
                <th className="list-header-inv">NO. ITEMS</th>
                <td className="list-values-inv">{props.numberItems}</td>
              </tr>
              <tr>
                <th className="list-header-inv">TOTAL</th>
                <td className="list-values-inv">${props.total}</td>
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

