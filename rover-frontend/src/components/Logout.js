import React from "react";
import config from "react-global-configuration";
import BaseComponent from "./BaseComponent";
import MessageBar from "./MessageBar";
import "../App.css";

export default class Logout extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = {
      message: null
    };
  }

  fetchDataHandler(data) {
    sessionStorage.removeItem("auth");
    this.props.history.push("/");
  }

  fetchErrorHandler(error) {
    this.setStateMessage(`Error logging-out: ${error.message}`, true);
  }

  logout() {
    var url = `${config.get("authUrl")}/logout/`;

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" }
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
  }

  componentDidMount() {
    this.logout();
  }

  render() {
    return (
      <div className="row h-100 justify-content-left align-items-center p-5">
        <MessageBar message={this.state.message} />
      </div>
    );
  }
}
