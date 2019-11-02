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
import Typography from '@material-ui/core/Typography';
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
      uploadFile: (submission, file) => (
          dispatch(
              uploadFile(submission.urls.get('self:upload'), submission, file)
          )
      ),
      downloadResource: (url, submission, type) => (
          dispatch(
              downloadResource(url, submission, type)
          )
      )
  };
}


function Submission(props) {
    const { benchmarks, selectedSubmission } = props.mainPanel;
    const benchmark = benchmarks.find((b) => (b.id === selectedSubmission.benchmark));
    const { fetching, displayContent, resourceDescriptor } = selectedSubmission;
    // Set the state (especially the shown tab based on whether we are
    // displaying any content)
    let contentTab = 0;
    if (resourceDescriptor != null) {
        contentTab = resourceDescriptor.type;
    }
    const [values, setValues] = useState({selectedTab: contentTab});
    const { selectedTab } = values;
    const classes = useStyles();
    /**
     * Handler to upload a file that was selected using the drop zone
     */
    const handleFileDrop = (files) => {
        if (files.length === 1) {
            props.uploadFile(selectedSubmission, files[0]);
        }
    }
    /**
     * Handler for downloads of previously uploaded files.
     */
    const handleFileDownload = (fh) => {
        const url = new Urls(fh.links).get('self:download');
        props.downloadResource(url, selectedSubmission, {id: fh.id, type: 2});
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

            } else {
                tabContent = (
                    <Typography variant='body1' className={classes.emptyTabMsg}>
                        No Runs Found
                    </Typography>
                );
            }
        } else if (selectedTab === 2) {
            let contentId = null;
            if (resourceDescriptor != null) {
                const { id, type } = resourceDescriptor;
                if (type === 2) {
                    contentId = id;
                }
            }
            tabContent = (
                <div>
                    <FileListing
                        files={selectedSubmission.files}
                        onDownload={handleFileDownload}
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
