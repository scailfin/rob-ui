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
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FileInput from './FileInput';
import Paper from '@material-ui/core/Paper';
import ScalarInput from './ScalarInput';


const useStyles = makeStyles(theme => ({
    paperForm: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#ebebeb'
    }
}));


function SubmitForm(props) {
    const classes = useStyles();
    const { onSubmit, submission } = props;
    // Create object with default arguments
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
    /**
     * Handle changes in form controls.
     */
    const handleControlChange = (id, value) => {
        const modifiedArgs = {...args};
        modifiedArgs[id] = value;
        setArgs(modifiedArgs);
    }
    /**
     * Handler for form submission.
     */
    const handleSubmit = () => {
        onSubmit(args);
    }
    // Create list of form controls
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
    return (
        <Paper className={classes.paperForm}>
            <div>
                <div className={classes.form} noValidate>
                    { controls }
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => (alert('Cancel'))}
                >
                    Cancel
                </Button>
            </div>
        </Paper>
    );
}

SubmitForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    submission: PropTypes.object.isRequired
}

export default SubmitForm;
