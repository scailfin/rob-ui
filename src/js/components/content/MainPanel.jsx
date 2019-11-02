import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core';
import Assessment from '@material-ui/icons/Assessment';
import Avatar from '@material-ui/core/Avatar';
import Benchmark from './Benchmark.jsx'
import Code from '@material-ui/icons/Code';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Submission from './Submission.jsx';
import Typography from '@material-ui/core/Typography';
import { selectBenchmark } from '../../actions/Benchmark';
import { selectSubmission } from '../../actions/Submission';


const useStyles = makeStyles(theme => ({
    avatarBenchmark: {
        margin: theme.spacing(1),
        backgroundColor: '#3f51b5',
    },
    avatarSubmission: {
        margin: theme.spacing(1),
        backgroundColor: '#009688',
    },
    secondHeader: {
            marginTop: theme.spacing(2),
    },
    spinner: {
        marginTop: theme.spacing(12)
    },
    noSubmissions: {
        marginTop: theme.spacing(4),
        color:  'textSecondary'
    },
    mainContent: {
        marginLeft: theme.spacing(4)
    }
}));


//
// Based on https://github.com/mui-org/material-ui/issues/13672
//
const StyledBenchmark = withStyles({
    root: {
        backgroundColor: "inherit",
        "&$selected": {
            backgroundColor: "#e8eaf6"
        },
        '&:hover': {
            backgroundColor: "#e8eaf6",
            "&$selected": {
                backgroundColor: "#c5cae9"
            }
        }
    },
    selected: {}
})(ListItem);


const StyledSubmission = withStyles({
    root: {
        backgroundColor: "inherit",
        "&$selected": {
            backgroundColor: "#e0f2f1"
        },
        '&:hover': {
            backgroundColor: "#e0f2f1",
            "&$selected": {
                backgroundColor: "#b2dfdb"
            }
        }
    },
    selected: {}
})(ListItem);


const mapStateToProps = state => {
    return {
        mainPanel: state.mainPanel
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectBenchmark: (benchmark) => dispatch(selectBenchmark(benchmark)),
      selectSubmission: (submission) => dispatch(selectSubmission(submission))
  };
}


function MainPanel(props) {
    const classes = useStyles();
    const handleBenchmarkSelect = (key) => {
        const benchmarks = props.mainPanel.benchmarks;
        const benchmark = benchmarks.find((b) => (b.id === key));
        props.selectBenchmark(benchmark);
    }
    const handleSubmissionSelect = (key) => {
        const submissions = props.mainPanel.submissions;
        const submission = submissions.find((s) => (s.id === key));
        props.selectSubmission(submission);
    }
    const {
        benchmarks,
        selectedBenchmark,
        selectedSubmission,
        submissions
    } = props.mainPanel;
    // Start by creating the side menu that lists the available benchmarks and
    // submissions.
    let sideMenu = null;
    let selId = null;
    if (selectedBenchmark != null) {
        selId = selectedBenchmark.id;
    } else if (selectedSubmission != null) {
        selId = selectedSubmission.id;
    }
    if ((benchmarks != null) && (submissions != null)) {
        const benchmarklistItems = [];
        // Group submissions by benchmarks
        benchmarks.sort((a, b) => ((a.name).localeCompare(b.name)));
        for (let i = 0; i < benchmarks.length; i++) {
            const bm = benchmarks[i];
            benchmarklistItems.push(
                <StyledBenchmark
                    key={bm.id}
                    button
                    selected={bm.id === selId}
                    onClick={() => (handleBenchmarkSelect(bm.id))}
                >
                    <ListItemAvatar>
                        <Avatar className={classes.avatarBenchmark}>
                            <Assessment />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={bm.name} secondary={bm.description} />
                </StyledBenchmark>
            );
        }
        // Create the listing of user submissions
        let submissionList = null;
        if (submissions.length > 0) {
            submissions.sort((a, b) => ((a.name).localeCompare(b.name)));
            const submissionListItems = [];
            for (let i = 0; i < submissions.length; i++) {
                const sm = submissions[i];
                const bm = benchmarks.find((b) => (b.id === sm.benchmark));
                submissionListItems.push(
                    <StyledSubmission
                        key={sm.id}
                        button
                        selected={sm.id === selId}
                        onClick={() => (handleSubmissionSelect(sm.id))}
                    >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarSubmission}>
                                <Code />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={sm.name} secondary={bm.name} />
                    </StyledSubmission>
                );
            }
            submissionList = (
                <List component="nav" className={classes.root}>
                    {submissionListItems}
                </List>
            );
        } else {
            submissionList = (
                <List component="nav" className={classes.root}>
                    <ListItemText primary={'No Submissions Found'} />
                </List>
            );
        }
        sideMenu = (
            <div>
                <Typography variant="h6">
                    Benchmarks
                </Typography>
                <List component="nav" className={classes.root}>
                    {benchmarklistItems}
                </List>
                <Divider />
                <Typography className={classes.secondHeader} variant='h6'>
                    My Submissions
                </Typography>
                {submissionList}
            </div>
        );
    } else {
        sideMenu = (
            <div className={classes.spinner}>
                <Typography variant="overline">
                    Loading Benchmarks and Submissions ...
                </Typography>
                <LinearProgress color='secondary'/>
            </div>
        );
    }
    // The main content either shows the selected benchmark or submission
    let mainContent = null;
    if (selectedBenchmark != null) {
        mainContent = (<Benchmark key={selectedBenchmark.id}/>);
    } else if (selectedSubmission != null) {
        mainContent = (<Submission key={selectedSubmission.id}/>);
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={3} style={{background: '#f2f2f2'}}>
                {sideMenu}
            </Grid>
            <Grid item xs={9}>
                <div  className={classes.mainContent}>
                    {mainContent}
                </div>
            </Grid>
        </Grid>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel);
