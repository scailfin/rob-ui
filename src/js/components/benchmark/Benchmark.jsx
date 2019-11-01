import React, { useState } from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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
        backgroundColor: '#e0f7fa'
    },
    instructions: {
        marginTop: theme.spacing(4),
    }
}));


const mapStateToProps = state => {
    return {
        benchmarkListing: state.benchmarkListing
    };
};


function mapDispatchToProps(dispatch) {
  return {
  };
}


function Benchmark(props) {
    const [open, setOpen] = useState(false);
    const classes = useStyles();
    const selectedBenchmark = props.benchmarkListing.selectedBenchmark;
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
                        autoFocus
                    />
                </div>
                <div>
                <Button variant="contained" color="primary" className={classes.button}>
                    Submit
                </Button>
                <Button variant="contained" color="secondaty" className={classes.button} onClick={() => (setOpen(false))}>
                    Cancel
                </Button>
                </div>
            </Paper>
        );
    } else {
        form = (
            <div>
                <Button variant="contained" color="primary" className={classes.button} onClick={() => (setOpen(true))}>
                    Create a Submission
                </Button>
            </div>
        );
    }
    return (
        <div className={classes.paper}>
            <Typography variant='h2'>
                {selectedBenchmark.name}
            </Typography>
            <Typography variant='h6'>
                {selectedBenchmark.description}
            </Typography>
            <Typography variant='body1' className={classes.instructions}>
                {selectedBenchmark.instructions}
            </Typography>
            { form }
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Benchmark);
