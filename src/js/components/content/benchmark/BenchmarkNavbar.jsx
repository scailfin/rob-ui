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
import ViewHeadlineOutlinedIcon from '@material-ui/icons/ViewHeadlineOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import { selectDialog } from '../../../actions/Benchmark';
import { createSubmission, fetchSubmission } from '../../../actions/Submission';
import {
    CREATE_SUBMISSION, SHOW_INSTRUCTIONS, SHOW_LEADERBOARD, SHOW_RUNS,
    SUBMIT_RUN, UPLOAD_FILES
} from '../../../resources/Dialog';


const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        benchmarks: state.benchmarks
    };
};


function mapDispatchToProps(dispatch) {
  return {
      createSubmission: (url, name) => dispatch(createSubmission(url, name)),
      selectDialog: (api, tabId, benchmark, submission) => dispatch(
          selectDialog(api, tabId, benchmark, submission)
      ),
      selectSubmission: (api, submission) => dispatch(
          fetchSubmission(api, submission)
      )
  };
}


function BenchmarkNavbar(props) {
    const classes = useStyles();
    const {
        selectedBenchmark,
        selectedSubmission,
        selectedDialog
    } = props.benchmarks;
    /*
     * Event handler when selecting a submission from the list.
     */
    const handleSelectDialog = (key) => {
        const { selectedBenchmark, selectedSubmission } = props.benchmarks;
        props.selectDialog(props.app, key, selectedBenchmark, selectedSubmission);
    }
    /*
     * Event handler when selecting a submission from the list.
     */
    const handleSubmissionSelect = (key) => {
        const submissions = props.submissions.submissions;
        const submission = submissions.find((s) => (s.id === key));
        props.selectSubmission(props.app, submission);
    }
    // -- Component Content (render) ------------------------------------------
    // List of submissions that the user is a member of for the selected
    // benchmark.
    const listItems = [];
    let selectedItem = null;
    if (selectedSubmission != null) {
        selectedItem = selectedSubmission.id;
    }
    const submissions = []; //selectedBenchmark.submissions;
    if (submissions.length > 0) {
        submissions.sort((a, b) => ((a.name).localeCompare(b.name)));
        for (let i = 0; i < submissions.length; i++) {
            const s = submissions[i];
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
    let submissionsList = null;
    if (listItems.length > 0) {
        submissionsList = (
            <List component="nav" aria-label="main submissions">
                { listItems }
                <Divider />
            </List>
        )
    }
    // List of action buttons
    const actionButtons = [];
    actionButtons.push(
        <ListItem
            key={'instructions'}
            button
            disabled={selectedDialog === SHOW_INSTRUCTIONS}
            onClick={() => (handleSelectDialog(CREATE_SUBMISSION))}
        >
            <ListItemIcon>
                <ViewHeadlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Instructions' />
        </ListItem>
    );
    actionButtons.push(
        <ListItem
            key={'ranking'}
            button
            disabled={selectedDialog === SHOW_LEADERBOARD}
            onClick={() => (handleSelectDialog(CREATE_SUBMISSION))}
        >
            <ListItemIcon>
                <TableChartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Current Results' />
        </ListItem>
    );
    if (selectedSubmission != null) {
        actionButtons.push(
            <ListItem
                key={'submit'}
                button
                disabled={selectedDialog === SUBMIT_RUN}
                onClick={() => (handleSelectDialog(SUBMIT_RUN))}
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
                disabled={selectedDialog === UPLOAD_FILES}
                onClick={() => (handleSelectDialog(UPLOAD_FILES))}
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
            disabled={selectedDialog === CREATE_SUBMISSION}
            onClick={() => (handleSelectDialog(CREATE_SUBMISSION))}
        >
            <ListItemIcon>
                <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary='New Submission ...' />
        </ListItem>
    );
    return (
        <div className={classes.root}>
            { submissionsList }
            <List component="nav" aria-label="secondary actions">
                { actionButtons }
            </List>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarkNavbar);
