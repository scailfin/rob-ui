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
import {
    FETCH_UPLOADFILES_ERROR, FETCH_UPLOADFILES_START,
    FETCH_UPLOADFILES_SUCCESS, FETCH_SUBMISSION_SUCCESS
} from '../actions/Submission';


/*
 * This reducer manages part of the selected submission state that maintains
 * the list of files that have previously been uploaded for a submission.
 * Maintains fetch information while uploading and fetching submission file
 * lists.
 */
const INITIAL_STATE = {
    fetchError: null,
    isFetching: false,
    files: null
}


const fileUploads = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_BENCHMARK_START:
            return {...state, isFetching: false, fetchError: null, files: []};
        case FETCH_SUBMISSION_SUCCESS:
            return {
                ...state,
                isFetching: false,
                fetchError: null,
                files: action.payload.files
            };
        case FETCH_UPLOADFILES_ERROR:
            return {...state, isFetching: false, fetchError: action.payload};
        case FETCH_UPLOADFILES_START:
            return {...state, isFetching: true, fetchError: null};
        case FETCH_UPLOADFILES_SUCCESS:
            console.log(action);
            return {
                ...state,
                isFetching: false,
                fetchError: null,
                files: action.payload.files
            };
        case LOGOUT_SUCCESS:
        case SHOW_HOMEPAGE:
            return {...state, files: []};
        default:
            return state
    }
}

export default fileUploads;
