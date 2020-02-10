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
import ApiPolling from '../ApiPolling';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CheckCircleOutline from '@material-ui/icons/CheckCircleOutline';
import DirectionsRunOutlined from '@material-ui/icons/DirectionsRunOutlined';
import Divider from '@material-ui/core/Divider';
import ErrorMessage from '../../util/ErrorMessage';
import ErrorOutlineOutlined from '@material-ui/icons/ErrorOutlineOutlined';
import FileListing from '../FileListing';
import HourglassEmptyOutlined from '@material-ui/icons/HourglassEmptyOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Spinner from '../../util/Spinner';
import Typography from '@material-ui/core/Typography';
import { utc2LocalTime } from '../../../resources/Timestamps';


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


const mapStateToProps = state => {
    return {
        runListing: state.runListing
    };
};


/*function mapDispatchToProps(dispatch) {
  return {
      uploadFile: (url, submission, file) => (
          dispatch(
              uploadFile(url, submission, file)
          )
      ),
      downloadResource: (url, submission, type) => (
          dispatch(
              downloadResource(url, submission, type)
          )
      ),
      cancelRun: (url, submission) => (dispatch(cancelRun(url, submission))),
      getRun: (url, submission) => (dispatch(getRun(url, submission))),
      selectDialog: (dialogId) => dispatch(selectDialog(dialogId)),
      submitRun: (url, data, submission) => (dispatch(submitRun(url, data, submission)))
  };
}*/


function RunListing(props) {
    const classes = useStyles();
    const { fetchError, isFetching, runs } = props.runListing;
    if (isFetching) {
        return (
            <Spinner
                message={'Loading submission runs ...'}
                showLogo={false}
            />
        );
    } else if (fetchError) {
        const { error, isCritical } = fetchError;
        return (<ErrorMessage error={error} isCritical={isCritical}/>);
    } else if (runs != null) {
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
            const startedAt = 'Submitted at ' + utc2LocalTime(run.createdAt);
            runListing.push(
                <ListItem key={run.id}>
                    <ListItemAvatar>
                        <Avatar className={iconClass}>
                            {icon}
                        </Avatar>
                    </ListItemAvatar>
                    {startedAt}
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => (alert('click'))}
                    >
                        Cancel
                    </Button>
                </ListItem>
            );
        }
        return (
        <div className={classes.root}>
            <List>
            {runListing}
            </List>
        </div>
        );
    }
    return null;
}


export default connect(mapStateToProps)(RunListing);
