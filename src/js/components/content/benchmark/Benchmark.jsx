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
import Button from '@material-ui/core/Button';
import CreateSubmissionForm from '../submission/CreateSubmissionForm.jsx';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ErrorMessage from '../../util/ErrorMessage';
import Grid from '@material-ui/core/Grid';
import Leaderboard from './Leaderboard.jsx';
import ReactMarkdown from 'react-markdown';
import Spinner from '../../util/Spinner.jsx';
import Submission from '../submission/Submission';
import Typography from '@material-ui/core/Typography';
import {
    deleteSubmission, dismissError, selectDialog
} from '../../../actions/Benchmark';
import {
    CREATE_SUBMISSION, DELETE_SUBMISSION, SHOW_INSTRUCTIONS, SHOW_LEADERBOARD,
    SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES
} from '../../../resources/Dialog';
import { isCriticalError, isMinorError } from '../../../resources/Error';


const useStyles = makeStyles(theme => ({
    benchmarkContent: {
        padding: theme.spacing(1)
    },
    benchmarkGrid: {
        marginTop: theme.spacing(1)
    },
    paperBlock: {
        marginTop: theme.spacing(0),
        padding: theme.spacing(0)
    },
    mainContent: {
        marginLeft: theme.spacing(8),
        marginRight: theme.spacing(8)
    }
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmark: state.benchmark,
        submission: state.submission
    };
};

function mapDispatchToProps(dispatch) {
  return {
      deleteSubmission: (api, benchmark, submission) => dispatch(
          deleteSubmission(api, benchmark, submission)
      ),
      dismissError: () => dispatch(dismissError()),
      selectDialog: (api, tabId, benchmark, submission) => dispatch(
          selectDialog(api, tabId, benchmark, submission)
      )
  };
}


function Benchmark(props) {
    const classes = useStyles();
    const {
        fetchError,
        isFetching,
        selectedBenchmark,
        selectedDialog
    } = props.benchmark;
    const selectedSubmission = props.submission.selectedSubmission;
    // ------------------------------------------------------------------------
    // Event handlers
    // ------------------------------------------------------------------------
    const handleDeleteCancel = () => {
        props.selectDialog(props.app, SHOW_RUNS);
    }
    const handleDeleteOk = () => {
        const selectedBenchmark = props.benchmark.selectedBenchmark;
        const selectedSubmission = props.submission.selectedSubmission;
        props.deleteSubmission(props.app, selectedBenchmark, selectedSubmission);
    }
    const handleDismissError = () => {
        props.dismissError();
    }
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    let content = null;
    if (isFetching) {
        // Show spinner while loading the benchmark listing.
        content = (<Spinner message='Loading benchmark ...' showLogo={true} />);
    } else if (isCriticalError(fetchError)) {
        content = (<ErrorMessage error={fetchError.error} isCritical={true} />);
    } else {
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
            case DELETE_SUBMISSION:
                content = (
                    <Dialog
                        disableBackdropClick
                        disableEscapeKeyDown
                        maxWidth="xs"
                        aria-labelledby="confirmation-dialog-title"
                        open={true}
                    >
                        <DialogTitle id="confirmation-dialog-title">Delete Submission</DialogTitle>
                        <DialogContent dividers>
                            <Typography>
                                {'Do you really want to delete submission ' + selectedSubmission.name + '?'}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleDeleteCancel} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleDeleteOk} color="primary">
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>
                );
                break;
            default:
                content = null;
        }
        // If the fect error is a minor error add the error message
        let minorError = null;
        if (isMinorError(fetchError)) {
            minorError = (
                <ErrorMessage
                    error={fetchError.error}
                    isCritical={false}
                    onClose={handleDismissError}
                />);
        }
        content = (
            <Grid container spacing={2} className={classes.benchmarkGrid}>
                <Grid item xs={3}>
                    <BenchmarkNavbar />
                </Grid>
                <Grid item xs={9} className={classes.benchmarkContent}>
                    <div>
                        { content }
                    </div>
                </Grid>
                { minorError }
            </Grid>
        );
    }
    return (
        <div className={classes.mainContent}>
            <Typography variant='h3'>
                { selectedBenchmark.name}
            </Typography>
            { content }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Benchmark);
