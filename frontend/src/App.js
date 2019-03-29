import React, { Component } from 'react';
import Dashboard from './Dashboard';
import Ships from './Ships';
import { BrowserRouter as Router, Route } from "react-router-dom";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Route path="/" exact  component={Dashboard} />
          <Route path="/ships" exact  component={Ships} />
        </Router>
      </div>
    );
  }
}

export default App;
