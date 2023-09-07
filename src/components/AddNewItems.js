import React from "react";
import PropTypes from 'prop-types';
import styles from "./AddNewItems.module.scss";
import stylesList from "./GoodsList.module.scss";
import { v4 } from 'uuid';

const {newItemsWrapper, invPrintWrapper, headingWrapper, dateWrapper, items, items2, itemsButton, itemsTA, input2} = styles;
const {barWrapper, nameWrapper, containerWrapper, goodsListWrapper, nav6} = stylesList;


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
      <div className={barWrapper}>
        <div className={nameWrapper}>
          COST OF GOODS
        </div>
        <div className={containerWrapper}>
          <button className={nav6} onClick={props.onReset}>CANCEL</button>
        </div>
      </div>
      <div className={goodsListWrapper}>
        <div className={newItemsWrapper}>
          <h5>ADD ITEMS</h5>
          <form onSubmit={(event) => {
            const buttonName = event.nativeEvent.submitter.name;
            if (buttonName === 'submitItems') handleCompleteItemSubmission(event);
            if (buttonName === 'addMore') handleNewItemsSubmission(event);
            }} >
            <input
              class={items}
              type='number'
              name='itemCode'
              placeholder='&nbsp;&nbsp;&nbsp;Item #' required/>
            <textarea
              class={itemsTA}
              name='description'
              placeholder='Description' required/>
            <input
              class={`${items} ${items2}`}
              type='number'
              name='quantity'
              placeholder='&nbsp;&nbsp;&nbsp;Quantity' required/>
            <input
              class={items}
              type='number'
              name='unitPrice'
              step= '.01'
              placeholder='&nbsp;&nbsp;&nbsp;$/Unit' required/><br /><br />
            <button type='submit' class={itemsButton} name='addMore'>ADD MORE ITEMS</button><br /><br />
            <button class={itemsButton} type='submit' name='submitItems'>FINISH INVOICE</button>
          </form>
        </div>
        
          <div className={headingWrapper}>
            <h3>INVOICE# {currentInvoice.current[0].invoiceNumber}</h3>
          </div>  
          <div className={dateWrapper}>
            {currentInvoice.current[0].date}
          </div>
          <div className={invPrintWrapper}>
          <table>
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
