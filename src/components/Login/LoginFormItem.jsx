import React from 'react';

export class LoginFormItem extends React.Component {
  static defaultProps = {
    inputProps: {},
  }

  render() {
    const {
      id,
      label,
      type,
      block,
      inputProps,
      options
    } = this.props;
    return <div className={`${block}__item htv__form-item`}>
      <label className={`${block}__label htv__form-label`} htmlFor={`${id}`}>{ label }</label>
      {
        type === "select"?
        <select id={id} className={`${block}__select htv__form-select`} {...inputProps}>
          { options.map(({ value, text }, key) => <option value={value}>{ text }</option>) }
        </select>:
        <input id={id} type={type ? type : "text"} className={`${block}__input htv__form-input`} {...inputProps} />
      }
    </div>
  }
}
