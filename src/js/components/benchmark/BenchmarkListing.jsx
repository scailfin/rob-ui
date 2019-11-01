import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Assessment from '@material-ui/icons/Assessment';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import LinearProgress from '@material-ui/core/LinearProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Typography from '@material-ui/core/Typography';
import { selectBenchmark } from '../../actions/Benchmark';
import Benchmark from './Benchmark.jsx'


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
        benchmarkListing: state.benchmarkListing
    };
};


function mapDispatchToProps(dispatch) {
  return {
      selectBenchmark: (benchmark) => dispatch(selectBenchmark(benchmark))
  };
}


function BenchmarkListing(props) {
    const classes = useStyles();
    const handleBenchmarkSelect = (key) => {
        const benchmarks = props.benchmarkListing.benchmarks;
        const benchmark = benchmarks.find((b) => (b.id === key));
        props.selectBenchmark(benchmark);
    }
    const handleSubmissionSelect = (key) => {
        console.log(key);
    }
    const {
        benchmarks,
        selectedBenchmark,
        submissions
    } = props.benchmarkListing;
    // Start by creating the side menu that lists the available benchmarks and
    // submissions.
    let sideMenu = null;
    if ((benchmarks != null) && (submissions != null)) {
        let selId = null;
        if (selectedBenchmark != null) {
            selId = selectedBenchmark.id;
        }
        const benchmarklistItems = [];
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
        }
        // Create the listing of user submissions
        let submissionList = null;
        if (submissions.length > 0) {
            const submissionListItems = [];
            for (let i = 0; i < submissions.length; i++) {
                const sm = submissions[i];
                const bm = benchmarks.find((b) => (b.id === sm.benchmark));
                submissionListItems.push(
                    <ListItem
                        key={sm.id}
                        button
                        onClick={() => (handleSubmissionSelect(sm.id))}
                    >
                        <ListItemAvatar>
                            <Avatar className={classes.avatarSubmission}>
                                <SupervisedUserCircleIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={sm.name} secondary={bm.name} />
                    </ListItem>
                );
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

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarkListing);
