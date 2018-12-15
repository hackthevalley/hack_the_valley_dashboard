/*
 * Copyright (c) Hack the Valley All Rights Reserved.
 * License granted under MIT.
 * Author(s):
 *  Jun Zheng - me at jackzh dot com
 *  Fredric Pun
 *  Omar Chehab
 */

import React from 'react';
import {connect} from 'react-redux';
import '../scss/pages/login.scss';
import {DelayedLink, LoginForm} from '../components';
import {IsNotLoggedIn} from '../containers';
import htv from "htv-sdk";
import extractError from "../helpers/extractError";

const SEND_ITEMS = [
  {
    id: "reset__email", label: "Email", type: "email",
    inputProps: {
      name: 'email_address',
      required: true,
      autoComplete: "email",
    },
  }
];

const RESET_ITEMS = [
  {
    id: "reset__code", label: "Reset Code", type: "text",
    inputProps: {
      name: 'code',
      required: true
    },
  },
  {
    id: "reset__password", label: "New Password", type: "password",
    inputProps: {
      name: 'password',
      required: true
    },
  }
];

class _Login extends React.Component {

  constructor(props) {
    super(props);
    // This page makes no sense to use Redux, since all states are only used locally, and we wish to reset state after
    // user navigates away.
    this.state = {
      sendErrorCodes: false,
      resetErrorCodes: false,
      emailAddress: "",
      loading: false,
      emailSent: false
    }
  }

  /**
   * Send reset code to hacker's email address
   * @param event
   * @returns {Promise<void>}
   */
  handleSendResetCode = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email_address = formData.get('email_address');
    this.setState({sendErrorCodes: false, loading: true, emailAddress: email_address});
    try {
      await htv.Hacker.sendPasswordResetEmail(email_address);
      window.alert("We sent a reset code to your email address. Check your spam box if you did not receive it.");
      this.setState({emailSent: true});
    } catch (err) {
      this.setState({sendErrorCodes: extractError(err)});
    }
    this.setState({loading: false});
  };

  /**
   * Reset hacker's password
   * @param event
   * @returns {Promise<void>}
   */
  handleResetPassword = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email_address = this.state.emailAddress;
    const code = formData.get('code');
    const new_password = formData.get('password');
    this.setState({resetErrorCodes: false, loading: true});
    try {
      await htv.Hacker.resetPassword(email_address, code, new_password);
      window.alert("Password updated.");
      this.props.history.push("/");
    } catch (err) {
      this.setState({resetErrorCodes: extractError(err)});
    }
    this.setState({loading: false});
  };

  render() {
    const {
      sendErrorCodes,
      resetErrorCodes
    } = this.state;
    return (
      <IsNotLoggedIn>
        <main className="login">
          <section className="login__section login__section--login">
            <img src={require('../assets/logo.png')} alt={"logo"} width={70}/>
            <div className="login__head">
              <h1 className="login__header">Hack The Valley</h1>
              <span className="login__subheader">Hacker Dashboard</span>
            </div>
            <h2 className="login__form-header">Reset Password</h2>
            {this.state.emailSent ? (
              <LoginForm
                block="login"
                button="Update Password"
                items={RESET_ITEMS}
                loading={this.state.loading}
                onSubmit={this.handleResetPassword}
                errorCodes={resetErrorCodes}
              />
            ): (
              <LoginForm
                block="login"
                button="Send Reset Code"
                items={SEND_ITEMS}
                loading={this.state.loading}
                onSubmit={this.handleSendResetCode}
                errorCodes={sendErrorCodes}
              />
            )}
            <DelayedLink className={"button button--light"} to={"/login"}>Back to Login</DelayedLink>
          </section>
        </main>
      </IsNotLoggedIn>
    );
  }
}

export const ForgotPassword = connect()(_Login);
