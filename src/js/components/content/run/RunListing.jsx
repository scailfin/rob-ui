/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) [2019-2020] NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import DialogHeader from '../DialogHeader.jsx';
import DirectionsRunOutlined from '@material-ui/icons/DirectionsRunOutlined';
import ErrorMessage from '../../util/ErrorMessage';
import ErrorOutlineOutlined from '@material-ui/icons/ErrorOutlineOutlined';
import Grid from '@material-ui/core/Grid';
import HourglassEmptyOutlined from '@material-ui/icons/HourglassEmptyOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Run from './Run';
import { dismissFetchRunsError, fetchRun, fetchRuns } from '../../../actions/Run';
import { utc2LocalTime } from '../../../resources/Timestamps';


// -- Component styles --------------------------------------------------------

const useStyles = makeStyles(theme => ({
    avatarPending: {
        backgroundColor: '#ffeb3b',
    },
    avatarRunning: {
        backgroundColor: '#03a9f4',
    },
    avatarError: {
        backgroundColor: '#dd2c00',
    },
    avatarSuccess: {
        backgroundColor: '#009688',
    },
    cellHeader: {
        paddingLeft: theme.spacing(1)
    },
    gridColumn: {
        backgroundColor: '#f0f0f0',
        marginTop: theme.spacing(2)
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
     }
}));


// -- Mappings between global and component state -----------------------------

/*
 * The component requires the application state to access the upload urls,
 * the selected submission, and the list of submission runs.
 */
const mapStateToProps = state => {
    return {
        app: state.app,
        run: state.run,
        runListing: state.runListing,
        submission: state.submission
    };
};


function mapDispatchToProps(dispatch) {
  return {
      dismissFetchError: () => (dispatch(dismissFetchRunsError())),
      fetchRuns: (api, submission, run) => (
          dispatch(fetchRuns(api, submission, run))
      ),
      selectRun: (api, runId) => (dispatch(fetchRun(api, runId)))
  };
}


// -- Component ---------------------------------------------------------------

function RunListing(props) {
    const classes = useStyles();
    const api = props.app;
    const {
        fetchError,
        pollInterval,
        runs
    } = props.runListing;
    const selectedRun = props.run.selectedRun;
    const selectedSubmission = props.submission.selectedSubmission;
    const poll = props.fetchRuns;
    // -- Set polling handler -------------------------------------------------
    useEffect(() => {
        let timer = null;
        if ((pollInterval > 0) && (selectedSubmission != null)) {
            timer = setInterval(() => (
                    poll(api, selectedSubmission, selectedRun)
                ),
                pollInterval
            );
        }
        return () => {
            if (timer != null) {
                clearInterval(timer);
            }
        };
    }, [api, selectedSubmission, selectedRun, pollInterval, poll]);
    // -- Event handlers ------------------------------------------------------
    const handleDismissFetchError = () => {
        props.dismissFetchError();
    }
    const handleSelectRun = (run) => {
        props.selectRun(props.app, run);
    }
    // Render -----------------------------------------------------------------
    // The selected item key depends on whether a run is currently selected or
    // not.
    let selectedItem = null;
    if (selectedRun != null) {
        selectedItem = selectedRun.id;
    }
    // Sort runs by decreasing start time
    runs.sort((a, b) => ((b.createdAt).localeCompare(a.createdAt)));
    let runListing = [];
    for (let i = 0; i < runs.length; i++) {
        const run = runs[i];
        let icon = null;
        let iconClass = null;
        if (run.state === 'SUCCESS') {
            icon = (<CheckCircleOutline />);
            iconClass = classes.avatarSuccess;
        } else if ((run.state === 'CANCELED') || (run.state === 'ERROR')) {
            icon = (<ErrorOutlineOutlined />);
            iconClass = classes.avatarError;
        } else if (run.state === 'RUNNING') {
            icon = (<DirectionsRunOutlined />);
            iconClass = classes.avatarRunning;
        } else {
            icon = (<HourglassEmptyOutlined />);
            iconClass = classes.avatarPending;
        }
        runListing.push(
            <ListItem
                key={run.id}
                button
                selected={run.id === selectedItem}
                onClick={() => (handleSelectRun(run))}
            >
                <ListItemAvatar>
                    <Avatar className={iconClass}>
                        {icon}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={run.id.substring(0,8)}
                    secondary={utc2LocalTime(run.createdAt)}
                />
            </ListItem>
        );
    }
    // Show minor error message for fetch errors
    let minorError = null;
    if (fetchError != null) {
        minorError = (
            <ErrorMessage
                error={fetchError}
                isCritical={false}
                onClose={handleDismissFetchError}
            />
        );
    }
    return (
        <Box border={1} className={classes.paperForm}>
            <DialogHeader title={selectedSubmission.name + ' - Runs'} />
            <Grid container spacing={2}>
                <Grid item xs={6} className={classes.gridColumn}>
                    <Box>
                        <List component="nav" className={classes.root}>
                            { runListing }
                        </List>
                    </Box>
                </Grid>
                <Grid item xs={6} className={classes.gridColumn}>
                    <Run />
                </Grid>
            </Grid>
            { minorError }
        </Box>
    );
}

// -- Connect component to the Redux store ------------------------------------

export default connect(mapStateToProps, mapDispatchToProps)(RunListing);
