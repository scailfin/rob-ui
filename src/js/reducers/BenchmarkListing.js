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
    FETCH_BENCHMARKS_ERROR, FETCH_BENCHMARKS_START, FETCH_BENCHMARKS_SUCCESS
} from '../actions/BenchmarkListing';


/**
 * The benchmark listing state maintains the list of all benchmark descriptors.
 */
const INITIAL_STATE = {
    benchmarks: null,
    fetchError: null,
    isFetching: false
}


const benchmarkListing = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_BENCHMARKS_ERROR:
            return {...state, isFetching: false, fetchError: action.payload};
        case FETCH_BENCHMARKS_START:
            return {...state, isFetching: true};
        case FETCH_BENCHMARKS_SUCCESS:
            return {
                ...state, benchmarks: action.payload.benchmarks,
                isFetching: false
            };
        case LOGOUT_SUCCESS:
        case SHOW_HOMEPAGE:
            return {...state, benchmarks: null};
        default:
            return state
    }
}

export default benchmarkListing;
