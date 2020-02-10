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
import BenchmarkNavbar from './BenchmarkNavbar';
import CreateSubmissionForm from '../submission/CreateSubmissionForm.jsx';
import Grid from '@material-ui/core/Grid';
import Leaderboard from './Leaderboard.jsx';
import ReactMarkdown from 'react-markdown';
import Submission from '../submission/Submission';
import Typography from '@material-ui/core/Typography';
import {
    CREATE_SUBMISSION, SHOW_INSTRUCTIONS, SHOW_LEADERBOARD, SHOW_RUNS,
    SUBMIT_RUN, UPLOAD_FILES
} from '../../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    benchmarkContent: {
        marginLeft: theme.spacing(8),
        marginRight: theme.spacing(8)
    },
    paperBlock: {
        marginTop: theme.spacing(0),
        padding: theme.spacing(0)
    },
    instructions: {
        marginTop: theme.spacing(4)
    }
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmarks: state.benchmarks
    };
};


function Benchmark(props) {
    const classes = useStyles();
    const { selectedBenchmark, selectedDialog } = props.benchmarks;
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    let content = null;
    switch (selectedDialog) {
        case SHOW_INSTRUCTIONS:
            // -- Overview ----------------------------------------------------
            content = (
                <div className={classes.paperBlock}>
                    <ReactMarkdown source={selectedBenchmark.instructions} />
                </div>
            );
            break;
        case SHOW_LEADERBOARD:
            // -- Current Results ---------------------------------------------
            content = (<Leaderboard />);
            break;
        case CREATE_SUBMISSION:
            // -- My Submissions ----------------------------------------------
            content = (<CreateSubmissionForm />);
            break;
        case SHOW_RUNS:
        case SUBMIT_RUN:
        case UPLOAD_FILES:
            // -- Submission --------------------------------------------------
            content = (<Submission />);
            break;
        default:
            content = null;
    }
    let errorMessage = null;
    return (
        <div className={classes.benchmarkContent}>
            <Typography variant='h3'>
                { selectedBenchmark.name}
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <BenchmarkNavbar />
                </Grid>
                <Grid item xs={9}>
                    <div>
                        { content }
                    </div>
                </Grid>
                { errorMessage }
            </Grid>
        </div>
    );
}

export default connect(mapStateToProps)(Benchmark);
