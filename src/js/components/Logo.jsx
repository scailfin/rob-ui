import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import theme from '../../theme';


// Use higher-order component API to create styles for the logo
const styles = {
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    spinner: {
        marginTop: theme.spacing(8)
    }
};


const mapStateToProps = state => {
  return { app: state.app };
};


class Logo extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }
    render() {
        const { classes } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        ROB
                    </Typography>
                    <div className={classes.spinner}>
                        <CircularProgress color='secondary'/>
                    </div>
                </div>
            </Container>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps)(Logo));
