/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { SHOW_HOMEPAGE } from '../actions/App';
import { LOGOUT_SUCCESS } from '../actions/Auth';
import { FETCH_BENCHMARK_START } from '../actions/Benchmark';
import { FETCH_RUNS_ERROR, FETCH_RUNS_SUCCESS } from '../actions/RunListing';
import { FETCH_SUBMISSION_SUCCESS } from '../actions/Submission';


/*
 * Reducer for global state that maintains the list of submission runs.
 * Maintains list of run descriptors together with any potential error that
 * occurred during fetching. No spinner is shown while fetching runs. Therefore,
 * there is no flag that would maintain the respective information.
 */
const INITIAL_STATE = {
    fetchError: null,
    runs: null
}


const runListing = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_RUNS_ERROR:
            return {...state, fetchError: action.payload};
        case FETCH_SUBMISSION_SUCCESS:
        case FETCH_RUNS_SUCCESS:
            return {
                ...state,
                fetchError: null,
                runs: action.payload.runs
            };
        case FETCH_BENCHMARK_START:
        case LOGOUT_SUCCESS:
        case SHOW_HOMEPAGE:
            return {
                ...state,
                fetchError: null,
                runs: [],
                selectedRun: null
            };
        default:
            return state
    }
}

export default runListing;
