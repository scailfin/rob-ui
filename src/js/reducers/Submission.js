/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { LOGOUT_SUCCESS } from '../actions/Auth';
import { SELECT_BENCHMARK, SELECT_DIALOG } from '../actions/Benchmark';
import {
    CREATE_SUBMISSION_SUCCESS, FETCH_SUBMISSION_START,
    FETCH_SUBMISSION_SUCCESS, FETCH_SUBMISSION_ERROR
} from '../actions/Submission';
import { SHOW_INSTRUCTIONS, SHOW_LEADERBOARD } from '../resources/Dialog';


/**
 * The submission state contains the listing of descriptors for all user
 * submission for the selected benchmark, the handle for the currently selected
 * submission, and the submission dialog tab.
 */
const INITIAL_STATE = {
    fetchError: null,
    isFetching: false,
    selectedSubmission: null
}


const submissions = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATE_SUBMISSION_SUCCESS:
            const createdSubmission = action.payload;
            return {
                ...state,
                submissions: state.submissions.concat([createdSubmission]),
                selectedSubmission: createdSubmission,
                submissionDialog: 0
            };
        case FETCH_SUBMISSION_START:
            return {...state, isFetching: true, fetchError: null};
        case FETCH_SUBMISSION_SUCCESS:
            return {
                ...state,
                selectedSubmission: action.payload,
                isFetching: false,
                fetchError: null
            };
        case FETCH_SUBMISSION_ERROR:
            return {...state, isFetching: false, fetchError: action.payload};
        case LOGOUT_SUCCESS:
            return {
                ...state,
                fetchError: null,
                isFetching: false,
                selectedSubmission: null
            };
        case SELECT_BENCHMARK:
            return {
                ...state,
                fetchError: null,
                isFetching: false,
                selectedSubmission: action.payload.submission
            };
        case SELECT_DIALOG:
            switch (action.payload) {
                case SHOW_INSTRUCTIONS:
                case SHOW_LEADERBOARD:
                    return {...state, selectedSubmission: null};
                default:
                    return state;
            }
        default:
            return state
    }
}

export default submissions;
