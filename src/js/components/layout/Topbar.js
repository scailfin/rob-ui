import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import LogoutMenu from './LogoutMenu';
import theme from '../../../theme';


// Use higher-order component API to create styles for the logo
const styles = {
    root: {
      flexGrow: 1,
    },
    logoDiv: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
};


const mapStateToProps = state => {
  return { app: state.app };
};


class Topbar extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="fixed">
                    <Toolbar>
                        <Typography variant="h6" className={classes.title}>
                            Reproducible Open Benchmarks
                        </Typography>
                        <LogoutMenu />
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps)(Topbar));