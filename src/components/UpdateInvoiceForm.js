import React, { useState } from "react";
import stylesList from "./InvoiceList.module.scss";
import stylesUpdate from "./UpdateInvoiceForm.module.scss";
import PropTypes from 'prop-types';

const {barInvWrapper, nameInvWrapper, containerInvWrapper, navInvList1, navInvList2, invoiceListWrapper, invoiceListContainer, invoiceDetContainer, invPrintWrapper, headingWrapper, dateWrapper, buttonWrapper, detailTable, detHead1, detHead2, detHead3, detHead4, detHead5} = stylesList;
const {invoiceWrapper, tableWrapper, cancelWrapper, dataHead1, dataHead2, dataHead3, dataHead4, dataHead5, dataRow, input3, input1, input2, editHead, editLabel, deletebtn} = stylesUpdate;

function UpdateInvoiceForm(props) {
  const { invoice } = props;
  const [state, setState] = useState(invoice);

  const handleChange = (event, index) => {
    const { value, name, type } = event.target;

    const newState = [...state];
    if ( type === 'text') {
      newState[index] = {
        ...newState[index],
        [name]: value
      };
    } else if (name === 'unitPrice' || name === 'quantity') {
      newState[index] = {
        ...newState[index],
        [name]: parseFloat(value)
      };
      newState[index] = {
        ...newState[index],
        'extendedAmount': parseFloat(newState[index].unitPrice * newState[index].quantity)
      };
    } else {
      newState[index] = {
        ...newState[index],
        [name]: parseInt(value)
      };
    }
    setState(newState);
  };

  const handleAllChange = (event) => {
    const { value, name } = event.target;

    const newState = [...state];
    newState.map((entry, index) => 
      newState[index] = {
        ...newState[index],
        [name]: value
      }
    );
    setState(newState);
  }

  const handleDeleteItem = (index) => {
    const newState = [...state];
    if (newState.length === 2) {
      props.onClickingDelete();
    } else {
      const deleteId = newState[index+1].id;
      const updatedItems = [...newState.slice(0,index+1), ...newState.slice(index+2, newState.length)];
      setState(updatedItems);
      props.onDeleteItem(deleteId, updatedItems);
    }
  }

  const handleEditsSubmission = (event) => {
    event.preventDefault();
    const newState = [...state];
    props.onEditFormCreation(newState);
  }

  return (
    <> 
      <div className={barInvWrapper}>
        <div className={nameInvWrapper}>
          EDIT INVOICE
        </div>
        <div className={containerInvWrapper}>
          <button className={navInvList1} onClick={props.onReset}>BACK TO LIST</button>
        </div>
      </div>
      <div className={invoiceListWrapper}>
        <div className={invoiceDetContainer}>
          <form onSubmit={handleEditsSubmission}>
          <div className={invoiceWrapper}>
          <table className={editHead}>
            <tr>
              <td className={editLabel}><label htmlFor="purveyor">PURVEYOR</label></td>
              <td><input
                  className={input3}
                  type='text'
                  name='purveyor'
                  placeholder={invoice[0].purveyor} 
                  defaultValue={invoice[0].purveyor}
                  onChange={(e) => handleChange(e, 0)}
                  required /></td>
            </tr>
            <tr>
              <td><label htmlFor="invoiceNumber">INVOICE#</label></td>
              <td><input
                    className={input3}
                    type='number'
                    name='invoiceNumber'
                    placeholder={invoice[0].invoiceNumber} 
                    defaultValue={invoice[0].invoiceNumber} 
                    onChange={(e) => handleAllChange(e)}       
                    required /></td>
            </tr>
            <tr> 
              <td><label htmlFor="date">DATE</label></td>
              <td><input
                    className={input3}
                    type='date'
                    name='date'
                    placeholder={invoice[0].date}
                    defaultValue={invoice[0].date} 
                    onChange={(e) => handleAllChange(e)}                  
                    required /></td>
            </tr>
          </table>
        
          <div className={tableWrapper}>
            <hr />
            <table>
            <tr>
              <th className={dataHead1}>No./</th>
              <th className={dataHead2}>Item#</th>
              <th className={dataHead3}>Description</th>
              <th className={dataHead4}>Units</th>
              <th className={dataHead5}>Price/Unit</th>
            </tr>
                {invoice.slice(1).map((item, index) => 
                  <>
                    <tr>
                    <td>{index + 1}</td>
                    <td><input
                      className={input1}
                      type='text'
                      name='itemCode'
                      placeholder={item.itemCode}
                      defaultValue={item.itemCode} 
                      onChange={(e) => handleChange(e, (index+1))}                
                      required /></td>      
                    <td className="data-row"><textarea
                      className={input2}
                      name='description'
                      placeholder={item.description}
                      defaultValue={item.description} 
                      onChange={(e) => handleChange(e, (index+1))} 
                      required /></td>
                    <td><input
                      className={input1}
                      type='number'
                      name='quantity'
                      placeholder={item.quantity}
                      defaultValue={item.quantity}  
                      onChange={(e) => handleChange(e, (index+1))}               
                      required /></td>
                    <td><input
                      className={input1}
                      type='number'
                      name='unitPrice'
                      placeholder={item.unitPrice}
                      defaultValue={item.unitPrice}  
                      onChange={(e) => handleChange(e, (index+1))}               
                      required /></td>
                    <td><button className={deletebtn} onClick={() => handleDeleteItem(index)}>DELETE</button></td>
                    </tr>
                  </>
                )}
              </table>
            </div>
              <div className={cancelWrapper}>
                <button className={navInvList2} type="submit">UPDATE INVOICE</button>
                <button className={navInvList2} onClick={props.onReset}>CANCEL</button>
              </div>
            </div>
          </form><br />
        </div>
      </div>
    </>
  );
}

UpdateInvoiceForm.propTypes = {
  invoice: PropTypes.array,
  onEditFormCreation: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onClickingDelete: PropTypes.func
};

export default UpdateInvoiceForm;