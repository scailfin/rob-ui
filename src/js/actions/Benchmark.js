/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { fetchApiResource, postRequest } from './Requests';
import { fetchSubmission } from './Submission.js';
import {
    SHOW_INSTRUCTIONS, SHOW_LEADERBOARD, SHOW_RUNS
} from '../resources/Dialog';

export const FETCH_BENCHMARK_ERROR = 'FETCH_BENCHMARK_ERROR';
export const FETCH_BENCHMARK_START = 'FETCH_BENCHMARK_START';
export const FETCH_BENCHMARK_SUCCESS = 'FETCH_BENCHMARK_SUCCESS';
export const FETCH_LEADERBOARD_ERROR = 'FETCH_LEADERBOARD_ERROR';
export const FETCH_LEADERBOARD_START = 'FETCH_LEADERBOARD_START';
export const FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS';
export const SELECT_BENCHMARK = 'SELECT_BENCHMARK';
export const SELECT_DIALOG = 'SELECT_DIALOG';


// -- Errors ------------------------------------------------------------------

export const criticalError = (error) => ({
    type: FETCH_BENCHMARK_ERROR, payload: {error: error, isCritical: true}
})

export const minorError = (error) => ({
    type: FETCH_BENCHMARK_ERROR, payload: {error: error, isCritical: false}
})

export const dismissError = () => ({type: FETCH_BENCHMARK_ERROR, payload: null})


// -- Benchmarks --------------------------------------------------------------

/**
 * Set the selected benchmark. Fetches the benchmark handle from the API. If
 * the optional sobmission handle is given it will be set as the selected
 * submission.
 */
export function fetchBenchmark(api, benchmark, submission) {
    const url = api.urls.getBenchmark(benchmark.id);
    return fetchApiResource(
        url,
        (json) => ({
            type: SELECT_BENCHMARK,
            payload: {benchmark: json, submission: submission}
        }),
        (msg) => criticalError,
        () => (fetchBenchmarkStart(benchmark))
    );
}

const fetchBenchmarkStart = (benchmark) => ({
    type: FETCH_BENCHMARK_START,
    payload: benchmark
})


// -- Content -----------------------------------------------------------------

/*
 * Set the information that is currently shown for a selected benchmark.
 */
export function selectDialog(api, dialogId, benchmark, submission) {
    if (dialogId === SHOW_LEADERBOARD) {
        // Fetch benchmark leaderboard
        return dispatch => {
            dispatch(fetchLeaderboard(api, benchmark));
            return dispatch({type: SELECT_DIALOG, payload: dialogId});
        };
    } else if ((dialogId === SHOW_RUNS) && (submission != null)) {
        // Fetch benchmark submissions
        return dispatch => {
            dispatch(fetchSubmission(api, submission));
            return dispatch({type: SELECT_DIALOG, payload: dialogId});
        };
    } else {
        return {type: SELECT_DIALOG, payload: dialogId};
    }
}


// -- Leader board ------------------------------------------------------------

/**
 * Fetch leader board information for the selected benchmark.
 */
export function fetchLeaderboard(api, benchmark, startSignal) {
    let startSignalAction = () => ({type: FETCH_LEADERBOARD_START});
    if (startSignal != null) {
        if (!startSignal) {
            startSignalAction = null;
        }
    }
    const url = api.urls.getLeaderboard(benchmark.id);
    return dispatch => {
        // Set the current leader board to null before fetch starts
        return dispatch(
            fetchApiResource(
                url,
                (json) => ({type: FETCH_LEADERBOARD_SUCCESS, payload: json}),
                (msg) => ({type: FETCH_LEADERBOARD_ERROR, payload: msg}),
                startSignalAction
            )
        );
    }
}


// -- Submissions -------------------------------------------------------------

export function createSubmission(api, benchmark, name) {
    return postRequest(
        api.urls.createSubmission(benchmark.id),
        {name},
        (json) => {return dispatch => {
            dispatch(fetchBenchmark(api, benchmark, json))
            return dispatch(selectDialog(api, SHOW_RUNS))
        }},
        minorError,
        () => (fetchBenchmarkStart(benchmark))
    )
}

export function deleteSubmission(api, benchmark, submission) {
    return postRequest(
        api.urls.deleteSubmission(submission.id),
        {},
        () => {return dispatch => {
            dispatch(selectDialog(api, SHOW_INSTRUCTIONS, benchmark));
            return dispatch(fetchBenchmark(api, benchmark))
        }},
        minorError,
        () => (fetchBenchmarkStart(benchmark)),
        'DELETE'
    )
}
