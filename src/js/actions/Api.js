/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { submitLoginSuccess } from './Auth';
import { getUrl } from './Requests';
import { Urls } from '../resources/Urls';

export const FETCH_API_SUCCESS = 'FETCH_API_SUCCESS';


export function fetchApi() {
    // This should move elsewhere. Note that the trailing '/' is essential!
    //const apiUrl = 'http://localhost:5000/rob/api/v1/';
    const apiUrl = 'http://cds-swg1.cims.nyu.edu:5000/rob/api/v1/';
    // Get the service descriptor from the API.
    return getUrl(apiUrl, fetchApiSuccess)
}


function fetchApiSuccess(response) {
    const {name, version, links, validToken, username} = response;
    const api = {
        name,
        version,
        urls: new Urls(links)
    };
    // The server response indicates in element 'validToken' whether the access
    // token that (potentially) is stored in the local store is still valid or
    // not. If it is valid we fetch the benchmark and submission listing for
    // the user. Otherwise, we clear the information from the local store.
    return dispatch => {
        if (validToken) {
            const accessToken = localStorage.getItem('accessToken');
            dispatch(submitLoginSuccess(api, {username, token: accessToken}));
        } else {
            localStorage.removeItem('accessToken');
        }
        return dispatch({
            type: FETCH_API_SUCCESS,
            payload: api
        })
    }
}
