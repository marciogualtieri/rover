import React from "react";
import config from "react-global-configuration";
import BaseComponent from "./BaseComponent";
import MessageBar from "./MessageBar";
import "../App.css";

export default class Login extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      email: null,
      password: null,
      token: null
    };
  }

  fetchDataHandler(data) {
    var auth = JSON.parse(data.body);

    sessionStorage.setItem(
      "auth",
      JSON.stringify({
        token: auth.key,
        email: this.state.email
      })
    );
    this.props.history.push("/");
  }

  fetchErrorHandler(error) {
    this.setStateMessage(`Error logging-in: ${error.message}`, true);
  }

  submitHandler = event => {
    event.preventDefault();
    this.setStateMessage(null);
    var url = `${config.get("authUrl")}/login/`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password
      })
    };

    this.fetchData(
      url,
      requestOptions,
      200,
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

  passwordChangeHandler = event => {
    this.setState({ password: event.target.value });
  };

  componentDidMount() {
    var auth = this.getAuthorization();
    if (auth) {
      this.setState({ token: auth.token });
    }
  }

  render() {
    if (this.state.token != null) {
      return (
        <div className="row justify-content-center p-5">
          <h3 className="forgot-password text-right">
            You are Logged-in. <a href="sign-out">Logout?</a>
          </h3>
        </div>
      );
    }
    return (
      <div className="d-flex flex-column justify-content-left p-5">
        <div className="container-login">
          <form onSubmit={this.submitHandler}>
            <h3>Sign In</h3>

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
                onChange={this.passwordChangeHandler}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              Submit
            </button>
            <p className="forgot-password text-right">
              Forgot <a href="reset-password">password?</a>
            </p>
          </form>
        </div>
        <MessageBar message={this.state.message} />
      </div>
    );
  }
}
