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
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { createSubmission, selectDialog } from '../../actions/Submission';
import { SHOW_RUNS } from '../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    paperForm: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#ebebeb'
    }
}));


const mapStateToProps = state => {
    return {
        mainPanel: state.mainPanel
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectDialog: (dialogId) => dispatch(selectDialog(dialogId)),
      createSubmission: (url, name) => dispatch(createSubmission(url, name))
  };
}


function CreateSubmissionForm(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        submissionName: ''
    });
    const benchmark = props.mainPanel.selectedBenchmark;
    const submissionName = values.submissionName;
    /**
     * Handle changes in the submision name input field.
     */
    const handleSubmissionChanges = (event) => {
        setValues({...values, submissionName: event.target.value});
    }
    /**
     * Event handler for the submit button that creates a new submission for
     * the benchmark.
     */
    const handleSubmissionSubmit = () => {
        const url = benchmark.urls.get('submissions:create')
        props.createSubmission(url, submissionName);
        setValues({open: false, submissionName: ''});
    }
    return (
        <Paper className={classes.paperForm}>
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
                    onClick={() => (props.selectDialog(SHOW_RUNS))}
                >
                    Cancel
                </Button>
            </div>
        </Paper>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateSubmissionForm);
