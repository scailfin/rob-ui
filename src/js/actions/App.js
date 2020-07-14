/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { submitLoginSuccess } from './Auth';
import { fetchBenchmarks } from './BenchmarkListing';
import { fetchApiResource } from './Requests';
import { Urls } from '../resources/Urls';


/******************************************************************************
 * Action types
 *****************************************************************************/

export const API_ERROR = 'API_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';
export const FETCH_API_START = 'FETCH_API_START';
export const FETCH_API_SUCCESS = 'FETCH_API_SUCCESS';
export const SHOW_HOMEPAGE = 'SHOW_HOMEPAGE';


// -- Errors ------------------------------------------------------------------

export const clearError = () => ({type: CLEAR_ERROR});

export const criticalError = (error) => ({
    type: API_ERROR, payload: {error: error, isCritical: true}
});

export const nonCriticalError = (error) => ({
    type: API_ERROR, payload: {error: error, isCritical: false}
});

// -- Service Descriptor ------------------------------------------------------

/*
 * The very first call to the API is to fetch the service descriptor.
 */
export function fetchApi() {
    // This should move elsewhere. Note that the trailing '/' is essential!
    const apiUrl = 'http://localhost:5000/rob/api/v1/';
    // Get the service descriptor from the API.
    return fetchApiResource(
        apiUrl,
        fetchApiSuccess,
        criticalError,
        () => ({type: FETCH_API_START})
    )
}

function fetchApiSuccess(response) {
    const {name, version, routes, validToken, username} = response;
    const api = {
        name,
        version,
        urls: new Urls(routes)
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


/**
 * Set selected benchmarks and benchmark listing to null. Fetch current
 * benchmark listing from API.
 */
export function showHomepage(api) {
    return dispatch => {
        dispatch({type: SHOW_HOMEPAGE});
        return dispatch(fetchBenchmarks(api));
    }
}
