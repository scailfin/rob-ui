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
import benchmark from './Benchmark';
import benchmarkListing from './BenchmarkListing';
import fileUploads from './FileUploads';
import leaderboard from './Leaderboard'
import run from './Run';
import runListing from './RunListing';
import submitRunForm from './SubmitRunForm';
import submission from './Submission';

const rootReducer = combineReducers({
    app,
    benchmark,
    benchmarkListing,
    fileUploads,
    leaderboard,
    run,
    runListing,
    submitRunForm,
    submission
})

export default rootReducer;
