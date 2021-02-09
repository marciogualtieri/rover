import React from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter
} from "react-router-dom";
import "./index.css";
import App from "./App";
import config from 'react-global-configuration';

config.set({
  apiUrl: 'http://127.0.0.1:8000/reviews/v1',
  authUrl: 'http://127.0.0.1:8000/rest-auth',
  maxPageSize: 10
});

ReactDOM.render( <
  BrowserRouter >
  <
  App / >
  <
  /BrowserRouter>,
  document.getElementById("root")
);
