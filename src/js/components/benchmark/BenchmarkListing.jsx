import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Assessment from '@material-ui/icons/Assessment';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
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
  paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
  },
  spinner: {
      marginTop: theme.spacing(8)
  }
}));


const mapStateToProps = state => {
    return {
        app: state.app,
        api: state.api,
        benchmarkListing: state.benchmarkListing
    };
};


function mapDispatchToProps(dispatch) {
  return {
  };
}


function BenchmarkListing(props) {
    const classes = useStyles();
    const handleSelect = (key) => {
        console.log(key);
    }
    const {benchmarks, submissions } = props.benchmarkListing;
    // Create the listing of benchmarks
    let benchmarkListing = null;
    if (benchmarks != null) {
        const listItems = [];
        for (let i = 0; i < benchmarks.length; i++) {
            const bm = benchmarks[i];
            listItems.push(
                <ListItem
                    key={bm.id}
                    button
                    onClick={() => (handleSelect(bm.id))}
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
        benchmarkListing = (
            <List component="nav" className={classes.root}>
                {listItems}
            </List>
        );
    } else {
        benchmarkListing = (
            <div className={classes.spinner}>
                <CircularProgress color='secondary'/>
            </div>
        );
    }
    // Create the listing of user submissions
    let submissionListing = null;
    if ((benchmarks != null) && (submissions != null)) {
        const listItems = [];
        for (let i = 0; i < submissions.length; i++) {
            const sm = submissions[i];
            const bm = benchmarks.find((b) => (b.id === sm.benchmark));
            listItems.push(
                <ListItem
                    key={sm.id}
                    button
                    onClick={() => (handleSelect(sm.id))}
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
        submissionListing = (
            <List component="nav" className={classes.root}>
                {listItems}
            </List>
        );
    } else {
        submissionListing = (
            <div className={classes.spinner}>
                <CircularProgress color='secondary'/>
            </div>
        );
    }
    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Benchmarks
                </Typography>
                { benchmarkListing }
                <Divider />
                <Typography className={classes.secondHeader} component="h1" variant="h5">
                    My Submissions
                </Typography>
                { submissionListing }
            </div>
        </Container>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarkListing);
