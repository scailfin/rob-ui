import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
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
import ListSubheader from '@material-ui/core/ListSubheader';
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
        marginLeft: theme.spacing(2),
        color:  'textSecondary'
    }
}));


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
        const benchmarkGroups = {};
        for (let i = 0; i < benchmarks.length; i++) {
            const bm = benchmarks[i];
            benchmarklistItems.push(
                <ListItem
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
                </ListItem>
            );
            benchmarkGroups[bm.id] = [];
        }
        // Create the listing of user submissions
        let submissionList = null;
        if (submissions.length > 0) {
            submissions.sort((a, b) => ((a.name).localeCompare(b.name)));
            const submissionListItems = [];
            for (let i = 0; i < submissions.length; i++) {
                const sm = submissions[i];
                const bm = benchmarks.find((b) => (b.id === sm.benchmark));
                benchmarkGroups[bm.id].push({submission: sm, benchmark:bm});
            }
            for (let i = 0; i < benchmarks.length; i++) {
                const group = benchmarkGroups[benchmarks[i].id];
                if (group.length > 0) {
                    const benchmark = group[0].benchmark;
                    submissionListItems.push(
                        <ListSubheader key={benchmark.id}>
                            <ListItemText primary={benchmark.name} />
                        </ListSubheader>
                    );
                    for (let s = 0; s < group.length; s++) {
                        const { submission, benchmark } = group[s];
                        submissionListItems.push(
                            <ListItem
                                key={submission.id}
                                button
                                selected={submission.id === selId}
                                onClick={() => (handleSubmissionSelect(submission.id))}
                            >
                                <ListItemAvatar>
                                    <Avatar className={classes.avatarSubmission}>
                                        <Code />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={submission.name} secondary={benchmark.name} />
                            </ListItem>
                        );
                    }
                }
            }
            submissionList = (
                <List component="nav" className={classes.root}>
                    {submissionListItems}
                </List>
            );
        } else {
            submissionList = (
                <Typography variant='caption' className={classes.noSubmissions}>
                    No Submissions Found
                </Typography>
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
                <Grid item xs={4}>
                    {sideMenu}
                </Grid>
                <Grid item xs={8}>
                    {mainContent}
                </Grid>
            </Grid>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPanel);
