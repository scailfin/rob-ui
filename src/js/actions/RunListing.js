/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { selectDialog } from './Benchmark';
import { fetchApiResource, postRequest } from './Requests';
import { SHOW_RUNS } from '../resources/Dialog';



/******************************************************************************
 * Action types
 *****************************************************************************/

// Run listing
export const FETCH_RUNS_ERROR = 'FETCH_RUNS_ERROR';
export const FETCH_RUNS_SUCCESS = 'FETCH_RUNS_SUCCESS';
// Run submission
export const SUBMIT_RUN_ERROR = 'SUBMIT_RUN_ERROR'
export const SUBMIT_RUN_START = 'SUBMIT_RUN_START';


/******************************************************************************
 * Actions
 *****************************************************************************/


// -- Errors ------------------------------------------------------------------

export const dismissFetchRunsError = () => (fetchRunsError());
export const dismissSubmitRunError = () => (submitRunError());

const fetchRunsError = (msg) => ({type: FETCH_RUNS_ERROR, payload: msg});
const submitRunError = (msg) => ({type: SUBMIT_RUN_ERROR, payload: msg});


// -- Run listing -------------------------------------------------------------

export function fetchRuns(api, submission) {
    return fetchApiResource(
        api.urls.listRuns(submission.id),
        (json) => ({type: FETCH_RUNS_SUCCESS, payload: json}),
        fetchRunsError
    );
}


// -- Submit run --------------------------------------------------------------

export function submitRun(api, submission, data) {
    return postRequest(
        api.urls.submitRun(submission.id),
        data,
        (json) => (submitRunSuccess(api, submission)),
        submitRunError,
        () => ({type: SUBMIT_RUN_START})
    );
}


function submitRunSuccess(api, submission) {
    return dispatch => {
        dispatch(selectDialog(api, SHOW_RUNS));
        return dispatch(fetchRuns(api, submission))
    }
}
