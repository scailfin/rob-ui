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
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CloudUpload from '@material-ui/icons/CloudUpload';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import { selectDialog, selectSubmission } from '../../actions/Submission';
import {
    CREATE_SUBMISSION, SUBMIT_RUN, UPLOAD_FILES
} from '../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


const mapStateToProps = state => {
    return {
        mainPanel: state.mainPanel
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectDialog: (dialogId) => dispatch(selectDialog(dialogId)),
      selectSubmission: (submission) => dispatch(selectSubmission(submission))
  };
}


function SubmissionList(props) {
    const classes = useStyles();
    const {
        selectedBenchmark,
        selectedSubmission,
        submissionDialog,
        submissions
    } = props.mainPanel;
    /**
     * Event handler when selecting a submission from the list.
     */
    const handleSubmissionSelect = (key) => {
        const submissions = props.mainPanel.submissions;
        const submission = submissions.find((s) => (s.id === key));
        props.selectSubmission(submission);
    }
    // -- Component Content (render) ------------------------------------------
    // List of submissions that the user is a member of for the selected
    // benchmark.
    const listItems = [];
    let selectedItem = null;
    if (selectedSubmission != null) {
        selectedItem = selectedSubmission.id;
    }
    if (submissions.length > 0) {
        submissions.sort((a, b) => ((a.name).localeCompare(b.name)));
        for (let i = 0; i < submissions.length; i++) {
            const s = submissions[i];
            if (s.benchmark === selectedBenchmark.id) {
                listItems.push(
                    <ListItem
                        key={s.id}
                        button
                        selected={s.id === selectedItem}
                        onClick={() => (handleSubmissionSelect(s.id))}
                    >
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary={s.name} />
                    </ListItem>
                );
            }
        }
    }
    if (listItems.length === 0) {
        listItems.push(
            <ListItemText key='nosubs' primary={'No Submissions Found'} />
        );
    }
    // List of action buttons
    const actionButtons = [];
    if (selectedSubmission != null) {
        actionButtons.push(
            <ListItem
                key={'submit'}
                button
                disabled={submissionDialog === SUBMIT_RUN}
                onClick={() => (props.selectDialog(SUBMIT_RUN))}
            >
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary='Submit New Run ...' />
            </ListItem>
        );
        actionButtons.push(
            <ListItem
                key={'upload'}
                button
                disabled={submissionDialog === UPLOAD_FILES}
                onClick={() => (props.selectDialog(UPLOAD_FILES))}
            >
                <ListItemIcon>
                    <CloudUpload />
                </ListItemIcon>
                <ListItemText primary='Upload Files ...' />
            </ListItem>
        );
    }
    actionButtons.push(
        <ListItem
            key={'add'}
            button
            disabled={submissionDialog === CREATE_SUBMISSION}
            onClick={() => (props.selectDialog(CREATE_SUBMISSION))}
        >
            <ListItemIcon>
                <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary='New Submission ...' />
        </ListItem>
    );
    return (
        <div className={classes.root}>
            <List component="nav" aria-label="main submissions">
                { listItems }
            </List>
            <Divider />
            <List component="nav" aria-label="secondary actions">
                { actionButtons }
            </List>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmissionList);
