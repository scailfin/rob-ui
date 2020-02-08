/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

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
            return {
                ...state,
                runs: action.payload.runs,
                isFetching: false,
                fetchError: null
            };
        default:
            return state
    }
}

export default runListing;