import React, { useState } from "react";
import "./InvoiceList.module.scss";
import "./UpdateInvoiceForm.scss";
import PropTypes from 'prop-types';

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
      <div className="bar-inv-wrapper">
        <div className="name-inv-wrapper">
          EDIT INVOICE
        </div>
        <div className="container-inv-wrapper">
          <button className="nav-inv-list-1" onClick={props.onReset}>BACK TO LIST</button>
        </div>
      </div>
      <div className="invoice-list-wrapper">
        <div className="invoice-det-container">
          <form onSubmit={handleEditsSubmission}>
          <div className="invoice-wrapper">
          <table className="edit-head">
            <tr>
              <td className="edit-label"><label htmlFor="purveyor">PURVEYOR</label></td>
              <td><input
                  className="input-3"
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
                    className="input-3"
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
                    className="input-3"
                    type='date'
                    name='date'
                    placeholder={invoice[0].date}
                    defaultValue={invoice[0].date} 
                    onChange={(e) => handleAllChange(e)}                  
                    required /></td>
            </tr>
          </table>
        
          <div className="table-wrapper">
            <hr />
            <table>
            <tr>
              <th className="data-head-1">No./</th>
              <th className="data-head-2">Item#</th>
              <th className="data-head-3">Description</th>
              <th className="data-head-4">Units</th>
              <th className="data-head-5">Price/Unit</th>
            </tr>
                {invoice.slice(1).map((item, index) => 
                  <>
                    <tr>
                    <td>{index + 1}</td>
                    <td><input
                      className="input-1"
                      type='text'
                      name='itemCode'
                      placeholder={item.itemCode}
                      defaultValue={item.itemCode} 
                      onChange={(e) => handleChange(e, (index+1))}                
                      required /></td>      
                    <td className="data-row"><textarea
                      className="input-2"
                      name='description'
                      placeholder={item.description}
                      defaultValue={item.description} 
                      onChange={(e) => handleChange(e, (index+1))} 
                      required /></td>
                    <td><input
                      className="input-1"
                      type='number'
                      name='quantity'
                      placeholder={item.quantity}
                      defaultValue={item.quantity}  
                      onChange={(e) => handleChange(e, (index+1))}               
                      required /></td>
                    <td><input
                      className="input-1"
                      type='number'
                      name='unitPrice'
                      placeholder={item.unitPrice}
                      defaultValue={item.unitPrice}  
                      onChange={(e) => handleChange(e, (index+1))}               
                      required /></td>
                    <td><button className="delete" onClick={() => handleDeleteItem(index)}>DELETE</button></td>
                    </tr>
                  </>
                )}
              </table>
            </div>
              <div className="cancel-wrapper">
                <button className="nav-inv-list-2" type="submit">UPDATE INVOICE</button>
                <button className="nav-inv-list-2" onClick={props.onReset}>CANCEL</button>
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