/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { LOGOUT_SUCCESS } from '../actions/Auth';
import {
    DESELECT_BENCHMARK, FETCH_BENCHMARKS_SUCCESS, SELECT_BENCHMARK, SELECT_TAB,
    UPDATE_BENCHMARK
} from '../actions/Benchmark';
import {
    CREATE_SUBMISSIONS_SUCCESS, FETCH_SUBMISSIONS_SUCCESS, SELECT_DIALOG,
    SELECT_SUBMISSION, UPDATE_SUBMISSION
} from '../actions/Submission';
import { SHOW_RUNS } from '../resources/Dialog';


const INITIAL_STATE = {
    benchmarks: null,
    selectedBenchmark: null,
    selectedSubmission: null,
    selectedTab: 0,
    submissionDialog: SHOW_RUNS,
    submissions: null
}


const mainPanel = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CREATE_SUBMISSIONS_SUCCESS:
            const createdSubmission = action.payload;
            return {
                ...state,
                submissions: state.submissions.concat([createdSubmission]),
                selectedSubmission: createdSubmission,
                submissionDialog: SHOW_RUNS
            };
        case DESELECT_BENCHMARK:
            return {
                ...state,
                selectedBenchmark: null,
                selectedSubmission: null,
                selectedTab: 0
            };
        case FETCH_BENCHMARKS_SUCCESS:
            return {...state, benchmarks: action.payload.benchmarks};
        case FETCH_SUBMISSIONS_SUCCESS:
            return {...state, submissions: action.payload.submissions};
        case LOGOUT_SUCCESS:
            return {
                ...state,
                selectedBenchmark: null,
                selectedSubmission: null,
                submissions: null
            };
        case SELECT_BENCHMARK:
            return {
                ...state,
                selectedBenchmark: action.payload,
                selectedSubmission: null,
                selectedTab: 0
            };
        case SELECT_DIALOG:
            return {
                ...state,
                submissionDialog: action.payload
            };
        case SELECT_SUBMISSION:
            // Need to replace the selected item in the submission array in case
            // it is a submission handle that was requested from the server.
            const selectedSubmission = action.payload;
            const updatedSubmissions = [];
            state.submissions.forEach((s) => {
                if (s.id === selectedSubmission.id) {
                    updatedSubmissions.push(selectedSubmission);
                } else {
                    updatedSubmissions.push(s);
                }
            });
            return {
                ...state,
                selectedSubmission: selectedSubmission,
                submissionDialog: SHOW_RUNS,
                submissions: updatedSubmissions
            };
        case SELECT_TAB:
            return {
                ...state,
                selectedTab: action.payload
            };
        case UPDATE_BENCHMARK:
            return {
                ...state,
                selectedBenchmark: action.payload
            };
        case UPDATE_SUBMISSION:
            // Need to replace the selected item in the submission array in case
            // it is a submission handle that was requested from the server.
            const updSubmission = action.payload;
            const updSubmissionList = [];
            state.submissions.forEach((s) => {
                if (s.id === updSubmission.id) {
                    updSubmissionList.push(updSubmission);
                } else {
                    updSubmissionList.push(s);
                }
            });
            return {
                ...state,
                selectedSubmission: updSubmission,
                submissions: updSubmissionList
            };
        default:
            return state
    }
}

export default mainPanel;
