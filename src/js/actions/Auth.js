/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { nonCriticalError } from './App';
import { postRequest } from './Requests';
import { fetchBenchmarks } from './Benchmark';


export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'


// -- Login -------------------------------------------------------------------

/**
 * Submit user credentials at login. On success, the list of benchmarks will
 * be fetched and the benchmark listing is displayed.
 */
export function submitLogin(api, username, password) {
    const url = api.urls.login();
    const data = {username, password};
    const successHandler = (response) => (submitLoginSuccess(api, response));
    return dispatch => (
        dispatch(
            postRequest(url, data, successHandler, nonCriticalError)
        )
    )
};


/**
 * Success handler for user login. Request the list of benchmarks after a user
 * has logged in successfully.
 */
export function submitLoginSuccess(api, response) {
    return dispatch => {
        dispatch({type: LOGIN_SUCCESS, payload: {response}});
        return dispatch(fetchBenchmarks(api));
    };
}


// -- Logout ------------------------------------------------------------------

export function submitLogout(api) {
    return dispatch => (
            dispatch(
                postRequest(
                    api.urls.logout(),
                    {},
                    (json) => ({type: LOGOUT_SUCCESS}),
                    nonCriticalError
                )
            )
        )
};
