import React, { Component } from "react";
import { connect } from 'react-redux';
import BenchmarkListing from './benchmark/BenchmarkListing';
import ErrorMessage from './ErrorMessage.jsx';
import Footer from './Footer.jsx';
import Logo from './Logo.jsx';
import SignIn from './SignIn.jsx';
import Topbar from '../layout/Topbar';
import { fetchApi } from "../actions/Api";



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
        const { app } = this.props;
        const { component, fetching, username, accessToken } = app;
        let content = null;
        if (fetching) {
            content = (<Logo />);
        } else if ((username == null) || (accessToken == null)) {
            content = (<SignIn />);
        } else if (component === 'BL') {
            content = (<BenchmarkListing />);
        }
        return (
            <div>
                <Topbar />
                {content}
                <ErrorMessage />
                <Footer />
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
