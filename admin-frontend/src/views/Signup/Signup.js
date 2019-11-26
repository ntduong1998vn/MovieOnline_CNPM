import React, { Component } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import {
  GOOGLE_AUTH_URL,
  FACEBOOK_AUTH_URL,
  GITHUB_AUTH_URL,
  API_BASE_URL

} from "../../constants/auth";
import fbLogo from "../../assets/img/fb-logo.png";
import googleLogo from "../../assets/img/google-logo.png";
import githubLogo from "../../assets/img/github-logo.png";
import Alert from "react-s-alert";
import axios from "axios"

class Signup extends Component {
  render() {
    return (
      <div className="signup-container">
        <div className="signup-content">
          <h1 className="signup-title">Signup with SpringSocial</h1>
          <SocialSignup />
          <div className="or-separator">
            <span className="or-text">OR</span>
          </div>
          <SignupForm {...this.props} />
          <span className="login-link">
            Already have an account? <Link to="/login">Login!</Link>
          </span>
        </div>
      </div>
    );
  }
}

class SocialSignup extends Component {
  render() {
    return (
      <div className="social-signup">
        <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
          <img src={googleLogo} alt="Google" /> Sign up with Google
        </a>
        <a
          className="btn btn-block social-btn facebook"
          href={FACEBOOK_AUTH_URL}
        >
          <img src={fbLogo} alt="Facebook" /> Sign up with Facebook
        </a>
        <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
          <img src={githubLogo} alt="Github" /> Sign up with Github
        </a>
      </div>
    );
  }
}

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      errors: {}
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      provider: "local"
    };
    //request to server to add a new username/password

    axios
      .post(API_BASE_URL + "/authenticate/register", newUser)
      .then(res => this.props.history.push("/login")) // re-direct to login on successful register
      .catch(err => {
        this.setState({ errors: err.response.data })
        Alert.error(err.response.data, { timeout: 5000 })
        console.log(err.response.data);
      })
  }

  render() {
    const { errors } = this.state;

    return (
      <form noValidate onSubmit={this.handleSubmit}>
        <div className="form-item">
          <input
            type="text"
            name="name"
            error={errors.name}
            className="form-control"
            placeholder="Name"
            value={this.state.name}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="form-item">
          <input
            error={errors.email}
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={this.state.email}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="form-item">
          <input
            error={errors.password}
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={this.state.password}
            onChange={this.handleInputChange}
            required
          />
        </div>
        <div className="form-item">
          <button type="submit" className="btn btn-block btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    );
  }
}

export default Signup;
