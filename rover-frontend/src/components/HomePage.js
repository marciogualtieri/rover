import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class HomePage extends Component {
  render() {
    return (
      <div className="row h-100 justify-content-center align-items-center">
        <div className="d-flex flex-column pt-5">
          <h3>Welcome to Rover.com!</h3>
          <p>
            See the <Link to="rankings">current rankings.</Link>
          </p>
        </div>
      </div>
    );
  }
}
