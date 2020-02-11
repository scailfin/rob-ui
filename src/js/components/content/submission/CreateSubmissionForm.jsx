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
import Button from '@material-ui/core/Button';
import DialogHeader from '../DialogHeader';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { createSubmission, selectDialog } from '../../../actions/Benchmark';
import { SHOW_INSTRUCTIONS, SHOW_RUNS } from '../../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    paperForm: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#ebebeb'
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
      selectDialog: (api, dialogId, benchmark) => dispatch(
          selectDialog(api, dialogId, benchmark)
      ),
      createSubmission: (api, benchmark, name) => dispatch(
          createSubmission(api, benchmark, name)
      )
  };
}


function CreateSubmissionForm(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        submissionName: ''
    });
    const selectedBenchmark = props.benchmark.selectedBenchmark;
    const submissionName = values.submissionName;
    // ------------------------------------------------------------------------
    // Event handlers
    // ------------------------------------------------------------------------
    /*
     * Show instructions information if the user canceles the create submission
     * action.
     */
    const handleCancel = () => {
        const selectedBenchmark = props.benchmark.selectedBenchmark;
        const selectedSubmission = props.submission.selectedSubmission;
        if (selectedSubmission != null) {
            props.selectDialog(props.app, SHOW_RUNS, selectedBenchmark);
        } else {
            props.selectDialog(props.app, SHOW_INSTRUCTIONS, selectedBenchmark);
        }
    }
    /*
     * Handle changes in the submision name input field.
     */
    const handleSubmissionChanges = (event) => {
        setValues({...values, submissionName: event.target.value});
    }
    /*
     * Event handler for the submit button that creates a new submission for
     * the benchmark.
     */
    const handleSubmissionSubmit = () => {
        const app = props.app;
        props.createSubmission(app, selectedBenchmark, submissionName);
        setValues({open: false, submissionName: ''});
    }
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    return (
        <Paper className={classes.paperForm}>
            <DialogHeader
                title={'Create Sumission ...'}
                onClose={handleCancel}
            />
            <div className={classes.form} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="submissionName"
                    label="Submission Name"
                    name="submissionName"
                    value={submissionName}
                    onChange={handleSubmissionChanges}
                    autoFocus
                />
            </div>
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmissionSubmit}
                >
                    Submit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </div>
        </Paper>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubmissionForm);
