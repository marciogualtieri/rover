import React from "react";
import config from "react-global-configuration";
import BaseComponent from "./BaseComponent";
import MessageBar from "./MessageBar";
import "../App.css";

export default class ResetPassword extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      email: null
    };
  }

  fetchDataHandler(data) {
    this.props.history.push("/confirmation");
  }

  fetchErrorHandler(error) {
    this.setStateMessage(`Error resetting password: ${error.message}`, true);
  }

  submitHandler = event => {
    event.preventDefault();
    var url = `${config.get("authUrl")}/password/reset/`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: this.state.email
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

  render() {
    return (
      <div className="d-flex flex-column justify-content-left p-5">
        <div className="container-login">
          <form>
            <h3>Reset Password</h3>

            <div className="form-group">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                onChange={this.emailChangeHandler}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={this.submitHandler}
            >
              Submit
            </button>
          </form>
        </div>
        <MessageBar message={this.state.message} />
      </div>
    );
  }
}
