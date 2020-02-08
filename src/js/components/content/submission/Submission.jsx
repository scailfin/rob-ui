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
import CloudUpload from '@material-ui/icons/CloudUpload';
import CreateSubmissionForm from './CreateSubmissionForm';
import DialogHeader from './DialogHeader.jsx';
import FileListing from '../FileListing';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Dropzone from 'react-dropzone';
import RunListing from '../run/RunListing.jsx';
import SubmitForm from '../../form/SubmitForm';
import Typography from '@material-ui/core/Typography';
import { cancelRun, getRun, submitRun } from '../../../actions/Run';
import {
    downloadResource, selectDialog, uploadFile
} from '../../../actions/Submission';
import {
    CREATE_SUBMISSION, SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES
} from '../../../resources/Dialog';
import { Urls } from '../../../resources/Urls';


const useStyles = makeStyles(theme => ({
    emptyTabMsg: {
        marginTop: theme.spacing(4),
    },
    instructions: {
        marginTop: theme.spacing(4),
    },
    spinner: {
        marginTop: theme.spacing(8),
        marginRight: theme.spacing(24)
    },
    uploadForm: {
        width: '50%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(8),
        padding: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#ebebeb'
    },
}));


const mapStateToProps = state => {
    return {
        submissions: state.submissions
    };
};


function mapDispatchToProps(dispatch) {
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
}


function Submission(props) {
    const { selectedSubmission, selectedDialog } = props.submissions;
    const classes = useStyles();
    /*
     * Handler to upload a file that was selected using the drop zone
     */
    const handleFileDrop = (files) => {
        if (files.length === 1) {
            let url = null;
            if (selectedSubmission.urls != null) {
                url = selectedSubmission.urls.get('self:upload');
            } else {
                url = new Urls(selectedSubmission.links).get('self:upload');
            }
            props.uploadFile(url, selectedSubmission, files[0]);
        }
    }
    /*
     * Handler for downloads of previously uploaded files. The tab index is used
     * to keep track of whether a run result resource is being downloaded or a
     * file that has previously been uploaded.
     */
    const handleFileDownload = (url, resourceId) => {
        props.downloadResource(
            url,
            selectedSubmission,
            resourceId
        );
    }
    const handleGetRunState = (run) => {
        const url = new Urls(run.links).self();
        props.getRun(url, selectedSubmission);
    }
    /*
     * Click handler for cancel button.
     */
    const handleRunCancel = (run) => {
        const url = new Urls(run.links).get('self:cancel');
        props.cancelRun(url, selectedSubmission);
    }
    /*
     * Handle submission of new run for given ser of arguments
     */
    const handleSubmit = (args) => {
        // Convert argument list to (key, value) pair list.
        const runArgs = [];
        selectedSubmission.parameters.forEach((p) => {
            const val = args[p.id];
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
        const url = new Urls(selectedSubmission.links).get('self:submit');
        props.submitRun(url, {arguments: runArgs}, selectedSubmission);
        //setValues({selectedTab: 0});
    }
    let tabContent = null;
    if (selectedDialog === CREATE_SUBMISSION) {
        tabContent = (<CreateSubmissionForm />);
    } else if (selectedSubmission != null) {
        const { fetching, displayContent, contentId } = selectedSubmission;
        if (fetching === true) {
            tabContent = (
                <div className={classes.spinner}>
                    <Typography variant="overline">
                        Loading Submission Details ...
                    </Typography>
                    <LinearProgress color='secondary'/>
                </div>
            );
        } else if (selectedDialog === SHOW_RUNS) {
            tabContent = (<RunListing />);
        } else if (selectedDialog === SUBMIT_RUN) {
            tabContent = (
                <SubmitForm
                    onCancel={() => (props.selectDialog(SHOW_RUNS))}
                    onSubmit={handleSubmit}
                    submission={selectedSubmission}
                />
            )
        } else if (selectedDialog === UPLOAD_FILES) {
            tabContent = (
                <div>
                    <FileListing
                        files={selectedSubmission.files}
                        onDownload={(fh) => (
                            handleFileDownload(
                                new Urls(fh.links).get('self:download'),
                                fh.id
                            )
                        )}
                        contentId={contentId}
                        content={displayContent}
                    />
                    <Dropzone
                        onDrop={acceptedFiles => handleFileDrop(acceptedFiles)}
                        multiple={false}
                    >
                      {({getRootProps, getInputProps}) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Paper className={classes.uploadForm}>
                            <CloudUpload fontSize='large'/>
                            <Typography variant='body2'>
                                Drag files here, or click to select
                            </Typography>
                            </Paper>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                </div>
            );
        }
    }
    return (
        <div className={classes.paper}>
            <DialogHeader />
            { tabContent }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
