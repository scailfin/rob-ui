import {postUrl} from './Api';
import {fetchBenchmarks} from './Benchmark';


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'


export function submitLogin(api, username, password) {
    return dispatch => {
        dispatch(postUrl(api.urls.get('login'), {username, password}, submitLoginSuccess));
        return dispatch(fetchBenchmarks(api.urls.get('benchmarks')))
    }
};


export function submitLogout(url, token) {
    return dispatch => {
        postUrl(url, {}, submitLogoutSuccess, token)
    }
};


function submitLoginSuccess(response) {
    return {type: LOGIN_SUCCESS, payload: {response, component: "BL"}}
}


function submitLogoutSuccess() {
    return {type: LOGOUT_SUCCESS}
}
