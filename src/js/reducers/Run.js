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
 import { FETCH_SUBMISSION_SUCCESS } from '../actions/Submission';
import {
    FETCH_RUN_ERROR, FETCH_RUN_START, FETCH_RUN_SUCCESS
} from '../actions/Run';


/*
 * Reducer that maintains information about the run that currently is shown
 * within the submission runs panel.
 */
const INITIAL_STATE = {
    isFetching: false,
    fetchError: null,
    selectedRun: null
}


const run = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_RUN_ERROR:
            return {...state, isFetching: false, fetchError: action.payload};
        case FETCH_RUN_START:
            return {...state, isFetching: true, fetchError: null};
        case FETCH_RUN_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetchError: null,
                selectedRun: action.payload
            };
        case FETCH_SUBMISSION_SUCCESS:
        case FETCH_BENCHMARK_START:
        case LOGOUT_SUCCESS:
        case SHOW_HOMEPAGE:
            return {
                ...state,
                isFetching: false,
                fetchError: null,
                selectedRun: null
            };
        default:
            return state
    }
}

export default run;
