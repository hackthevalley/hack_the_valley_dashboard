import htv from 'htv-sdk';
import HttpRequestError from '../../errors/HttpRequestError';
import { logoutAction } from './';
import { Hacker } from '../../models';
import { FETCH_LOADING, FETCH_SUCCESS, FETCH_FAIL } from '.';

export const GETME_FAIL = 'GETME_FAIL';
export const GETME_SUCCESS = 'GETME_SUCCESS';
export const UPDATEME_FAIL = 'UPDATEME_FAIL';
export const UPDATEME_SUCCESS = 'UPDATEME_SUCCESS';
export const CREATEHACKERAPPLICATION_FAIL = 'CREATEHACKERAPPLICATION_FAIL';
export const CREATEHACKERAPPLICATION_SUCCESS = 'CREATEHACKERAPPLICATION_SUCCESS';
export const UPDATEHACKERAPPLICATIONQUESTION_FAIL = 'UPDATEHACKERAPPLICATIONQUESTION_FAIL';
export const UPDATEHACKERAPPLICATIONQUESTION_SUCCESS = 'UPDATEHACKERAPPLICATIONQUESTION_SUCCESS';
export const SUBMITHACKERAPPLICATION_FAIL = 'SUBMITHACKERAPPLICATION_FAIL';
export const SUBMITHACKERAPPLICATION_SUCCESS = 'SUBMITHACKERAPPLICATION_SUCCESS';

export function getMeAction() {
  return async (dispatch) => {
    try {
      const promise = htv.Graph.query(`{
        me {
          _id,
          email_address,
          first_name,
          last_name,
          gender,
          dob,
          school,
          github,
          linkedin,
          phone_number,
          website,
          description,
          avatar,
          promo_email,
          created_at,
          updated_at,
          applications {
            _id
            application {
              _id
            }
            answers {
              _id
              question {
                _id
              }
              question_id
              answer
            }
            submitted_at
          }
        }
      }`);
      dispatch({ type: FETCH_LOADING, promise });
      const hacker = await promise;
      if (!hacker.me) {
        await dispatch(logoutAction());
        throw new Error('Hacker is not logged in');
      }
      return Promise.all([
        dispatch({
          type: GETME_SUCCESS,
          hacker: new Hacker({...hacker.me}),
        }),
        dispatch({ type: FETCH_SUCCESS }),
      ]);
    } catch (err) {
      const errorCodes = err.graphQLErrors
        ? err.graphQLErrors.map(err => err.message)
        : err.errorCodes;
      const error = new HttpRequestError(errorCodes);
      console.log(err);
      return Promise.all([
        dispatch({ type: GETME_FAIL, error }),
        dispatch({ type: FETCH_FAIL, error }),
      ]);
    }
  }
}

export function updateHackerAction(hacker_id, hacker) {
  return async (dispatch) => {
    try {
      const promise = htv.Hacker.update(hacker_id, hacker);
      dispatch({ type: FETCH_LOADING, promise });
      await promise;
      return Promise.all([
        dispatch({
          type: UPDATEME_SUCCESS,
          hacker: new Hacker(hacker),
        }),
        dispatch({ type: FETCH_SUCCESS }),
      ]);
    } catch (err) {
      const errorCodes = err.graphQLErrors
        ? err.graphQLErrors.map(err => err.message)
        : err.errorCodes;
      const error = new HttpRequestError(errorCodes);
      return Promise.all([
        dispatch({ type: UPDATEME_FAIL, error }),
        dispatch({ type: FETCH_FAIL, error }),
      ]);
    }
  }
}

export function createHackerApplicationAction(application_id) {
  return async (dispatch) => {
    try {
      const promise = htv.HackerApplication.create(application_id);
      dispatch({ type: FETCH_LOADING, promise });
      const hacker_application_id = await promise;
      return Promise.all([
        dispatch({
          type: CREATEHACKERAPPLICATION_SUCCESS,
          application: {
            _id: hacker_application_id,
            application: {
              _id: application_id
            },
            answers: [],
            submitted_at: null,
          },
        }),
        dispatch({ type: FETCH_SUCCESS }),
      ]);
    } catch (err) {
      const errorCodes = err.graphQLErrors
        ? err.graphQLErrors.map(err => err.message)
        : err.errorCodes;
      const error = new HttpRequestError(errorCodes);
      return Promise.all([
        dispatch({ type: CREATEHACKERAPPLICATION_FAIL, error }),
        dispatch({ type: FETCH_FAIL, error }),
      ]);
    }
  }
}

export function updateHackerApplicationQuestionAction(hacker_application_id, question_id, answers) {
  return async (dispatch) => {
    try {
      const promise = htv.HackerApplication.updateQuestion(hacker_application_id, question_id, answers);
      dispatch({ type: FETCH_LOADING, promise });
      await promise;
      return Promise.all([
        dispatch({
          type: UPDATEHACKERAPPLICATIONQUESTION_SUCCESS,
          hacker_application_id,
          question_id,
          answers,
        }),
        dispatch({ type: FETCH_SUCCESS }),
      ]);
    } catch (err) {
      const errorCodes = err.graphQLErrors
        ? err.graphQLErrors.map(err => err.message)
        : err.errorCodes;
      const error = new HttpRequestError(errorCodes);
      return Promise.all([
        dispatch({ type: UPDATEHACKERAPPLICATIONQUESTION_FAIL, error }),
        dispatch({ type: FETCH_FAIL, error }),
      ]);
    }
  }
}

export function submitHackerApplicationAction(hacker_application_id) {
  return async (dispatch) => {
    try {
      const promise = htv.HackerApplication.submit(hacker_application_id);
      dispatch({ type: FETCH_LOADING, promise });
      await promise;
      console.log("YES");
      return Promise.all([
        dispatch({
          type: SUBMITHACKERAPPLICATION_SUCCESS
        }),
        dispatch({ type: FETCH_SUCCESS }),
        dispatch(getMeAction())
      ]);
    } catch (err) {
      console.log(err, hacker_application_id);
      const errorCodes = err.graphQLErrors
        ? err.graphQLErrors.map(err => err.message)
        : err.errorCodes;
      const error = new HttpRequestError(errorCodes);
      return Promise.all([
        dispatch({ type: SUBMITHACKERAPPLICATION_FAIL, error }),
        dispatch({ type: FETCH_FAIL, error }),
      ]);
    }
  }
}
