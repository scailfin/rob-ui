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
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import ViewHeadlineOutlinedIcon from '@material-ui/icons/ViewHeadlineOutlined';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import SendIcon from '@material-ui/icons/Send';
import TableChartOutlinedIcon from '@material-ui/icons/TableChartOutlined';
import { selectDialog } from '../../../actions/Benchmark';
import {
    CREATE_SUBMISSION, DELETE_SUBMISSION, SHOW_INSTRUCTIONS, SHOW_LEADERBOARD,
    SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES
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
        benchmark: state.benchmark,
        submission: state.submission
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectDialog: (api, tabId, benchmark, submission) => dispatch(
          selectDialog(api, tabId, benchmark, submission)
      )
  };
}


function BenchmarkNavbar(props) {
    const classes = useStyles();
    const {
        selectedBenchmark,
        selectedDialog
    } = props.benchmark;
    const selectedSubmission = props.submission.selectedSubmission;
    // ------------------------------------------------------------------------
    // Event handlers
    // ------------------------------------------------------------------------
    /*
     * Event handler when selecting an item from the dialog list.
     */
    const handleSelectDialog = (key, submission) => {
        const api = props.app;
        const selectedBenchmark = props.benchmark.selectedBenchmark;
        const selectedSubmission = props.submission.selectedSubmission
        if (key === SHOW_RUNS) {
            props.selectDialog(api, key, selectedBenchmark, submission);
        } else {
            props.selectDialog(api, key, selectedBenchmark, selectedSubmission);
        }
    }
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    // List of submissions that the user is a member of for the selected
    // benchmark.
    const listItems = [];
    // -- Benchmark dialog items ----------------------------------------------
    listItems.push(
        <ListItem
            key={'instructions'}
            button
            selected={selectedDialog === SHOW_INSTRUCTIONS}
            onClick={() => (handleSelectDialog(SHOW_INSTRUCTIONS))}
        >
            <ListItemIcon>
                <ViewHeadlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Instructions' />
        </ListItem>
    );
    listItems.push(
        <ListItem
            key={'ranking'}
            button
            selected={selectedDialog === SHOW_LEADERBOARD}
            onClick={() => (handleSelectDialog(SHOW_LEADERBOARD))}
        >
            <ListItemIcon>
                <TableChartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary='Current Results' />
        </ListItem>
    );
    listItems.push(<Divider key={'div1'}/>);
    // -- Submissions ---------------------------------------------------------
    listItems.push(
        <ListSubheader key={'submissions'}>
            <ListItemText primary='My Submissions ...' />
        </ListSubheader>
    );
    let selectedItem = null;
    if ((selectedDialog === SHOW_RUNS) && (selectedSubmission != null)) {
        selectedItem = selectedSubmission.id;
    }
    const submissions = selectedBenchmark.submissions;
    submissions.sort((a, b) => ((a.name).localeCompare(b.name)));
    for (let i = 0; i < submissions.length; i++) {
        const s = submissions[i];
        listItems.push(
            <ListItem
                key={s.id}
                button
                selected={s.id === selectedItem}
                onClick={() => (handleSelectDialog(SHOW_RUNS, s))}
            >
                <ListItemIcon>
                    <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={s.name} />
            </ListItem>
        );
    }
    listItems.push(
        <ListItem
            key={'add'}
            button
            selected={selectedDialog === CREATE_SUBMISSION}
            onClick={() => (handleSelectDialog(CREATE_SUBMISSION))}
        >
            <ListItemIcon>
                <AddCircleIcon />
            </ListItemIcon>
            <ListItemText primary='Create Submission ...' />
        </ListItem>
    );
    // -- Submission actions --------------------------------------------------
    if (selectedSubmission != null) {
        listItems.push(<Divider key={'div2'}/>);
        listItems.push(
            <ListSubheader key={'actions'}>
                <ListItemText primary={selectedSubmission.name} />
            </ListSubheader>
        );
        listItems.push(
            <ListItem
                key={'submit'}
                button
                selected={selectedDialog === SUBMIT_RUN}
                onClick={() => (handleSelectDialog(SUBMIT_RUN))}
            >
                <ListItemIcon>
                    <SendIcon />
                </ListItemIcon>
                <ListItemText primary='Submit New Run ...' />
            </ListItem>
        );
        listItems.push(
            <ListItem
                key={'upload'}
                button
                selected={selectedDialog === UPLOAD_FILES}
                onClick={() => (handleSelectDialog(UPLOAD_FILES))}
            >
                <ListItemIcon>
                    <CloudUpload />
                </ListItemIcon>
                <ListItemText primary='Upload Files ...' />
            </ListItem>
        );
        listItems.push(
            <ListItem
                key={'delete'}
                button
                selected={selectedDialog === DELETE_SUBMISSION}
                onClick={() => (handleSelectDialog(DELETE_SUBMISSION))}
            >
                <ListItemIcon>
                    <DeleteIcon />
                </ListItemIcon>
                <ListItemText primary='Delete Submission' />
            </ListItem>
        );
    }
    return (
        <div className={classes.root}>
            <List component="nav" aria-label="secondary actions">
                { listItems }
            </List>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarkNavbar);
