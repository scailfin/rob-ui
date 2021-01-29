/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019-2021 NYU.
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
import Box from '@material-ui/core/Box';
import DialogHeader from '../DialogHeader';
import ErrorMessage from '../../util/ErrorMessage';
import FileInput from './FileInput';
import ScalarInput from './ScalarInput';
import Spinner from '../../util/Spinner';
import Typography from '@material-ui/core/Typography';
import { selectDialog } from '../../../actions/Benchmark';
import { dismissSubmitRunError, submitRun } from '../../../actions/Run';
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
        backgroundColor: '#f0f0f0',
        borderColor: '#a0a0a0',
        borderRadius: 4
    },
    module: {
        backgroundColor: '#fcfcfc',
        borderRadius: 4,
        padding: theme.spacing(1),
        marginBottom: theme.spacing(2)
    }
}));


// -- Mappings between global and component state -----------------------------

/*
 * The component requires access to the application state, the state of the
 * submitted run request, the list of uploaded files, and the selected
 * submission.
 */
const mapStateToProps = state => {
    return {
        app: state.app,
        benchmark: state.benchmark,
        fileUploads: state.fileUploads,
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
    const benchmark = props.benchmark.selectedBenchmark;
    const submission = props.submission.selectedSubmission;
    const files = props.fileUploads.files;
    const { isSubmitting, submitError } = props.submitRunForm;
    // -- Initialize local state ----------------------------------------------
    const defaultArgs = {};
    const { parameters } = submission;
    parameters.sort((p1, p2) => {
        if (p1.index === p2.index) {
            return (p1.name).localeCompare(p2.name);
        }
        return p1.index - p2.index;
    });
    parameters.forEach((p) => {
        let val = null;
        if (p.defaultValue != null) {
            if (p.dtype === 'file') {
                val = {file: '', target: p.target};
            } else {
                val = p.defaultValue;
            }
        }
        defaultArgs[p.name] = val;
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
            const val = args[p.name];
            if ((val != null) && (val !== '')) {
                const arg = {name: p.name};
                if ((val === '-inf') || (val === 'inf')) {
                    arg['value'] = val;
                } else if (p.dtype === 'int') {
                    arg['value'] = parseInt(val, 10);
                } else if (p.dtype === 'decimal') {
                    arg['value'] = parseFloat(val);
                } else if (p.dtype === 'file') {
                    const fileRef = {fileId: val.file};
                    if ((val.target != null) && (val.target !== '')) {
                        fileRef['targetPath'] = val.target
                    }
                    arg['value'] = {type: '$file', value: fileRef};
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
    // Render controls for workflow template parameters.
    const controls = [];
    let modules = null;
    if (benchmark.modules != null) {
        benchmark.modules.sort((m1, m2) => (m1.index - m2.index));
        modules = {};
        for (let i = 0; i < benchmark.modules.length; i++) {
            modules[benchmark.modules[i].id] = [];
        }
    }
    parameters.forEach((p) => {
        let cntrl = null;
        if (p.dtype === 'file') {
            cntrl = (
                <FileInput
                    key={p.name}
                    files={files}
                    onChange={handleControlChange}
                    para={p}
                    value={args[p.name]}
                />
            );
        } else {
            cntrl = (
                <ScalarInput
                    key={p.name}
                    onChange={handleControlChange}
                    para={p}
                    value={args[p.name]}
                />
            );
        }
        if (p.module != null) {
            modules[p.module].push(cntrl);
        } else {
            controls.push(cntrl);
        }
    });
    const controlPanels = [];
    if (benchmark.modules != null) {
        for (let i = 0; i < benchmark.modules.length; i++) {
            const module = benchmark.modules[i];
            const moduleCntrls = modules[module.id];
            if (moduleCntrls.length > 0) {
                controlPanels.push(
                    <Box key={module.id} className={classes.module}>
                        <Typography variant='subtitle1'>
                            {module.name}
                        </Typography>
                        { moduleCntrls }
                    </Box>
                );
            }
        }
    }
    if (controls.length > 0) {
        controlPanels.push(
            <Box key={'_controls'} className={classes.form} noValidate>
                { controls }
            </Box>
        );
    }
    const dialogTitle = submission.name + ' - Submit New Run';
    return (
        <Box border={1} className={classes.paperForm}>
            <div>
                <DialogHeader title={dialogTitle} onClose={handleCancel} />
                { controlPanels }
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
        </Box>
    );
}

// -- Connect component to the Redux store ------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(SubmitRunForm);
