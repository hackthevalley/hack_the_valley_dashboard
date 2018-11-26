import React from 'react';
import {ApplicationFormTextField} from './ApplicationFormTextField';
import {ApplicationFormTextAreaField} from './ApplicationFormTextAreaField';
import {ApplicationFormCheckboxField} from './ApplicationFormCheckboxField';
import {ApplicationFormSelectField} from './ApplicationFormSelectField';
import '../../scss/components/applicationform/applicationform.scss';


const questionTypeToComponent = {
  email: ApplicationFormTextField,
  date: ApplicationFormTextField,
  short: ApplicationFormTextField,
  long: ApplicationFormTextAreaField,
  radio: ApplicationFormSelectField,
  checkbox: ApplicationFormCheckboxField,
  choice: ApplicationFormSelectField,
};

const questionTypeToComponentProps = {
  email: (question) => ({
    name: question._id,
    // required: question.required,
    type: 'email',
    defaultValue: question.answers && question.answers[0],
  }),

  date: (question) => ({
    name: question._id,
    // required: question.required,
    type: 'date',
    defaultValue: question.answers && question.answers[0],
  }),

  short: (question) => ({
    name: question._id,
    // required: question.required,
    type: 'text',
    maxLength: question.max_characters,
    defaultValue: question.answers && question.answers[0],
  }),

  long: (question) => ({
    name: question._id,
    // required: question.required,
    rows: 5,
    maxLength: question.max_characters,
    defaultValue: question.answers && question.answers[0],
  }),

  radio: (question) => ({
    name: question._id,
    // required: question.required,
    type: 'radio',
    options: question.choices,
    defaultValue: question.answers && question.answers[0],
  }),

  checkbox: (question) => ({
    name: question._id,
    // required: question.required,
    type: 'checkbox',
    defaultChecked: question.answers && question.answers[0] === 'Yes',
  }),

  choice: (question) => ({
    name: question._id,
    // required: question.required,
    options: question.choices,
    defaultValue: question.answers && question.answers[0],
  }),
};

export function ApplicationFormField(props) {
  const FieldComponent = questionTypeToComponent[props.question_type];
  const fieldProps = questionTypeToComponentProps[props.question_type](props);
  return (
    <div className="applicationform__container">
      <strong>{props.name}{props.required && '*'}</strong>
      {props.description ? <small>{props.description}</small> : null}
      <FieldComponent {...fieldProps} onChange={props.onChange} />
    </div>
  );
}
