/*==================================================
src/components/Debits.js

The Debits component contains information for Debits page view.
Note: You need to work on this file for the Assignment.
==================================================*/
import {Link} from 'react-router-dom';
import AccountBalance from './AccountBalance';

const Debits = (props) => {
  // Create the list of Debit items
  let debitsView = () => {
    const { debits } = props;
    return debits.map((debit) => {  // Extract "id", "amount", "description" and "date" properties of each debits JSON array element
      let date = debit.date.slice(0,10);
      return <li key={debit.id}>{debit.amount} {debit.description} {date}</li>
    });
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const description = e.target.elements.description.value;
    let amount = e.target.elements.amount.value;
    amount = parseFloat(amount).toFixed(2);
    // console.log(description, amount);
    // console.log(props.addDebit);
    props.addDebit(description, Number(amount));
    e.target.reset();
  }

  // Render the list of Debit items and a form to input new Debit item
  return (
    <div>
      <h1>Debits</h1>

      {debitsView()}

      <form onSubmit={handleSubmit}>
        <input type="text" name="description" />
        <input type="number" name="amount" step="any"/>
        <button type="submit">Add Debit</button>
      </form>
      
      <AccountBalance accountBalance={props.accountBalance}/>
      <br/>
      <Link to="/">Return to Home</Link>
    </div>
  );
}

export default Debits;