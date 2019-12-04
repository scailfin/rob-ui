/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import {FETCH_API_SUCCESS} from '../actions/Api';


const INITIAL_STATE = {
    name: null,
    urls: null,
    version: null
}


const api = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case FETCH_API_SUCCESS:
            const {name, version, urls} = action.payload;
            return {...state, name: name, version: version, urls: urls};
        default:
            return state
    }
}

export default api;
