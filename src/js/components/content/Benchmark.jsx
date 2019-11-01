import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { createSubmission } from '../../actions/Submission';


const useStyles = makeStyles(theme => ({
    button: {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(2)
    },
    paperForm: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        backgroundColor: '#ebebeb'
    },
    instructions: {
        marginTop: theme.spacing(4),
    }
}));


const mapStateToProps = state => {
    return {
        mainPanel: state.mainPanel
    };
};


function mapDispatchToProps(dispatch) {
  return {
      createSubmission: (url, name) => dispatch(createSubmission(url, name))
  };
}


function Benchmark(props) {
    const classes = useStyles();
    const [values, setValues] = useState({
        open: false,
        selectedTab: 1,
        submissionName: ''
    });
    const selectedBenchmark = props.mainPanel.selectedBenchmark;
    const {open, selectedTab, submissionName} = values;
    /**
     * Handle changes in the submision name input field.
     */
    const handleSubmissionChanges = (event) => {
        setValues({...values, submissionName: event.target.value});
    }
    /**
     * Event handler for the submit button that creates a new submission for
     * the benchmark.
     */
    const handleSubmissionSubmit = () => {
        const url = selectedBenchmark.urls.get('submissions:create')
        props.createSubmission(url, submissionName);
        setValues({open: false, submissionName: ''});
    }
    /**
     * Change handler to display a different tab.
     */
    const handleTabChange = (event, newValue) => {
        setValues({...values, selectedTab: newValue});
    };

    let form = null;
    if (open) {
        form = (
            <Paper className={classes.paperForm}>
                <div className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="submissionName"
                        label="Submission Name"
                        name="submissionName"
                        value={submissionName}
                        onChange={handleSubmissionChanges}
                        autoFocus
                    />
                </div>
                <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSubmissionSubmit}
                >
                    Submit
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    className={classes.button}
                    onClick={() => (setValues({...values, open: false}))}
                >
                    Cancel
                </Button>
                </div>
            </Paper>
        );
    } else {
        form = (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={() => (setValues({...values, open: true}))}
                >
                    Create a Submission
                </Button>
            </div>
        );
    }
    const content = (
        <div>
            <Typography variant='body1' className={classes.instructions}>
                {selectedBenchmark.instructions}
            </Typography>
            { form }
        </div>
    );
    return (
        <div className={classes.paper}>
            <Typography variant='h2'>
                {selectedBenchmark.name}
            </Typography>
            <Typography variant='h6'>
                {selectedBenchmark.description}
            </Typography>
            <Tabs
                value={selectedTab}
                indicatorColor="primary"
                textColor="primary"
                onChange={handleTabChange}
            >
                <Tab label="Results" />
                <Tab label="Instructions" />
            </Tabs>
            { content }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Benchmark);
