import React, { Component } from "react";

function MessageBar(props) {
  return (
    props.message && (
      <div
        className={
          props.message.isErrorMessage
            ? "alert alert-danger"
            : "alert alert-success"
        }
      >
        {props.message.text}
      </div>
    )
  );
}

export default MessageBar;
