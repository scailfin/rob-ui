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
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LogoutMenu from './LogoutMenu';
import logo from '../../../assets/rob-ui-header.png'


// Use higher-order component API to create styles for the logo
const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    logoDiv: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
}));


function Topbar(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        <img src={logo} alt={'Reproducible Open Benchmarks'}/>
                    </Typography>
                    <LogoutMenu />
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Topbar;
