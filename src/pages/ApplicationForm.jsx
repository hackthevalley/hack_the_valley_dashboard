import React, {Component, Fragment} from 'react';
import {connect} from "react-redux";
import {ApplicationFormField} from '../components';
import {
  getApplicationsAction,
  getEventsAction,
  getMeAction,
  createHackerApplicationAction,
  updateHackerApplicationQuestionAction, submitHackerApplicationAction
} from "../redux/actions";
import '../scss/pages/application.scss';
import {
  selectApplicationForm,
  selectHackersMe,
  selectMyApplicationQuestionsHashMap,
  selectApplicationFormQuestionsHashMap
} from '../selectors';
import {BackButton} from "../components/Navigations";

async function chain(arr, fn) {
  const result = []
  for (let i = 0; i < arr.length; i++) {
    result.push(await fn(arr[i], i, arr));
  }
  return result;
}

function transformAnswer(question, answer) {
  if (question.question_type === 'checkbox') {
    return [{
      on: 'Yes',
      off: 'No',
    }[answer[0]]];
  }
  return answer;
}

class _ApplicationForm extends Component {
  state = {
    questionErrorCodes: {},
    questionSaved: {},
    canSubmit: false,
    changed: true
  };

  componentDidMount() {
    const {dispatch} = this.props;
    dispatch(getMeAction());
    dispatch(getEventsAction());
    dispatch(getApplicationsAction());
  }

  handleSave = async (event) => {
    const {
      dispatch,
      me,
      application,
      applicationQuestionsById
    } = this.props;
    this.setState({
      questionErrorCodes: {},
      questionSaved: {},
    });
    event.preventDefault();

    const formData = new FormData(event.target);
    const answers = application.questions
      .reduce((res, question) => ({
        ...res,
        [question._id]: formData.getAll(question._id),
      }), {});

    const hackerApplication = me.applications.find(
      hackerApp => hackerApp.application._id === application._id);
    let hackerApplicationId = hackerApplication && hackerApplication._id;

    if (!hackerApplication) {
      const [action] = await dispatch(createHackerApplicationAction(application._id));
      hackerApplicationId = action.application._id;
    }

    const questionIds = Object.keys(answers);
    // const updateQuestionActions = await Promise.all(questionIds.map(
    const updateQuestionActions = await chain(questionIds,
      (questionId) => dispatch(updateHackerApplicationQuestionAction(
        hackerApplicationId,
        questionId,
        transformAnswer(applicationQuestionsById[questionId], answers[questionId])
      ))
    );
    const questionErrorCodes = updateQuestionActions.reduce((res, [action], i) => ({
      ...res,
      [questionIds[i]]: action.error && action.error.errorCodes,
    }), {});

    let canSubmit = true;
    for (let i = 0; i < application.questions.length; i++) {
      if (application.questions[i].required) {
        if (!answers[application.questions[i]._id][0]) {
          canSubmit = false;
          break;
        }
      }
    }

    this.setState({
      questionErrorCodes,
      canSubmit,
      changed: false,
      questionSaved: Object.keys(questionErrorCodes)
        .reduce((res, question_id) => ({
          ...res,
          [question_id]: !questionErrorCodes[question_id],
        }), {})
    });

  };

  handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit your application? Once an application is submitted, you cannot make changes anymore.")) {
      this.props.dispatch(submitHackerApplicationAction(this.getHackerApplication()._id));
    }
  };

  getHackerApplication = () => {
    return this.props.me.applications.find(
      hackerApp => hackerApp.application._id === this.props.application._id);
  };

  render() {
    const {
      me,
      myApplicationAnswersByQuestionId,
      application,
    } = this.props;
    if (!me || !application || !myApplicationAnswersByQuestionId) {
      return null;
    }
    return (
      <section className="app">
        <form onSubmit={this.handleSave}>
          <section className="app__form">
            <BackButton to="/app" text="Back"/>
            <h1>{application.event.name} - {application.name}</h1>

            <p className="app__description">{application.description}</p>

            {application.questions.map((question) => (
              <Fragment key={question._id}>
                <ApplicationFormField
                  {...question}
                  answers={myApplicationAnswersByQuestionId[question._id]}
                  onChange={() => this.setState({changed: true, canSubmit: false})}
                />
              </Fragment>
            ))}
          </section>
          <aside className="app__action-panel">
            {this.getHackerApplication() && this.getHackerApplication().submitted_at ? (
              <small className="app__small-label">
                Application has been submitted.
              </small>
            ) : (
              <Fragment>
                <small className="app__small-label">
                  You can keep updating your application until you decide to submit.
                </small>
                <br/>
                {!this.props.fetchCount ? (
                  <Fragment>
                    <button type="submit"
                            className={"app__apply-btn " + (!this.state.changed ? "app__apply-btn--disabled" : "'")}
                            disabled={!this.state.changed}>Save
                    </button>
                    &nbsp;&nbsp;
                    <button type="button"
                            onClick={this.handleSubmit}
                            className={"app__apply-btn " + (!this.state.canSubmit ? "app__apply-btn--disabled" : "'")}
                            disabled={!this.state.canSubmit}>
                      Submit
                    </button>
                  </Fragment>
                ) : (
                  <Fragment>
                    <br/>
                    <i className="fa fa-spinner fa-spin" aria-hidden="true"/>
                  </Fragment>
                )}
              </Fragment>
            )}

          </aside>
        </form>
      </section>
    )
  }
}

export const ApplicationForm = connect((state, props) => ({
  me: selectHackersMe(state),
  myApplicationAnswersByQuestionId: selectMyApplicationQuestionsHashMap(state, props),
  application: selectApplicationForm(state, props),
  applicationQuestionsById: selectApplicationFormQuestionsHashMap(state, props),
  fetchCount: state.fetch.fetchCount
}))(_ApplicationForm);
