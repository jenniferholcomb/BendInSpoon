import React from "react";
import PropTypes from 'prop-types';
import "./AddNewItems.module.scss";
import { v4 } from 'uuid';

function AddNewItems(props) {
  const { currentInvoice } = props;

  const handleNewItemsSubmission = (event) => {
    event.preventDefault();
    props.onAddItemsCreation({
      itemCode: event.target.itemCode.value,
      description: event.target.description.value,
      quantity: parseInt(event.target.quantity.value),
      unitPrice: parseFloat(event.target.unitPrice.value),
      extendedAmount: parseInt(event.target.quantity.value) * parseFloat(event.target.unitPrice.value), 
      invoiceNumber: currentInvoice.current[0].invoiceNumber,
      date: currentInvoice.current[0].date,
      key: v4()
    });
    event.target.reset();
  };

  const handleCompleteItemSubmission = (event) => {
    event.preventDefault();
    props.onCompleteAddingItems({
      itemCode: event.target.itemCode.value,
      description: event.target.description.value,
      quantity: parseInt(event.target.quantity.value),
      unitPrice: parseFloat(event.target.unitPrice.value),
      extendedAmount: parseInt(event.target.quantity.value) * parseFloat(event.target.unitPrice.value), 
      invoiceNumber: currentInvoice.current[0].invoiceNumber,
      date: currentInvoice.current[0].date,
      key: v4()
    });
  }

  return (
    <>
      <div className="bar-wrapper">
        <div className="name-wrapper">
          COST OF GOODS
        </div>
        <div className="container-wrapper">
          <button className="nav-6" onClick={props.onReset}>CANCEL</button>
        </div>
      </div>
      <div className="goods-list-wrapper">
        <div className="new-items-wrapper">
          <h5>ADD ITEMS</h5>
          <form onSubmit={(event) => {
            const buttonName = event.nativeEvent.submitter.name;
            if (buttonName === 'submitItems') handleCompleteItemSubmission(event);
            if (buttonName === 'addMore') handleNewItemsSubmission(event);
            }} >
            <input
              class="items"
              type='number'
              name='itemCode'
              placeholder='&nbsp;&nbsp;&nbsp;Item #' required/>
            <textarea
              class="items"
              name='description'
              placeholder='Description' required/>
            <input
              class="items-2"
              type='number'
              name='quantity'
              placeholder='&nbsp;&nbsp;&nbsp;Quantity' required/>
            <input
              class="items"
              type='number'
              name='unitPrice'
              step= '.01'
              placeholder='&nbsp;&nbsp;&nbsp;$/Unit' required/><br /><br />
            <button type='submit' class="items-button" name='addMore'>ADD MORE ITEMS</button><br /><br />
            <button class="items-button" type='submit' name='submitItems'>FINISH INVOICE</button>
          </form>
        </div>
        
          <div className="heading-wrapper">
            <h3>INVOICE# {currentInvoice.current[0].invoiceNumber}</h3>
          </div>  
          <div className="date-wrapper">
            {currentInvoice.current[0].date}
          </div>
          <div className="inv-print-wrapper">
          <table >
            <tr>
              <th>Item#</th>
              <th>Description</th>
              <th>Units</th>
              <th>Price/Unit</th>
            </tr>
            
            {currentInvoice.current.slice(1).map(item => 
              <>
                <tr>
                  <td>{item.itemCode}</td>
                  <td>{item.description}</td>
                  <td>{item.quantity}</td>
                  <td>{item.extendedAmount.toFixed(2)}</td>
                </tr>
              </>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

AddNewItems.propTypes = {
  onAddItemsCreation: PropTypes.func,
  onCompleteAddingItems: PropTypes.func,
  invoiceNumber: PropTypes.number,
  date: PropTypes.string,
  currentInvoice: PropTypes.object
};

export default AddNewItems;
