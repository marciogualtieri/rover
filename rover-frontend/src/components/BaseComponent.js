import React, { Component } from "react";

export default class BaseComponent extends Component {
  setStateMessage(text, isErrorMessage, handler) {
    var state = this.state;
    state.message = text
      ? {
          text: text,
          isErrorMessage: isErrorMessage
        }
      : null;
    this.setState(state, handler);
  }

  fetchData(url, requestOptions, expectedStatus, dataHandler, errorHandler) {
    fetch(url, requestOptions)
      .then(response => {
        return response
          .text()
          .then(data => ({ body: data, status: response.status }));
      })
      .then(data => {
        if (data.status == expectedStatus) {
          dataHandler(data);
        } else {
          this.setStateMessage(`Request Error: ${data.body}`, true);
        }
      })
      .catch(error => {
        if (error) {
          errorHandler(error);
        }
      });
  }

  getAuthorization() {
    var auth = sessionStorage.getItem("auth");
    if (auth) {
      return JSON.parse(auth);
    }
    return null;
  }
}
