/*
 * This file is part of the Reproducible Open Benchmarks for Data Analysis
 * Platform (ROB).
 *
 * Copyright (C) 2019 NYU.
 *
 * ROB is free software; you can redistribute it and/or modify it under the
 * terms of the MIT License; see LICENSE file for more details.
 */

import React, { Component } from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ErrorMessage from './util/ErrorMessage';
import Footer from './util/Footer.jsx';
import Spinner from './util/Spinner.jsx';
import MainPanel from './content/MainPanel';
import SignIn from './content/SignIn.jsx';
import Topbar from './layout/Topbar';
import { clearError, fetchApi } from "../actions/App";
import theme from '../../theme';


const styles = {
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left'
    },
};


const mapStateToProps = state => {
  return { app: state.app };
};

function mapDispatchToProps(dispatch) {
  return {
      clearError: () => dispatch(clearError()),
      fetchApi: () => dispatch(fetchApi())
  };
}


class App extends Component {
    componentDidMount() {
        this.props.fetchApi();
    }
    clearError = () => {
        this.props.clearError();
    }
    render() {
        const { app, classes } = this.props;
        const { apiError, isFetching, username } = app;
        let content = null;
        let minorError = null;
        if (isFetching) {
            content = (<Spinner showLogo={true} />);
        }
        if (apiError != null) {
            const { error, isCritical } = apiError;
            if (isCritical) {
                content = (
                    <ErrorMessage error={error} isCritical={isCritical} />
                );
            } else {
                minorError = (
                    <ErrorMessage
                        error={error}
                        isCritical={isCritical}
                        onClose={this.clearError}
                    />
                );
            }
        } if ((content == null) && (username == null)) {
            content = (<SignIn />);
        } else if (content == null) {
            content = (<MainPanel />);
        }
        return (
            <div>
                <Topbar />
                <Container className={classes.paper} maxWidth="xl">
                    { content }
                    { minorError }
                </Container>
                <Footer />
            </div>
        );
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
