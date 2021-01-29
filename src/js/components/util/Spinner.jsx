/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019-2021 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import logo from '../../../assets/rob-logo.png'


// Use higher-order component API to create styles for the logo
const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    spinner: {
        marginTop: theme.spacing(2)
    }
}));


function Spinner(props) {
    const classes = useStyles();
    const { message, showLogo } = props;
    // Show the ROB logo if the flag is true
    let robLogo = null;
    if (showLogo === true) {
        robLogo = (
            <div className={classes.paper}>
                <img src={logo} alt={'Reproducible Open Benchmarks'} />
            </div>
        );
    }
    // Display the message above the progress bar (if given).
    let progressHeader = null;
    if (message != null) {
        progressHeader = (
            <Typography variant="overline">
                { message }
            </Typography>
        );
    }
    return (
        <Container component="main" maxWidth="xs">
            { robLogo }
            { progressHeader }
            <div className={classes.spinner}>
                <LinearProgress color='secondary'/>
            </div>
        </Container>
    );
}

Spinner.propTypes = {
    message: PropTypes.string,
    showLogo: PropTypes.bool
}

export default Spinner;
