import React, { Component } from "react";
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import BenchmarkListing from './benchmark/BenchmarkListing';
import Container from '@material-ui/core/Container';
import ErrorMessage from './ErrorMessage.jsx';
import Footer from './Footer.jsx';
import Logo from './Logo.jsx';
import SignIn from './SignIn.jsx';
import Topbar from '../layout/Topbar';
import { fetchApi } from "../actions/Api";
import theme from '../../theme';


const styles = {
    paper: {
        marginTop: theme.spacing(12),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
    },
};


const mapStateToProps = state => {
  return { app: state.app };
};

function mapDispatchToProps(dispatch) {
  return {
    fetchApi: () => dispatch(fetchApi())
  };
}


class App extends Component {
    componentDidMount() {
        this.props.fetchApi();
    }
    render() {
        const { app, classes } = this.props;
        const { component, fetching, username } = app;
        let content = null;
        if (fetching) {
            content = (<Logo />);
        } else if (username == null) {
            content = (<SignIn />);
        } else if (component != null) {
            if (component === 'BL') {
                content = (<BenchmarkListing />);
            }
        }
        return (
            <div>
                <Topbar />
                <Container className={classes.paper} maxWidth="xl">
                {content}
                </Container>
                <ErrorMessage />
                <Footer />
            </div>
        );
    }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(App));
