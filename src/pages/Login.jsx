import React from 'react';
import { connect } from 'react-redux';
import '../scss/pages/login.scss';
import { LoginForm } from '../components';
import { createHackerTokenAction, createHackerAction } from '../redux/actions';
import { IsNotLoggedIn } from '../containers';

const LOGIN_ITEMS = [
  {
    id: "login__email", label: "Email", type: "email",
    inputProps: {
      name: 'email_address',
      required: true,
      autoComplete: "email",
    },
  },
  {
    id: "login__password", label: "Password", type: "password",
    inputProps: {
      name: 'password',
      required: true,
      autoComplete: "current-password",
    },
  },
];

const REG_ITEMS = [
  {
    id: "reg__email", label: "Email", type: "email",
    inputProps: {
      name: 'email_address',
      required: true,
      autoComplete: "email",
    },
  },
  {
    id: "reg__password", label: "Password", type: "password",
    inputProps: {
      name: 'password',
      required: true,
      autoComplete: "new-password",
    },
  },
  {
    id: "reg__confrim", label: "Confirm Password", type: "password",
    inputProps: {
      name: 'confirm',
      required: true,
      autoComplete: "new-password",
    },
  }
]

class _Login extends React.Component {
  state = {
    loginErrorCodes: false,
    registerErrorCodes: false,
  }

  handleLogin = async (event) => {
    const { dispatch } = this.props;
    event.preventDefault();
    const formData = new FormData(event.target);
    const email_address = formData.get('email_address');
    const password = formData.get('password');
    this.setState({
      loginErrorCodes: false,
    });
    const action = await dispatch(createHackerTokenAction(email_address, password));
    if (action[0].error) {
      this.setState({
        loginErrorCodes: action[0].error.errorCodes,
      });
      return;
    }
  }

  handleRegister = async (event) => {
    const { dispatch } = this.props;
    event.preventDefault();
    const formData = new FormData(event.target);
    const email_address = formData.get('email_address');
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    if (password !== confirm) {
      this.setState({
        registerErrorCodes: ['PasswordDoesNotMatch'],
      });
      return;
    }
    this.setState({
      registerErrorCodes: false,
    });
    const action = await dispatch(createHackerAction(email_address, password));
    if (action[0].error) {
      this.setState({
        registerErrorCodes: action[0].error.errorCodes,
      });
      return;
    }
  }

  render() {
    const {
      loginErrorCodes,
      registerErrorCodes,
    } = this.state;
    return (
      <IsNotLoggedIn>
        <main className="login">
          <section className="login__section login__section--login">
              <img src={require('../assets/logo.png')} alt={"logo"} width={70} />
            <div className="login__head">
              <h1 className="login__header">Hack The Valley</h1>
              <span className="login__subheader">Hacker Dashboard</span>
            </div>
            <h2 className="login__form-header">Login</h2>
            <LoginForm
              block="login"
              button="Login"
              items={LOGIN_ITEMS}
              onSubmit={this.handleLogin}
              errorCodes={loginErrorCodes}
            />
          </section>
          <section className="login__section login__section--register">
            <h2 className="login__form-header">Register</h2>
            <div className="login__wrapper--register">
              <h3 className="login__form-subheader">First Time Applying? Let's Get Started!</h3>
              <p className="login__form-text">An account helps you keep track of your applications.</p>
            </div>
            <LoginForm
              block="login"
              button="Next Steps"
              items={REG_ITEMS}
              onSubmit={this.handleRegister}
              errorCodes={registerErrorCodes}
            />
          </section>
        </main>
      </IsNotLoggedIn>
    );
  }
}

export const Login = connect()(_Login);
