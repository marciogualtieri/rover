import React from "react";
import { Link } from "react-router-dom";
import config from "react-global-configuration";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSyncAlt,
  faArrowLeft,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import RankingsTable from "./RankingsTable";
import MessageBar from "./MessageBar";
import BaseComponent from "./BaseComponent";
import "../App.css";

class RankingsPage extends BaseComponent {
  constructor(props) {
    super(props);

    var auth = this.getAuthorization();
    var token = null;
    if (auth) {
      token = auth.token;
    }

    this.state = {
      token: token,
      data: [],
      message: null,
      cutoff: 0.0,
      limit: config.get("maxPageSize"),
      page: {
        next: null,
        current: null,
        previous: null,
        count: null
      }
    };
  }

  cutoffChangeHandler = event => {
    this.setState({ cutoff: event.target.value });
  };

  nextClickHandler = event => {
    console.log(this.state);
    if (this.state.page.next != null) {
      this.setStatePage({ current: this.state.page.next });
      this.fetchRankings();
    }
  };

  previousClickHandler = event => {
    if (this.state.page.previous != null) {
      this.setStatePage({ current: this.state.page.previous });
      this.fetchRankings();
    }
  };

  refreshClickHandler = event => {
    this.setStatePage({ current: null });
    this.fetchRankings();
  };

  setStatePage(page) {
    this.setState({ page: Object.assign(this.state.page, page) });
  }

  buildFetchURL() {
    var url = new URL(`${config.get("apiUrl")}/scores/`);
    var params = { limit: this.state.limit };
    if (this.state.cutoff > 0) {
      params.cutoff = this.state.cutoff;
    }
    url.search = new URLSearchParams(params).toString();
    return url;
  }

  fetchDataHandler(data) {
    var body = JSON.parse(data.body);
    this.setState({ data: body.results });
    this.setStatePage({
      next: body.next,
      previous: body.previous,
      current: this.state.page.current,
      count: body.count
    });
  }

  fetchErrorHandler(error) {
    this.setStateMessage(`Error fetching rankings: ${error.message}`, true);
  }

  fetchRankings(handler) {
    var url = this.buildFetchURL();
    if (this.state.page.current == null) {
      this.setStatePage({ current: url.toString() });
    } else {
      url = new URL(this.state.page.current);
    }

    const requestOptions = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${this.state.token}`
      }
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
    if (this.state.token) {
      this.fetchRankings();
    } else {
      this.props.history.push("/sign-in");
    }
  }

  render() {
    return (
      this.state && (
        <div className="container pt-5">
          <div className="d-flex flex-row pt-5">
            <div className="form-group">
              <label>Rating Cut-off</label>
              <input
                type="range"
                min="0.0"
                max="5.0"
                step="0.1"
                value={this.state.cutoff}
                className="form-control-range"
                onChange={this.cutoffChangeHandler}
              />
              <label>{this.state.cutoff}</label>
            </div>

            <div className="p-4">
              <FontAwesomeIcon
                icon={faSyncAlt}
                size="lg"
                color="blue"
                onClick={this.refreshClickHandler}
              />
            </div>
          </div>

          <div className="d-flex flex-row pt-5">
            <button onClick={this.previousClickHandler}>Previous</button>
            <button onClick={this.nextClickHandler}>Next</button>
          </div>

          <div className="d-flex flex-row">
            <RankingsTable data={this.state.data} />
          </div>

          <div className="d-flex flex-row">
            <MessageBar message={this.state.message} />
          </div>
        </div>
      )
    );
  }
}

export default RankingsPage;
