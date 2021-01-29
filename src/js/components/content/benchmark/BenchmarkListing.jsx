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
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import Assessment from '@material-ui/icons/Assessment';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import ErrorMessage from '../../util/ErrorMessage';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Spinner from '../../util/Spinner.jsx';
import Typography from '@material-ui/core/Typography';
import { fetchBenchmark } from '../../../actions/Benchmark';


const useStyles = makeStyles(theme => ({
    avatarBenchmark: {
        margin: theme.spacing(1),
        backgroundColor: '#3f51b5',
    },
    contentPanel: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
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
            backgroundColor: "#dff0ff",
            "&$selected": {
                backgroundColor: "#dff0ff"
            }
        }
    },
    selected: {}
})(ListItem);


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmarkListing: state.benchmarkListing
    };
};


function mapDispatchToProps(dispatch) {
  return {
      fetchBenchmark: (api, benchmark) => dispatch(
          fetchBenchmark(api, benchmark)
      )
  };
}


/**
 * Main application panel. the content of the panel depends on whether a
 * benchmark is currently being selected or not. If no benchmark is selected
 * a list of available benchmarks is shown. If a benchmark is selected, the
 * benchmark panel is being rendered, instead.
 */
function BenchmarkListing(props) {
    const classes = useStyles();
    // ------------------------------------------------------------------------
    // Event handlers
    // ------------------------------------------------------------------------
    /*
     * Event handler to set the selected benchmark.
     */
    const handleBenchmarkSelect = (key) => {
        const benchmarks = props.benchmarkListing.benchmarks;
        const benchmark = benchmarks.find((b) => (b.id === key));
        props.fetchBenchmark(props.app, benchmark);
    }
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    const { benchmarks, fetchError, isFetching } = props.benchmarkListing;
    // -- Render benchmark listing (only if list of benchmarks is defined) ----
    let content = null;
    if (isFetching) {
        // Show spinner while loading the benchmark listing.
        content = (<Spinner message='Loading benchmarks ...' showLogo={true} />);
    } else if (fetchError) {
        content = (<ErrorMessage error={fetchError} isCritical={true} />);
    } else if (benchmarks != null) {
        // If no benchmark is selected, a brief overview of ROB is shown
        // together with a list of available benchmarks.
        const benchmarklistItems = [];
        benchmarks.sort((a, b) => ((a.name).localeCompare(b.name)));
        for (let i = 0; i < benchmarks.length; i++) {
            const bm = benchmarks[i];
            benchmarklistItems.push(
                <StyledBenchmark
                    key={bm.id}
                    button
                    onClick={() => (handleBenchmarkSelect(bm.id))}
                >
                    <ListItemAvatar>
                        <Avatar className={classes.avatarBenchmark}>
                            <Assessment />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={bm.name} secondary={bm.description} />
                </StyledBenchmark>
            );
        }
        content = (
            <div className={classes.mainContent}>
                <Typography className={classes.contentPanel} variant='body1'>
                    The <span className={classes.highlight}>Reproducible Open Benchmarks for Data Analysis Platform (ROB)</span> is an experimental prototype for enabling community benchmarks of data analysis algorithms. The goal of ROB is to allow user communities to evaluate the performance of their different data analysis algorithms in a controlled competition-style format.
                </Typography>
                <Divider />
                <Typography className={classes.contentPanel} variant="h4">
                    Participate in Community Benchmarks
                </Typography>
                <List component="nav" className={classes.root}>
                    {benchmarklistItems}
                </List>
            </div>
        );
    }
    return content;
}

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarkListing);
