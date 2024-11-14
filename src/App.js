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
      totalCredits: 0,
      totalDebits: 0,
      currentUser: {
        userName: 'Joe Smith',
        memberSince: '11/22/99',
      }
    };
  }
  
  componentDidMount()
  {
  var creditSum = 0;
  var debitSum = 0;
  fetch('https://johnnylaicode.github.io/api/credits.json')
      .then(response => response.json())
      .then
      (credits =>
          {
              creditSum = credits.reduce((total, individualCredit) => total + individualCredit.amount, 0);
              fetch('https://johnnylaicode.github.io/api/debits.json')
              .then(response => response.json())
              .then
              (debits =>
                  {
                      debitSum = debits.reduce((total, individualDebit) => total + individualDebit.amount, 0);
                      this.setState
                      ({
                          creditList: credits,
                          debitList: debits,
                          totalCredits: creditSum,
                          totalDebits: debitSum,
                          accountBalance: creditSum - debitSum
                          
                      })
                  }
              )
          },
      )
  }

    addCredit = (credit_event) =>
    {
        credit_event.preventDefault();
        let description = credit_event.target.description.value;
        let amount = parseFloat(credit_event.target.amount.value);
        let id = this.state.creditList.length;
        let date = new Date().toJSON();
  
        let newCredit =
        {
            id: id,
            amount: amount,
            description: description,
            date: date
        }
        let newCredits = [...this.state.creditList, newCredit];

    
        this.setState(prevState => 
        ({
            creditList: newCredits,
            accountBalance: prevState.accountBalance + amount
        }))
    }

    addDebit = (debit_event) =>
    {
        debit_event.preventDefault();
        let description = debit_event.target.description.value;
        let amount = parseFloat(debit_event.target.amount.value);
        let id = this.state.debitList.length;
        let date = new Date().toJSON();
    
        let newDebit =
        {
            id: id,
            amount: amount,
            description: description,
            date: date
        }
        let newDebits = [...this.state.debitList, newDebit];

    
        this.setState(prevState => 
        ({
            debitList: newDebits,
            accountBalance: prevState.accountBalance - amount
        }))
    }

  // Update state's currentUser (userName) after "Log In" button is clicked
  mockLogIn = (logInInfo) => {  
    const newUser = {...this.state.currentUser};
    newUser.userName = logInInfo.userName;
    this.setState({currentUser: newUser})
  }

  // Create Routes and React elements to be rendered using React components
  render() {  
    // Create React elements and pass input props to components
    const HomeComponent = () => (<Home accountBalance={this.state.accountBalance} />)
    const UserProfileComponent = () => (
      <UserProfile userName={this.state.currentUser.userName} memberSince={this.state.currentUser.memberSince} />
    )
    const LogInComponent = () => (<LogIn user={this.state.currentUser} mockLogIn={this.mockLogIn} />)
    const CreditsComponent = () => (<Credits credits={this.state.creditList} addCredit={this.addCredit} accountBalance={this.state.accountBalance} />) 
    const DebitsComponent = () => (<Debits debits={this.state.debitList} addDebit={this.addDebit} accountBalance={this.state.accountBalance} />) 

    // Important: Include the "basename" in Router, which is needed for deploying the React app to GitHub Pages
    return (
      <Router basename="/bank-of-react-starter-code">
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