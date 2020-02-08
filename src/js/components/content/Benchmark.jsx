/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Leaderboard from './Leaderboard.jsx';
import Paper from '@material-ui/core/Paper';
import ReactMarkdown from 'react-markdown';
import SubmissionPanel from './submission/SubmissionPanel.jsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { selectTab } from '../../actions/Benchmark';
import { createSubmission } from '../../actions/Submission';



const useStyles = makeStyles(theme => ({
    paperBlock: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2)
    },
    instructions: {
        marginTop: theme.spacing(4)
    }
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        mainPanel: state.mainPanel,
        submissions: state.submissions
    };
};


function mapDispatchToProps(dispatch) {
  return {
      createSubmission: (url, name) => dispatch(createSubmission(url, name)),
      selectTab: (api, benchmark, tabId) => dispatch(
          selectTab(api, benchmark, tabId)
      )
  };
}


function Benchmark(props) {
    const classes = useStyles();
    const { selectedBenchmark, selectedTab } = props.mainPanel;
    /**
     * Change handler to display a different tab.
     */
    const handleTabChange = (event, newValue) => {
        props.selectTab(props.app, selectedBenchmark, newValue);
    };
    // -- Main Content (render) -----------------------------------------------
    let content = null;
    if (selectedTab === 0) {
        // -- Overview --------------------------------------------------------
        content = (
            <Paper className={classes.paperBlock}>
                <ReactMarkdown source={selectedBenchmark.instructions} />
            </Paper>
        );
    } else if (selectedTab === 1) {
        // -- Current Results -------------------------------------------------
        content = (<Leaderboard />);
    } else if (selectedTab === 2) {
        // -- My Submissions --------------------------------------------------
        content = (<SubmissionPanel />);
    }
    return (
        <div className={classes.paper}>
            <Typography variant='h4'>
                {selectedBenchmark.description}
            </Typography>
            <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
            >
                <Tab label="Overview" />
                <Tab label="Current Results" />
                <Tab label="My Submissions" />
            </Tabs>
            { content }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Benchmark);
