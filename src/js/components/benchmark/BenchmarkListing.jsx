import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
  },
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
    const benchmarks = props.benchmarkListing.benchmarks;
    const handleSelect = (key) => {
        console.log(key);
    }
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
                        <Avatar>
                            <SupervisedUserCircleIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={bm.name} secondary={bm.description} />
                </ListItem>
            );
        }
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                <Typography component="h1" variant="h5">
                    Benchmarks
                </Typography>
                <List component="nav" className={classes.root}>
                    {listItems}
                </List>
                </div>
              </Container>
        );
    } else {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BenchmarkListing);
