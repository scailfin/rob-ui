/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { SELECT_BENCHMARK } from '../actions/Benchmark';
import { FETCH_SUBMISSION_SUCCESS } from '../actions/Submission';
import {
    FETCH_RUNS_ERROR, FETCH_RUNS_START, FETCH_RUNS_SUCCESS
} from '../actions/RunListing'


/*
 * The run listing state maintains a list of run descriptors for a submission.
 */
const INITIAL_STATE = {
    fetchError: null,
    isFetching: false,
    runs: null
}


const runListing = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_RUNS_ERROR:
            return {...state, fetchError: action.payload};
        case FETCH_RUNS_START:
            return {...state, isFetching: true, fetchError: null};
        case FETCH_RUNS_SUCCESS:
        case FETCH_SUBMISSION_SUCCESS:
            return {
                ...state,
                runs: action.payload.runs,
                isFetching: false,
                fetchError: null
            };
        case SELECT_BENCHMARK:
            const selectedSubmission = action.payload.submission;
            if (selectedSubmission != null) {
                return {...state, runs: selectedSubmission.runs};
            } else {
                return {...state, runs: null}
            }
        default:
            return state
    }
}

export default runListing;
