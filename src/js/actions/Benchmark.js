/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { fetchApiResource } from './Requests';
import { fetchSubmissions } from './Submission.js';
import {
    CREATE_SUBMISSION, SHOW_INSTRUCTIONS, SHOW_LEADERBOARD, SHOW_RUNS,
    SUBMIT_RUN, UPLOAD_FILES
} from '../resources/Dialog';


export const FETCH_BENCHMARKS_ERROR = 'FETCH_BENCHMARKS_ERROR';
export const FETCH_BENCHMARKS_START = 'FETCH_BENCHMARKS_START';
export const FETCH_BENCHMARKS_SUCCESS = 'FETCH_BENCHMARKS_SUCCESS';
export const FETCH_LEADERBOARD_ERROR = 'FETCH_LEADERBOARD_ERROR';
export const FETCH_LEADERBOARD_START = 'FETCH_LEADERBOARD_START';
export const FETCH_LEADERBOARD_SUCCESS = 'FETCH_LEADERBOARD_SUCCESS';
export const SELECT_BENCHMARK = 'SELECT_BENCHMARK';
export const SELECT_DIALOG = 'SELECT_DIALOG';


// -- Benchmark listings ------------------------------------------------------

/**
 * Fetch benchmark listing from API.
 */
export function fetchBenchmarks(api) {
    const url = api.urls.listBenchmarks();
    return fetchApiResource(
        url,
        (json) => ({type: FETCH_BENCHMARKS_SUCCESS, payload: json}),
        (msg) => ({type: FETCH_BENCHMARKS_ERROR, payload: msg}),
        () => ({type: FETCH_BENCHMARKS_START})
    );
}


// -- Benchmarks --------------------------------------------------------------

/**
 * Set the selected benchmark. The benchmark descriptor that was contained in
 * the benchmark listing contains all the necessary information. Thus, there
 * is no need at this point to fetch information from the API.
 */
export function selectBenchmark(api, benchmark) {
    const url = api.urls.getBenchmark(benchmark.id);
    return fetchApiResource(
        url,
        (json) => ({type: SELECT_BENCHMARK, payload: json}),
        (msg) => ({type: FETCH_BENCHMARKS_ERROR, payload: msg}),
        () => ({type: FETCH_BENCHMARKS_START})
    );
}

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
    } else if (dialogId === 2) {
        // Fetch benchmark submissions
        return dispatch => {
            dispatch(fetchSubmissions(api, benchmark));
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
function fetchLeaderboard(api, benchmark) {
    const url = api.urls.getLeaderboard(benchmark.id);
    return dispatch => {
        // Set the current leader board to null before fetch starts
        return dispatch(
            fetchApiResource(
                url,
                (json) => ({type: FETCH_LEADERBOARD_SUCCESS, payload: json}),
                (msg) => ({type: FETCH_LEADERBOARD_ERROR, payload: msg}),
                () => ({type: FETCH_LEADERBOARD_START})
            )
        );
    }
}
