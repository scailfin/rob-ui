/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import ApiPolling from './ApiPolling';
import Avatar from '@material-ui/core/Avatar';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import DirectionsRunOutlined from '@material-ui/icons/DirectionsRunOutlined';
import Divider from '@material-ui/core/Divider';
import ErrorOutlineOutlined from '@material-ui/icons/ErrorOutlineOutlined';
import FileListing from './FileListing';
import HourglassEmptyOutlined from '@material-ui/icons/HourglassEmptyOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import { utc2LocalTime } from '../../resources/Timestamps';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowX: 'auto',
  },
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


function RunListing(props) {
    const classes = useStyles();
    const {
        content,
        contentId,
        onCancel,
        onDownload,
        onPoll,
        runs,
        submission
    } = props;
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
        let startedAt = null;
        if (run.createdAt != null) {
            startedAt = 'Started at ' + utc2LocalTime(run.createdAt);
        } else {
            startedAt = 'Pending';
        }
        let finishedAt = null;
        if (run.finishedAt != null) {
            finishedAt = 'Finished at ' + utc2LocalTime(run.finishedAt);
        }
        runListing.push(
            <ListItem key={run.id}>
                <ListItemAvatar>
                    <Avatar className={iconClass}>
                        {icon}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={startedAt} secondary={finishedAt} />
            </ListItem>
        );
        const inputList = [];
        for (let j = 0; j < run.arguments.length; j++) {
            const arg = run.arguments[j];
            const argId = arg.id;
            const para = submission.parameters.find((p) => (p.id === argId));
            let argValue = arg.value;
            if (argValue.fileHandle != null) {
                argValue = argValue.fileHandle.filename;
            }
            inputList.push(
                <Typography key={argId}>
                    <span className={classes.highlight}>{para.name}</span>{':  '}{argValue}
                </Typography>
            );
        }
        runListing.push(
            <div key={'input-' + run.id} className={classes.inputs}>
                <Typography variant='subtitle1' className={classes.subtitle}>Inputs</Typography>
                {inputList}
            </div>
        );
        if ((run.state === 'SUCCESS') && (run.resources != null)) {
            runListing.push(
                <div key={'output-' + run.id} className={classes.outputs}>
                    <Typography variant='subtitle1' className={classes.subtitle}>Outputs</Typography>
                    <FileListing

                        content={content}
                        contentId={contentId}
                        files={run.resources}
                        onDownload={onDownload}
                    />
                </div>
            )
        } else if (run.state === 'RUNNING') {
            runListing.push(
                <div key='cancelButton' className={classes.inputs}>
                    <ApiPolling
                        interval={1000}
                        onCancel={onCancel}
                        onFetch={onPoll}
                        run={run}
                    />
                </div>
            );
        } else if (run.messages != null) {
            if (run.messages.length > 0) {
                runListing.push(
                    <div key={'messages-' + run.id} className={classes.outputs}>
                        <Typography variant='subtitle1' className={classes.subtitle}>Messages</Typography>
                        <pre className={classes.errorText}>
                            {run.messages.join('\n')}
                        </pre>
                    </div>
                );
            }
        }
        if (i < runs.length - 1) {
            runListing.push(<Divider key={'divider-' + i} />);
        }
    }
   return (
    <div className={classes.root}>
        <List>
        {runListing}
        </List>
    </div>
  );
}


RunListing.propTypes = {
    contentId: PropTypes.string,
    content: PropTypes.string,
    onCancel: PropTypes.func.isRequired,
    onDownload: PropTypes.func.isRequired,
    onPoll: PropTypes.func.isRequired,
    runs: PropTypes.array.isRequired,
    submission: PropTypes.object.isRequired
}


export default RunListing;
