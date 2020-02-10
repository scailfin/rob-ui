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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { selectBenchmark } from '../../../actions/Benchmark';


const useStyles = makeStyles(theme => ({
    avatarBenchmark: {
        margin: theme.spacing(1),
        backgroundColor: '#3f51b5',
    },
    contentPanel: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2)
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
      selectBenchmark: (api, benchmark) => dispatch(
          selectBenchmark(api, benchmark)
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
    /**
     * Event handler to set the selected benchmark.
     */
    const handleBenchmarkSelect = (key) => {
        const benchmarks = props.benchmarks.benchmarks;
        const benchmark = benchmarks.find((b) => (b.id === key));
        props.selectBenchmark(props.app, benchmark);
    }
    const benchmarks = props.benchmarks.benchmarks;
    // -- Render benchmark listing (only if list of benchmarks is defined) ----
    let content = null;
    if (benchmarks != null) {
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
            <div>
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
