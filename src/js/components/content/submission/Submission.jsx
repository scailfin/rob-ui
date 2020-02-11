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
import ErrorMessage from '../../util/ErrorMessage';
import FileListing from '../FileListing';
import Paper from '@material-ui/core/Paper';
import Dropzone from 'react-dropzone';
import RunListing from '../run/RunListing.jsx';
import Spinner from '../../util/Spinner';
import SubmitForm from '../run/form/SubmitForm';
import Typography from '@material-ui/core/Typography';
import { selectDialog } from '../../../actions/Benchmark';
import { cancelRun, getRun, submitRun } from '../../../actions/Run';
import { downloadResource, uploadFile } from '../../../actions/Submission';
import { SHOW_RUNS, SUBMIT_RUN, UPLOAD_FILES } from '../../../resources/Dialog';
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
        app: state.app,
        benchmark: state.benchmark,
        submission: state.submission
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
      selectDialog: (api, dialogId, behcnmark, submission) => dispatch(
          selectDialog(api, dialogId, behcnmark, submission)
      ),
      submitRun: (url, data, submission) => (dispatch(submitRun(url, data, submission)))
  };
}


function Submission(props) {
    const classes = useStyles();
    const selectedDialog = props.benchmark.selectedDialog;
    const { fetchError, isFetching, selectedSubmission} = props.submission;
    // ------------------------------------------------------------------------
    // Event handler
    // ------------------------------------------------------------------------
    const handleCloseDialog = () => {
        const api = props.app;
        const selectedBenchmark = props.benchmark.selectedBenchmark;
        const selectedSubmission = props.submission.selectedSubmission;
        props.selectDialog(api, SHOW_RUNS, selectedBenchmark, selectedSubmission);
    }
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
    // ------------------------------------------------------------------------
    // Render
    // ------------------------------------------------------------------------
    if (isFetching) {
        return (
            <div className={classes.spinner}>
                <Spinner message='Loading submission ...' showLogo={true}/>
            </div>
        );
    } else if (fetchError != null) {
        return (<ErrorMessage error={fetchError} isCritical={true} />);
    } else if (selectedSubmission == null) {
        return null;
    } else if (selectedDialog === SHOW_RUNS) {
        return (<RunListing />);
    } else if (selectedDialog === SUBMIT_RUN) {
        return (
            <SubmitForm
                onCancel={handleCloseDialog}
                onSubmit={handleSubmit}
                submission={selectedSubmission}
            />
        )
    } else if (selectedDialog === UPLOAD_FILES) {
        return (
            <div>
                <FileListing
                    files={selectedSubmission.files}
                    onDownload={(fh) => (
                        handleFileDownload(
                            new Urls(fh.links).get('self:download'),
                            fh.id
                        )
                    )}
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

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
