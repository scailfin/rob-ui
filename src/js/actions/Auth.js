import {postUrl} from './Api';

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'


export function submitLogin(url, username, password) {
    return postUrl(url, {username, password}, submitLoginSuccess)
};


export function submitLogout(url, token) {
    return postUrl(url, {}, submitLogoutSuccess, token)
};


function submitLoginSuccess(payload) {
    return {type: LOGIN_SUCCESS, payload}
}


function submitLogoutSuccess() {
    return {type: LOGOUT_SUCCESS};
}
