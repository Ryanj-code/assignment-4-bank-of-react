/*==================================================
src/App.js

This is the top-level component of the app.
It contains the top-level state.
==================================================*/
import React, {Component} from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// Import other components
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import LogIn from './components/Login';
import Credits from './components/Credits';
import Debits from './components/Debits';

class App extends Component {
  constructor() {  // Create and initialize state
    super(); 
    this.state = {
      accountBalance: 0,
      creditList: [],
      debitList: [],
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  calculateBalance = () => {
    const creditAmount = this.state.creditList.map(obj => obj.amount);
    const creditTotal = Number(creditAmount.reduce((total, amount) => total + amount, 0));

    const debitAmount = this.state.debitList.map(obj => obj.amount);
    const debitTotal = Number(debitAmount.reduce((total, amount) => total + amount, 0));

    // console.log(this.state.accountBalance);
    this.setState({accountBalance: Number(creditTotal - debitTotal)});
    // console.log(this.state.accountBalance);
  }

  // Add new credit item into creditList based on the submitted info
  addCredit = (description, amount) => {
    const newCredit = {
      id: this.state.creditList.length + 1,
      description,
      amount,
      date: new Date().toISOString(),
    };

    // const newList = [...this.state.creditList, newCredit];
    // this.setState({creditList: newList});
    // console.log(newList);
    
    this.state.creditList.push(newCredit);
    // console.log(this.state.creditList);
     
    this.calculateBalance();
  }

  // Add new debit item into debitList based on the submitted info
  addDebit = (description, amount) => {
    const newDebit = {
      id: this.state.debitList.length + 1,
      description,
      amount,
      date: new Date().toISOString(),
    };

    // let newList = [...this.state.debitList, newDebit];
    // this.setState({debitList: newList});
    // console.log(newList);

    this.state.debitList.push(newDebit);
    // console.log(this.state.debitList);
    this.calculateBalance();
  }

  // Lifecycle method to make API requests to retrieve credit and debit data from two different APIs
  // then calculate the total credit and debit amounts, which is used to calculate the account balance.
  async componentDidMount() {
    let linktoDebitAPI = 'https://johnnylaicode.github.io/api/credits.json';
    let linktoCreditAPI = 'https://johnnylaicode.github.io/api/debits.json';

    try {
      let response = await fetch(linktoDebitAPI);
      if(response.ok) {
        let data = await response.json();
        console.log(data);
        this.setState({debitList: data});
      } else {
          console.log('Response error:', response.status);
      }
    } catch (error) {
        console.log('Fetch error:', error.message);
    }

    // const debitAmount = this.state.debitList.map(obj => obj.amount);
    // const debitTotal = Number(debitAmount.reduce((total, amount) => total + amount, 0).toFixed(2));
    // console.log(debitTotal);

    try {
      let response = await fetch(linktoCreditAPI);
      if(response.ok) {
        let data = await response.json();
        console.log(data);
        this.setState({creditList: data});
      } else {
          console.log('Response error:', response.status);
      }
    } catch (error) {
        console.log('Fetch error:', error.message);
    }

    // const creditAmount = this.state.creditList.map(obj => obj.amount);
    // const creditTotal = Number(creditAmount.reduce((total, amount) => total + amount, 0).toFixed(2));
    this.calculateBalance();
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} />) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit}/>) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/assignment-4-bank-of-react">
        <div>
          <Route exact path="/" render={HomeComponent}/>
          <Route exact path="/userProfile" render={UserProfileComponent}/>
          <Route exact path="/login" render={LogInComponent}/>
          <Route exact path="/credits" render={CreditsComponent}/>
          <Route exact path="/debits" render={DebitsComponent}/>
        </div>
      </Router>
    );
  }
}

export default App;