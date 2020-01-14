/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import App from './js/components/app/App.jsx';
import store from './js/store/index';
import theme from './theme';


render(
    <ThemeProvider theme={theme}>
        {/*
            CssBaseline kickstart an elegant, consistent, and simple baseline to
            build upon.
        */}
        <CssBaseline />
        <Provider store={store}>
            <App />
        </Provider>
    </ThemeProvider>,
    document.querySelector('#root')
);
