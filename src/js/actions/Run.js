/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { NO_OP, criticalError } from './App';
import { fetchApiResource, postRequest } from './Requests';
import { fetchRuns } from './RunListing';


/******************************************************************************
 * Action types
 *****************************************************************************/

// Run handle
export const FETCH_RUN_ERROR = 'FETCH_RUN_ERROR';
export const FETCH_RUN_START = 'FETCH_RUN_START';
export const FETCH_RUN_SUCCESS = 'FETCH_RUN_SUCCESS';


/******************************************************************************
 * Actions
 *****************************************************************************/


// -- Errors ------------------------------------------------------------------

export const dismissFetchRunError = () => (fetchRunError());
const fetchRunError = (msg) => ({type: FETCH_RUN_ERROR, payload: msg});


// -- Run handle --------------------------------------------------------------

export function fetchRun(api, runId) {
    return fetchApiResource(
        api.urls.getRun(runId),
        fetchRunSuccess,
        fetchRunError,
        fetchRunStart,
    );
}


const fetchRunStart = () => ({type: FETCH_RUN_START});

const fetchRunSuccess = (run) => ({type: FETCH_RUN_SUCCESS, payload: run})


export function cancelRun(api, submission, run) {
    return postRequest(
        api.urls.cancelRun(run.id),
        {reason: 'Canceled at user request'},
        (json) => (cancelRunSuccess(api, submission, json)),
        fetchRunError,
        fetchRunStart,
        'PUT'
    );
}


function cancelRunSuccess(api, submission, run) {
    return dispatch => {
        dispatch(fetchRuns(api, submission))
        return dispatch(fetchRunSuccess(run))
    }
}
