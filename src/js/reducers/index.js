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
import leaderboard from './Leaderboard'
import mainPanel from './MainPanel';
import runListing from './RunListing';
import submissions from './Submissions';

const rootReducer = combineReducers({
    app,
    leaderboard,
    mainPanel,
    runListing,
    submissions
})

export default rootReducer;
