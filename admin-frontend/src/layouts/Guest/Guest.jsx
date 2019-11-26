import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import GuestHeader from "../../views/GuestHeader/GuestHeader";
import GuestHome from "../../views/GuestHome/GuestHome";
import Login from "../../views/Login/Login";
import Signup from "../../views/Signup/Signup";
import NotFound from "../../views/NotFound/NotFound";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-default.css";
import "react-s-alert/dist/s-alert-css-effects/slide.css";
import "./Guest.css";
import OAuth2RedirectHandler from "../../utils/OAuth2RedirectHandler";
const Guest = props => {
  const updateUser = props.updateUser;

  return (
    <div className="app">
      <div className="app-top-box">
        <GuestHeader />
      </div>
      <div className="app-body">
        <Switch>
          <Route exact path="/" component={GuestHome}></Route>
          <Route
            path="/login"
            render={props => <Login {...props} updateUser={updateUser} />}
          />
          <Route path="/register" component={Signup} />
          <Route path="/oauth2" component={OAuth2RedirectHandler}></Route>
          <Route component={NotFound}></Route>
        </Switch>
      </div>
      <Alert
        stack={{ limit: 3 }}
        timeout={3000}
        position="top-right"
        effect="slide"
        offset={65}
      />
    </div>
  );
};

export default Guest;
