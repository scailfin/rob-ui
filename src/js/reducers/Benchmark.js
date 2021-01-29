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
import {
    FETCH_BENCHMARK_ERROR, FETCH_BENCHMARK_START, FETCH_BENCHMARK_SUCCESS,
    SELECT_BENCHMARK, SELECT_DIALOG
} from '../actions/Benchmark';
import { SHOW_INSTRUCTIONS } from '../resources/Dialog';


/**
 * The benchmark state maintains the listing of all benchmark descriptors as
 * well as the current selected benchmark and the selected tab.
 */
const INITIAL_STATE = {
    fetchError: null,
    isFetching: false,
    selectedBenchmark: null,
    selectedDialog: SHOW_INSTRUCTIONS
}


const benchmark = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_BENCHMARK_ERROR:
            return {...state, isFetching: false, fetchError: action.payload};
        case FETCH_BENCHMARK_START:
            return {...state, isFetching: true, selectedBenchmark: action.payload};
        case FETCH_BENCHMARK_SUCCESS:
            return {
                ...state,
                benchmarks: action.payload.workflows,
                isFetching: false
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                selectedBenchmark: null,
                submissions: null
            };
        case SELECT_BENCHMARK:
            return {
                ...state,
                fetchError: null,
                isFetching: false,
                selectedBenchmark: action.payload.benchmark,
                selectedDialog: SHOW_INSTRUCTIONS
            };
        case SELECT_DIALOG:
            return {...state, selectedDialog: action.payload}
        case SHOW_HOMEPAGE:
            return {
                ...state,
                benchmarks: null,
                selectedBenchmark: null,
                selectedDialog: SHOW_INSTRUCTIONS
            };
        default:
            return state
    }
}

export default benchmark;
