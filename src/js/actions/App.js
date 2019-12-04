/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

export const FETCH_ERROR = 'FETCH_ERROR';
export const FETCH_SUCCESS = 'FETCH_SUCCESS';
export const FETCH_START = 'FETCH_START';
export const NO_OP = 'NO_OP'

export const fetchError = (error) => ({type: FETCH_ERROR, payload: {error: error}});
export const fetchSuccess = () => ({type: FETCH_SUCCESS});
export const fetchStart = () => ({type: FETCH_START});
