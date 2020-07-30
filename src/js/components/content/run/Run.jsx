/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019-2020 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import ErrorMessage from '../../util/ErrorMessage';
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemAvatar';
import Spinner from '../../util/Spinner';
import Typography from '@material-ui/core/Typography';
import { cancelRun, dismissFetchRunError } from '../../../actions/Run';
import { utc2LocalTime } from '../../../resources/Timestamps';


// -- Component styles --------------------------------------------------------

const useStyles = makeStyles(theme => ({
    cancelButton: {
        marginTop: theme.spacing(2)
    },
    content: {
        borderColor: '#cecece',
        paddingLeft: theme.spacing(2)
    },
    highlight: {
        fontWeight: 'bold'
    },
    inputs: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    outputs: {
        marginLeft: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    subtitle: {
        marginTop: theme.spacing(2),
        textDecoration: 'underline'
    },
    errorText: {
        color: '#912d2b',
        fontSize: '1.2em'
    }
}));


// -- Mappings between global and component state -----------------------------

/*
 * The component requires the application state to access the upload urls, and
 * the selected run handle.
 */
const mapStateToProps = state => {
    return {
        app: state.app,
        run: state.run,
        submission: state.submission
    };
};


function mapDispatchToProps(dispatch) {
    return {
        cancelRun: (api, submission, run) => (
            dispatch(cancelRun(api, submission, run))
        ),
        dismissError: () => (dispatch(dismissFetchRunError()))
  };
}


// -- Component ---------------------------------------------------------------

function Run(props) {
    const classes = useStyles();
    const { fetchError, isFetching, selectedRun } = props.run;
    // -- Event handler -------------------------------------------------------
    const handleCancelRun = () => {
        const selectedSubmission = props.submission.selectedSubmission;
        props.cancelRun(props.app, selectedSubmission, selectedRun);
    }
    const handleDismissError = () => {
        props.dismissError();
    }
    const handleDownload = (fileId) => {
        const urls = props.app.urls;
        const url = urls.downloadRunFile(selectedRun.id, fileId);
        window.location.href = url;
    }
    // -- Render --------------------------------------------------------------
    if (isFetching) {
        // Show spinner if the run information is currently being loaded.
        return (
            <div className={classes.spinner}>
                <Spinner message='Loading run ...' showLogo={false}/>
            </div>
        );
    }
    let content = null;
    if (selectedRun != null) {
        // Timestamps
        const timestamps = [];
        timestamps.push(
            <Typography key='createdAt'>
                <span className={classes.highlight}>{'Created at: '}</span>
                {utc2LocalTime(selectedRun.createdAt)}
            </Typography>
        );
        if (selectedRun.startedAt != null) {
            timestamps.push(
                <Typography key='startedAt'>
                    <span className={classes.highlight}>{'Started at: '}</span>
                    {utc2LocalTime(selectedRun.startedAt)}
                </Typography>
            );
        }
        if (selectedRun.finishedAt != null) {
            timestamps.push(
                <Typography key='finishedAt'>
                    <span className={classes.highlight}>{'Finished at: '}</span>
                    {utc2LocalTime(selectedRun.finishedAt)}
                </Typography>
            );
        }
        // Input arguments
        let runInputs = null;
        const inputList = [];
        for (let j = 0; j < selectedRun.arguments.length; j++) {
            const arg = selectedRun.arguments[j];
            const argId = arg.id;
            const para = selectedRun.parameters.find((p) => (p.id === argId));
            let argValue = arg.value;
            if (para.type === 'file') {
                argValue = argValue.value.targetPath;
            }
            inputList.push(
                <Typography key={argId}>
                    <span className={classes.highlight}>{para.name}</span>{':  ' + argValue}
                </Typography>
            );
        }
        runInputs = (
            <div>
                <Typography variant='subtitle1' className={classes.subtitle}>
                    Inputs
                </Typography>
                {inputList}
            </div>
        );
        // Run outputs
        let runOutputs = null;
        if ((selectedRun.state === 'ERROR') || (selectedRun.state === 'CANCELED')) {
            runOutputs = (
                <div>
                    <pre className={classes.errorText}>
                        {selectedRun.messages.join('\n')}
                    </pre>
                </div>
            );
        } else if ((selectedRun.state === 'PENDING') || (selectedRun.state === 'RUNNING')) {
            runOutputs = (
                <div className={classes.cancelButton}>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => (handleCancelRun())}
                    >
                        Cancel
                    </Button>
                </div>
            );
        } else if (selectedRun.state === 'SUCCESS') {
            const items = [];
            for (let i = 0; i < selectedRun.files.length; i++) {
                const fh = selectedRun.files[i];
                items.push(
                    <ListItem
                        key={fh.id}
                        button
                        onClick={() => (handleDownload(fh.id))}
                    >
                        <ListItemIcon>
                            <DescriptionOutlined />
                        </ListItemIcon>
                        <ListItemText
                            primary={fh.name}
                        />
                    </ListItem>
                );
            }
            runOutputs = (
                <div>
                    <Typography variant='subtitle1' className={classes.subtitle}>
                        Outputs
                    </Typography>
                    <List component="nav" className={classes.root}>
                        {items}
                    </List>
                </div>
            );
        }
        content = (
            <div>
                <Typography variant='h6'>{selectedRun.state}</Typography>
                { timestamps }
                { runInputs }
                { runOutputs }
            </div>
        );
    }
    // If there is an error display it as a minor error
    let minorError = null;
    if (fetchError != null) {
        minorError = (
            <ErrorMessage
                error={fetchError}
                isCritical={false}
                onClose={handleDismissError}
            />
        );
    }
    return (
        <Box className={classes.content} borderLeft={1}>
            { content }
            { minorError }
        </Box>
    );
}

// -- Connect component to the Redux store ------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(Run);
