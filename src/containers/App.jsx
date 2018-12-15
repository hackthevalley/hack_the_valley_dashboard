import React, { Component} from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import localforage from 'localforage';
import * as Pages from './../pages';
import { Dashboard } from '.';
import '../scss/containers/app.scss';
import { setSessionAction } from '../redux/actions';
import { selectSession } from '../selectors';

const ROUTES = [
  { path: "/home", component: Pages.Home },
  { path: "/profile", component: Pages.Profile },
  { path: "/app", component: Pages.Application },
  { path: "/app/:id", component: Pages.ApplicationForm },
  { path: "/faq", component: Pages.Faq },
  { path: "/contact", component: Pages.Contact }
];

class _App extends Component {
  componentDidMount() {
    this.rehydrateSession();
  }

  rehydrateSession = async () => {
    const {
      dispatch,
    } = this.props;
    const [
      email_address,
      token_body,
    ] = await Promise.all([
      localforage.getItem('email_address'),
      localforage.getItem('token_body'),
    ]);
    dispatch(setSessionAction(email_address, token_body));
  }

  render() {
    const { session } = this.props;
    if (!session.rehydrated) {
      return null;
    }
    return (
      <Switch>
        <Route exact path="/" component={Pages.Login}/>
        <Route exact path="/forgotpassword" component={Pages.ForgotPassword}/>
        <Dashboard>
          <Switch>
            { ROUTES.map((props, key) => <Route exact key={key} { ...props }/>) }
          </Switch>
        </Dashboard>
      </Switch>
    );
  }
}

export const App = withRouter(connect((state) => ({
  session: selectSession(state),
}))(_App))
