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
    CREATE_SUBMISSIONS_SUCCESS, FETCH_SUBMISSIONS_START,
    FETCH_SUBMISSIONS_SUCCESS, SELECT_DIALOG, SELECT_SUBMISSION,
    SHOW_SUBMISSION, SUBMISSIONS_ERROR
} from '../actions/Submission';
import { SHOW_RUNS } from '../resources/Dialog'


/**
 * The submission state contains the listing of descriptors for all user
 * submission for the selected benchmark, the handle for the currently selected
 * submission, and the submission dialog tab.
 */
const INITIAL_STATE = {
    submissions: null,
    fetchError: null,
    isFetching: false,
    selectedSubmission: null,
    selectedDialog: SHOW_RUNS
}


const submissions = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATE_SUBMISSIONS_SUCCESS:
            const createdSubmission = action.payload;
            return {
                ...state,
                submissions: state.submissions.concat([createdSubmission]),
                selectedSubmission: createdSubmission,
                submissionDialog: 0
            };
        case FETCH_SUBMISSIONS_START:
            return {...state, isFetching: true, fetchError: null};
        case FETCH_SUBMISSIONS_SUCCESS:
            return {
                ...state,
                submissions: action.payload.submissions,
                isFetching: false,
                fetchError: null
            };
        case SELECT_DIALOG:
            return {...state, selectedDialog: action.payload};
        case SHOW_SUBMISSION:
            return {
                ...state,
                selectedSubmission: action.payload,
                selectedDialog: SHOW_RUNS
            };
        case SUBMISSIONS_ERROR:
            return {...state, isFetching: false, fetchError: action.payload};
        default:
            return state
    }
}

export default submissions;
