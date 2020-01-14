/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Leaderboard from './Leaderboard.jsx';
import Submission from './Submission.jsx';
import SubmissionList from './SubmissionList.jsx';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { createSubmission } from '../../actions/Submission';



const useStyles = makeStyles(theme => ({
    paperForm: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#ebebeb'
    },
    instructions: {
        marginTop: theme.spacing(4)
    }
}));


const mapStateToProps = state => {
    return {
        mainPanel: state.mainPanel
    };
};


function mapDispatchToProps(dispatch) {
  return {
      createSubmission: (url, name) => dispatch(createSubmission(url, name))
  };
}


function Benchmark(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        selectedTab: 0
    });
    const selectedBenchmark = props.mainPanel.selectedBenchmark;
    const selectedTab = values.selectedTab;
    /**
     * Change handler to display a different tab.
     */
    const handleTabChange = (event, newValue) => {
        setValues({...values, selectedTab: newValue});
    };
    let content = null;
    if (selectedTab === 0) {
        // -- Overview --------------------------------------------------------
        const instructions = {__html: selectedBenchmark.instructions}
        content = (
            <div>
                <div
                    className={classes.instructions}
                    dangerouslySetInnerHTML={instructions}
                />
            </div>
        );
    } else if (selectedTab === 1) {
        // -- Current Results -------------------------------------------------
        content = (<Leaderboard leaderboard={selectedBenchmark.leaderboard}/>);
    } else if (selectedTab === 2) {
        // -- My Submissions --------------------------------------------------
        content = (
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <SubmissionList />
                </Grid>
                <Grid item xs={9}>
                    <div  className={classes.mainContent}>
                        <Submission />
                    </div>
                </Grid>
            </Grid>
        );

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
