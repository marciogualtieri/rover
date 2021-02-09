import React from "react";
import config from "react-global-configuration";
import MessageBar from "./MessageBar";
import BaseComponent from "./BaseComponent";
import "../App.css";

export default class SignUp extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      email: null,
      password1: null,
      password2: null
    };
  }

  fetchDataHandler(data) {
    this.props.history.push("/confirmation");
  }

  fetchErrorHandler(error) {
    this.setStateMessage(`Error signing-up: ${error.message}`, true);
  }

  submitHandler = event => {
    event.preventDefault();
    var url = `${config.get("authUrl")}/registration/`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password1: this.state.password1,
        password2: this.state.password2
      })
    };

    this.fetchData(
      url,
      requestOptions,
      201,
      data => {
        this.fetchDataHandler(data);
      },
      error => {
        this.fetchErrorHandler(error);
      }
    );
  };

  emailChangeHandler = event => {
    this.setState({ email: event.target.value });
  };

  password1ChangeHandler = event => {
    this.setState({ password1: event.target.value });
  };

  password2ChangeHandler = event => {
    this.setState({ password2: event.target.value });
  };

  render() {
    return (
      <div className="d-flex flex-column justify-content-left p-5">
        <div className="container-login">
          <form>
            <h3>Sign Up</h3>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={this.emailChangeHandler}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={this.password1ChangeHandler}
              />
            </div>

            <div className="form-group">
              <label>Repeat Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                onChange={this.password2ChangeHandler}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.submitHandler}
            >
              Sign Up
            </button>
            <p className="forgot-password text-right">
              Already registered <a href="sign-in">sign in?</a>
            </p>
          </form>
        </div>
        <MessageBar message={this.state.message} />
      </div>
    );
  }
}
