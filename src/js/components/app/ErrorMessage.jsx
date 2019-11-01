import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { clearError } from "../../actions/Error";
import theme from '../../../theme';


// Use higher-order component API to create styles for the logo
const styles = {
    error: {
      backgroundColor: theme.palette.error.dark,
    },
    icon: {
      fontSize: 20,
    },
    iconVariant: {
      opacity: 0.9,
      marginRight: theme.spacing(1),
    },
    message: {
      display: 'flex',
      alignItems: 'center',
    },
};


const mapStateToProps = state => {
  return { app: state.app };
};

function mapDispatchToProps(dispatch) {
  return {
    clearError: () => dispatch(clearError())
  };
}


class ErrorMessage extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }
    onClose = () => {
        this.props.clearError();
    }
    render() {
        const { app, classes } = this.props;
        const { error } = app;
        if (error != null) {
            return (
                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right',}}
                    open={true}
                    autoHideDuration={6000}
                    onClose={this.onClose}
                >
                    <SnackbarContent
                        className={clsx(classes['error'], classes.margin)}
                        aria-describedby="client-snackbar"
                        message={
                            <span id="client-snackbar" className={classes.message}>
                            <ErrorIcon className={clsx(classes.icon, classes.iconVariant)} />
                            {error}
                            </span>
                        }
                        action={[
                            <IconButton
                                key="close"
                                aria-label="close"
                                color="inherit"
                                onClick={this.onClose}
                            >
                                <CloseIcon className={classes.icon} />
                            </IconButton>,
                        ]}
                    />
                </Snackbar>
            );
        } else {
            return null;
        }
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ErrorMessage));
