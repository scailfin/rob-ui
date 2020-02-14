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
    API_ERROR, CLEAR_ERROR, FETCH_API_START, FETCH_API_SUCCESS
} from '../actions/App';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from '../actions/Auth';


/**
 * The application state maintains information about the current user and any
 * errors that may have occurred during the loading of the service descriptor.
 */
const INITIAL_STATE = {
    apiError: null,
    isFetching: true,
    name: null,
    username: null,
    urls: null,
    version: null
}


const app = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case API_ERROR:
            return {...state, isFetching: false, apiError: action.payload};
        case CLEAR_ERROR:
            return {...state, apiError: null};
        case FETCH_API_START:
            return {...state, isFetching: true, apiError: null};
        case FETCH_API_SUCCESS:
            const {name, version, urls} = action.payload;
            return {
                ...state,
                name: name,
                version: version,
                urls: urls,
                isFetching: false,
                apiError: null
            };
        case LOGIN_SUCCESS:
            const {username, token} = action.payload.response;
            localStorage.setItem('accessToken', token);
            return {...state, username: username, error: null};
        case LOGOUT_SUCCESS:
            localStorage.removeItem('accessToken');
            return {...state, username: null, error: null};
        default:
            return state;
    }
}

export default app;
