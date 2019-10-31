import {postUrl} from './Api';
import {fetchStart, fetchSuccess} from './App';
import {fetchBenchmarks} from './Benchmark';
import {fetchSubmissions} from './Submission';


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'


/**
 * Submit user credentials at login. On success, the list of benchmarks will
 * be fetched and the benchmark listing is displayed.
 */
export function submitLogin(api, username, password) {
    const url = api.urls.get('login');
    const data = {username, password};
    const startSignal = () => (fetchStart('BL'));
    const successSignal = fetchSuccess;
    const successHandler = (response) => (submitLoginSuccess(api, response));
    return dispatch => (
        dispatch(
            postUrl(url, data, startSignal, successSignal, successHandler)
        )
    )
};


export function submitLogout(url) {
    return dispatch => (
            dispatch(
                postUrl(url, {}, fetchStart, fetchSuccess, submitLogoutSuccess)
            )
        )
};


/**
 * Success handler for user login. Request the list of benchmarks after a user
 * has logged in successfully.
 */
function submitLoginSuccess(api, response) {
    return dispatch => {
        dispatch({type: LOGIN_SUCCESS, payload: {response}});
        dispatch(fetchSubmissions(api.urls.get('submissions')));
        return dispatch(fetchBenchmarks(api.urls.get('benchmarks')));
    };
}


function submitLogoutSuccess() {
    return {type: LOGOUT_SUCCESS}
}
