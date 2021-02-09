import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Logout from "./components/Logout";
import SignUp from "./components/SignUp";
import ResetPassword from "./components/ResetPassword";
import RankingsPage from "./components/RankingsPage";
import HomePage from "./components/HomePage";
import ConfirmationPage from "./components/ConfirmationPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="container-fluid">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={"/"}>
              Rover.com
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-in"}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={"/sign-up"}>
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/sign-in" component={Login} />
          <Route path="/sign-out" component={Logout} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/rankings" component={RankingsPage} />
          <Route exact path="/confirmation" component={ConfirmationPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
