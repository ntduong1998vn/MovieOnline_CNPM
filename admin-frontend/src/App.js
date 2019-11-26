import React, { Component } from "react";
import { Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin";
import GuestLayout from "layouts/Guest/Guest";
import PrivateRoute from "./components/Common/PrivateRoute";
import PublicRoute from "./components/Common/PublicRoute";
import { getCurrentUser } from "utils/AuthAPI";
import { ACCESS_TOKEN, API_BASE_URL } from "constants/auth";
import LoadingIndicator from "components/Common/LoadingIndicator";
import axios from 'axios';
import queryString from "query-string"


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      currentUser: {},
      loading: false
    };

    // this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.updateUser = this.updateUser.bind(this);
  }

  loadCurrentlyLoggedInUser() {
    this.setState({
      loading: true
    });

    axios.get(API_BASE_URL + "/authenticate/")
      .then(response => {
        console.log("Response CurrentUser : ", response);
        if (response.data.user != null)
          this.setState({
            currentUser: response,
            authenticated: true,
            loading: false
          });
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log("Not login : ", error);
        this.setState({
          loading: false
        });
      });
  }

  updateUser(username) {
    console.log("Call UpdateUser");
    this.setState({
      currentUser: username,
      authenticated: true
    })
  }

  handleLogout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.setState({
      authenticated: false,
      currentUser: null
    });
    // this.forceUpdate();
  }

  componentDidMount() {
    // this.loadCurrentlyLoggedInUser();
    // const query = queryString.parse(this.props.location.search);
    // if (query.token) {
    //   window.localStorage.setItem(ACCESS_TOKEN, query.token);
    //   this.props.history.push("/");
    // }
    if (localStorage.getItem(ACCESS_TOKEN) != null)
      this.setState({ authenticated: true })
  }

  render() {
    const { authenticated, loading } = this.state;
    if (loading) {
      return <LoadingIndicator />;
    }
    return (
      <Switch>
        <PrivateRoute
          path="/admin"
          authenticated={authenticated}
          component={AdminLayout}
          onLogout={this.handleLogout}
        />
        <PublicRoute
          path="/"
          restricted={true}
          authenticated={authenticated}
          component={GuestLayout}
          updateUser={this.updateUser}
        />
        {/* <Redirect from="/" to="/welcome" /> */}
      </Switch>
    );
  }
}

export default App;
