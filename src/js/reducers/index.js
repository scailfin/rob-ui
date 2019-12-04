/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import { combineReducers } from 'redux';
import api from './Api';
import app from './App';
import mainPanel from './MainPanel';


const rootReducer = combineReducers({
    api,
    app,
    mainPanel
})

export default rootReducer;
