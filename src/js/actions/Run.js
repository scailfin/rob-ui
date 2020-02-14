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



/*
 * Action types
 */

// Run handle
export const FETCH_RUN_ERROR = 'FETCH_RUN_ERROR';
export const FETCH_RUN_START = 'FETCH_RUN_START';
export const FETCH_RUN_SUCCESS = 'FETCH_RUN_SUCCESS';
// Run listing
export const FETCH_RUNS_ERROR = 'FETCH_RUNS_ERROR';
export const FETCH_RUNS_SUCCESS = 'FETCH_RUNS_SUCCESS';
// Run submission
export const SUBMIT_RUN_ERROR = 'SUBMIT_RUN_ERROR';
export const SUBMIT_RUN_START = 'SUBMIT_RUN_START';

/*
 * Actions
 */


// -- Errors ------------------------------------------------------------------

export const dismissFetchRunError = () => (fetchRunError());
export const dismissFetchRunsError = () => (fetchRunsError());
export const dismissSubmitRunError = () => (submitRunError());

const fetchRunError = (msg) => ({type: FETCH_RUN_ERROR, payload: msg});
const fetchRunsError = (msg) => ({type: FETCH_RUNS_ERROR, payload: msg});
const submitRunError = (msg) => ({type: SUBMIT_RUN_ERROR, payload: msg});


// -- Run handle --------------------------------------------------------------

export function fetchRun(api, run) {
    return fetchApiResource(
        api.urls.getRun(run.id),
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


// -- Run listing -------------------------------------------------------------

export function fetchRuns(api, submission, selectedRun) {
    return fetchApiResource(
        api.urls.listRuns(submission.id),
        (json) => {return dispatch => {
            // If the selected run is given, check whether the run state has
            // changed. If there is a change in state, fetch the run handle.
            if (selectedRun != null) {
                const run = json.runs.find((r) => (r.id === selectedRun.id));
                if (run != null) {
                    if (run.state !== selectedRun.state) {
                        dispatch(fetchRun(api, selectedRun));
                    }
                }
            }
            return dispatch({type: FETCH_RUNS_SUCCESS, payload: json})
        }},
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
