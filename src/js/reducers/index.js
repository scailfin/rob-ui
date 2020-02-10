/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { combineReducers } from 'redux';
import app from './App';
import benchmarks from './Benchmarks';
import leaderboard from './Leaderboard'
import runListing from './RunListing';
import submission from './Submission';

const rootReducer = combineReducers({
    app,
    benchmarks,
    leaderboard,
    runListing,
    submission
})

export default rootReducer;
