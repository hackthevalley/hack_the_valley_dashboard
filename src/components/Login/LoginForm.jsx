import React from 'react';
import { ErrorCodes } from '../ErrorCodes';
import { LoginFormItem } from './';
import {connect} from "react-redux";
import "../../scss/components/buttons/buttons.scss";

class _LoginForm extends React.Component {
  render() {
    const {
      block,
      button,
      items,
      errorCodes,
      onSubmit
    } = this.props;
    return <form
      className={`${block}__form`}
      onSubmit={onSubmit}
    >
      {
        items.map((props, key) =>
          <LoginFormItem key={ key } block={block} { ...props }/>
        )
      }
      <button className={'button button--primary'} type="submit" disabled={this.props.fetching || this.props.loading}>
        { this.props.fetching || this.props.loading ? <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> : button }
      </button>
      <br/><br/>
      <ErrorCodes errorCodes={errorCodes} />
    </form>
  }
}

export const LoginForm = connect((state) => ({
    fetching: state.fetch.fetching
}))(_LoginForm);
