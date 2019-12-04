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
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import CloudUpload from '@material-ui/icons/CloudUpload';
import FileListing from './FileListing';
import LinearProgress from '@material-ui/core/LinearProgress';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dropzone from 'react-dropzone';
import RunListing from './RunListing.jsx';
import SubmitForm from '../form/SubmitForm';
import Typography from '@material-ui/core/Typography';
import { cancelRun, getRun, submitRun } from '../../actions/Run';
import { downloadResource, uploadFile } from '../../actions/Submission';
import { Urls } from '../../resources/Urls';


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
        mainPanel: state.mainPanel
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
      submitRun: (url, data, submission) => (dispatch(submitRun(url, data, submission)))
  };
}


function Submission(props) {
    const { benchmarks, selectedSubmission } = props.mainPanel;
    const benchmark = benchmarks.find((b) => (b.id === selectedSubmission.benchmark));
    const { fetching, displayContent, contentId, tabId } = selectedSubmission;
    // Set the state (especially the shown tab based on whether we are
    // displaying any content)
    let contentTab = 0;
    if (tabId != null) {
        contentTab = tabId;
    }
    const [values, setValues] = useState({selectedTab: contentTab});
    const { selectedTab } = values;
    const classes = useStyles();
    /**
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
    /**
     * Handler for downloads of previously uploaded files. The tab index is used
     * to keep track of whether a run result resource is being downloaded or a
     * file that has previously been uploaded.
     */
    const handleFileDownload = (url, resourceId, tabId) => {
        props.downloadResource(
            url,
            selectedSubmission,
            resourceId,
            tabId
        );
    }
    const handleGetRunState = (run) => {
        const url = new Urls(run.links).self();
        props.getRun(url, selectedSubmission);
    }
    /**
     * Click handler for cancel button.
     */
    const handleRunCancel = (run) => {
        const url = new Urls(run.links).get('self:cancel');
        props.cancelRun(url, selectedSubmission);
    }
    /**
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
        setValues({selectedTab: 0});
    }
    /**
     * Handler for tab selections.
     */
    const handleTabChange = (event, newValue) => {
      setValues({...values, selectedTab: newValue});
    };
    let tabContent = null;
    if (fetching === true) {
        tabContent = (
            <div className={classes.spinner}>
                <Typography variant="overline">
                    Loading Submission Details ...
                </Typography>
                <LinearProgress color='secondary'/>
            </div>
        );
    } else {
        if (selectedTab === 0) {
            const { runs } = selectedSubmission;
            if (runs.length > 0) {
                tabContent = (
                    <RunListing
                        contentId={contentId}
                        content={displayContent}
                        onCancel={handleRunCancel}
                        onDownload={(fh) => (
                            handleFileDownload(
                                new Urls(fh.links).get('self'),
                                fh.id,
                                selectedTab
                            )
                        )}
                        onPoll={handleGetRunState}
                        runs={runs}
                        submission={selectedSubmission}
                    />
                );
            } else {
                tabContent = (
                    <Typography variant='body1' className={classes.emptyTabMsg}>
                        No Runs Found
                    </Typography>
                );
            }
        } else if (selectedTab === 1) {
            tabContent = (
                <SubmitForm
                    onSubmit={handleSubmit}
                    submission={selectedSubmission}
                />
            )
        } else if (selectedTab === 2) {
            tabContent = (
                <div>
                    <FileListing
                        files={selectedSubmission.files}
                        onDownload={(fh) => (
                            handleFileDownload(
                                new Urls(fh.links).get('self:download'),
                                fh.id,
                                selectedTab
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
        } else if (selectedTab === 3) {
            tabContent = (
                <Typography variant='body1' className={classes.instructions}>
                    {benchmark.instructions}
                </Typography>
            );
        }
    }
    // The tab content is either a list of previous runs, the input form for
    // new runs, the list of uploaded resources, or the benchmark instructions
    return (
        <div className={classes.paper}>
            <Typography variant='h2'>
                {selectedSubmission.name}
            </Typography>
            <Typography variant='h6'>
                {benchmark.name}
            </Typography>
            <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
            >
                <Tab label="Runs" />
                <Tab label="Submit Run" />
                <Tab label="Uploaded Files" />
                <Tab label="Instructions" />
            </Tabs>
            { tabContent }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Submission);
