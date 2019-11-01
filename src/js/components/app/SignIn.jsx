import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { submitLogin } from "../../actions/Auth";
import theme from '../../../theme';


// Use higher-order component API to create styles for the sign in form
const styles = {
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    }
};


const mapStateToProps = state => {
  return { api: state.api };
};


function mapDispatchToProps(dispatch) {
  return {
    submitLogin: (api, username, password) => dispatch(submitLogin(api, username, password))
  };
}


class SignIn extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {username: '', password: ''};
        //this.handleChange = this.handleChange.bind(this);
    }
    /**
     * Change handler for text controls. Update the state of the control in the
     * component.
     */
    handleChange = (event) => {
        if (event.target.id === 'username') {
            this.setState({username: event.target.value});
        } else {
            this.setState({password: event.target.value});
        }
    }
    render() {
        const { classes, username, password } = this.props;
        return (
            <Container component="main" maxWidth="xs">
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <div className={classes.form} noValidate>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={this.handleChange}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={this.handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.submit}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </Container>
        );
    }
    /**
     * Submit user credentials for authentication to retrieve an access token.
     */
    submit = () => {
        const {api} = this.props;
        const {username, password} = this.state;
        if (username === '') {
            alert('No user name given');
        } else if (password === '') {
            alert('No password given');
        } else {
            this.props.submitLogin(api, username, password);
        }
    }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SignIn));
