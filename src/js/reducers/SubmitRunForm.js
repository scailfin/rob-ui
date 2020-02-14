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
    SUBMIT_RUN_ERROR, SUBMIT_RUN_START, SUBMIT_RUN_SUCCESS
} from '../actions/Run';


/*
 * Reducer to maintain state of a workflow run submission.
 */
const INITIAL_STATE = {
    isSubmitting: false,
    submitError: null
}


const submitRunForm = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SUBMIT_RUN_ERROR:
            return {...state, isSubmitting: false, submitError: action.payload};
        case SUBMIT_RUN_START:
            return {...state, isSubmitting: true, submitError: null};
        case SUBMIT_RUN_SUCCESS:
            return {...state, isSubmitting: false, submitError: null};
        default:
            return state
    }
}

export default submitRunForm;
