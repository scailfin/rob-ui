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
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import Assessment from '@material-ui/icons/Assessment';
import Avatar from '@material-ui/core/Avatar';
import Benchmark from './benchmark/Benchmark.jsx'
import BenchmarkListing from './benchmark/BenchmarkListing.jsx'
import Divider from '@material-ui/core/Divider';
import ErrorMessage from '../util/ErrorMessage';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Spinner from '../util/Spinner.jsx';
import Typography from '@material-ui/core/Typography';
import { selectBenchmark } from '../../actions/Benchmark';


const useStyles = makeStyles(theme => ({
    avatarBenchmark: {
        margin: theme.spacing(1),
        backgroundColor: '#3f51b5',
    },
    contentPanel: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
    },
    highlight: {
        fontWeight: "bold",
    },
    secondHeader: {
        marginTop: theme.spacing(2),
    },
    spinner: {
        marginTop: theme.spacing(12)
    },
    noSubmissions: {
        marginTop: theme.spacing(4),
        color:  'textSecondary'
    },
    mainContent: {
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 1000
    }
}));


//
// Based on https://github.com/mui-org/material-ui/issues/13672
//
const StyledBenchmark = withStyles({
    root: {
        backgroundColor: "inherit",
        "&$selected": {
            backgroundColor: "#e8eaf6"
        },
        '&:hover': {
            backgroundColor: "#c5cae9",
            "&$selected": {
                backgroundColor: "#c5cae9"
            }
        }
    },
    selected: {}
})(ListItem);


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmarks: state.benchmarks
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectBenchmark: (benchmark) => dispatch(selectBenchmark(benchmark))
  };
}


/*
 * Main application panel. the content of the panel depends on whether a
 * benchmark is currently being selected or not. If no benchmark is selected
 * a list of available benchmarks is shown. If a benchmark is selected, the
 * benchmark panel is being rendered, instead.
 */
function MainPanel(props) {
    const classes = useStyles();
    /**
     * Event handler to set the selected benchmark.
     */
    const handleBenchmarkSelect = (key) => {
        const benchmarks = props.mainPanel.benchmarks;
        const benchmark = benchmarks.find((b) => (b.id === key));
        props.selectBenchmark(benchmark);
    }
    const {
        benchmarks,
        fetchError,
        isFetching,
        selectedBenchmark
    } = props.benchmarks;
    // The main content depends on whether the benchmark and submission data
    // has already been loaded and on whether there is a benchmark that has
    // been selected by the user as the current benchmark.
    let content = null;
    if ((isFetching) && (benchmarks == null)) {
        // Show spinner while loading the benchmark listing.
        content = (<Spinner message='Loading benchmarks ...' showLogo={true} />);
    } else if ((isFetching) && (benchmarks != null)) {
        // Show spinner while loading the benchmark handle.
        content = (<Spinner message='Loading benchmark ...' showLogo={true} />);
    } else if (fetchError) {
        content = (<ErrorMessage error={fetchError} isCritical={true} />);
    } else if (selectedBenchmark != null) {
        // Return immediately to avoid showing the ROB overview header.
        return (<Benchmark />);
    } else if (benchmarks != null) {
        content = (<BenchmarkListing />);
    }
    return (
        <div  className={classes.mainContent}>
            <Typography className={classes.contentPanel} variant='body1'>
                The <span className={classes.highlight}>Reproducible Open Benchmarks for Data Analysis Platform (ROB)</span> is an experimental prototype for enabling community benchmarks of data analysis algorithms. The goal of ROB is to allow user communities to evaluate the performance of their different data analysis algorithms in a controlled competition-style format.
            </Typography>
            <Divider />
            { content }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel);
