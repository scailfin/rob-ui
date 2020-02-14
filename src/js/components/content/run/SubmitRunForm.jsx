/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

/*
 * Render form to submit a new benchmark run.
 */


import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogHeader from '../DialogHeader';
import ErrorMessage from '../../util/ErrorMessage';
import FileInput from './FileInput';
import Paper from '@material-ui/core/Paper';
import ScalarInput from './ScalarInput';
import Spinner from '../../util/Spinner';
import { selectDialog } from '../../../actions/Benchmark';
import { dismissSubmitRunError, submitRun } from '../../../actions/RunListing';
import { SHOW_RUNS } from '../../../resources/Dialog';


// -- Component styles --------------------------------------------------------

const useStyles = makeStyles(theme => ({
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    paperForm: {
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#ebebeb'
    }
}));


// -- Mappings between global and component state -----------------------------

/*
 * The component requires access to the application state, the state of the
 * submitted run request, and the selected submission.
 */
const mapStateToProps = state => {
    return {
        app: state.app,
        submitRunForm: state.submitRunForm,
        submission: state.submission
    };
};


function mapDispatchToProps(dispatch) {
  return {
      dismissSubmitRunError: () => (dispatch(dismissSubmitRunError())),
      selectDialog: (api, dialogId, benchmark, submission) => (
          dispatch(selectDialog(api, dialogId, benchmark, submission))
      ),
      submitRun: (api, submission, data) => (
          dispatch(submitRun(api, submission, data))
      ),
  };
}


// -- Component ---------------------------------------------------------------

function SubmitRunForm(props) {
    const classes = useStyles();
    const submission = props.submission.selectedSubmission;
    const { isSubmitting, submitError } = props.submitRunForm;
    // -- Initialize local state ----------------------------------------------
    const defaultArgs = {};
    const { files, parameters } = submission;
    parameters.sort((p1, p2) => {
        if (p1.index === p2.index) {
            return (p1.name).localeCompare(p2.name);
        }
        return p1.index - p2.index;
    });
    parameters.forEach((p) => {
        let val = null;
        if (p.defaultValue != null) {
            if (p.datatype !== 'file') {
                val = p.defaultValue;
            } else if (p.as !== '$input') {
                val = {file: p.defaultValue, as: ''}
            } else {
                val = {file: '', as: p.defaultValue}
            }
        }
        defaultArgs[p.id] = val;
    });
    const [args, setArgs] = useState(defaultArgs);
    // Event handlers ---------------------------------------------------------
    /*
     * Dismiss the form
     */
    const handleCancel = () => {
        props.selectDialog(props.app, SHOW_RUNS);
    }
    /*
     * Handle changes in form controls.
     */
    const handleControlChange = (id, value) => {
        console.log(id + ' = ' + value)
        const modifiedArgs = {...args};
        modifiedArgs[id] = value;
        setArgs(modifiedArgs);
    }
    /*
     * Dismiss a submission error
     */
    const handleDismissError = () => {
        props.dismissSubmitRunError();
    }
    /*
     * Handle submission of new run for given ser of arguments
     */
    const handleSubmit = () => {
        // Convert argument list to (key, value) pair list.
        const runArgs = [];
        submission.parameters.forEach((p) => {
            const val = args[p.id];
            console.log(p.id + ' -> ' + val)
            if ((val != null) && (val !== '')) {
                const arg = {id: p.id};
                if (p.datatype === 'int') {
                    arg['value'] = parseInt(val, 10);
                } else if (p.datatype === 'decimal') {
                    arg['value'] = parseFloat(val);
                } else if (p.datatype === 'file') {
                    arg['value'] = val.file;
                    if (val.as !== '') {
                        arg['as'] = val.as
                    }
                } else {
                    arg['value'] = val;
                }
                runArgs.push(arg);
            }
        });
        props.submitRun(props.app, submission, {arguments: runArgs});
    }
    // Render -----------------------------------------------------------------
    if (isSubmitting) {
        // Show spinner if the run information is currently being submitted.
        return (
            <div className={classes.spinner}>
                <Spinner message='Submitting ...' showLogo={false}/>
            </div>
        );
    }
    // Show minor error message for submission errors
    let minorError = null;
    if (submitError) {
        minorError = (
            <ErrorMessage
                error={submitError}
                isCritical={false}
                onClose={handleDismissError}
            />
        );
    }
    const controls = [];
    parameters.forEach((p) => {
        if (p.datatype === 'file') {
            controls.push(
                <FileInput
                    key={p.id}
                    files={files}
                    onChange={handleControlChange}
                    para={p}
                    value={args[p.id]}
                />
            );
        } else {
            controls.push(
                <ScalarInput
                    key={p.id}
                    onChange={handleControlChange}
                    para={p}
                    value={args[p.id]}
                />
            );
        }
    });
    const dialogTitle = submission.name + ' - Submit New Run';
    return (
        <Paper className={classes.paperForm}>
            <div>
                <DialogHeader title={dialogTitle} onClose={handleCancel} />
                <div className={classes.form} noValidate>
                    { controls }
                </div>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    color="secondary"
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            </div>
            { minorError }
        </Paper>
    );
}

// -- Connect component to the Redux store ------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(SubmitRunForm);
