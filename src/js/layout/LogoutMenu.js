import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { submitLogout } from "../actions/Auth";


const mapStateToProps = state => {
    return { api: state.api, app: state.app };
};


function mapDispatchToProps(dispatch) {
  return {
      submitLogout: (url, token) => dispatch(submitLogout(url, token))
  };
}


const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})(props => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));


const StyledMenuItem = withStyles(theme => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);


function LogoutMenu(props) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = () => {
        handleClose();
        const urls = props.api.urls;
        props.submitLogout(urls.get('logout'))
    };
    const username = props.app.username;
    if (username != null) {
        return (
            <div>
                <IconButton
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick}
                    color="inherit"
                    aria-label="menu"
                >
                    <AccountCircle />
                </IconButton>
                <StyledMenu
                  id="customized-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                <ListSubheader component="div" id="nested-list-subheader">
                  Logged in as {username}
                </ListSubheader>
                    <StyledMenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <ExitToApp fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary='Logout' />
                    </StyledMenuItem>
                    </StyledMenu>
            </div>
        );
    } else {
        return null;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutMenu);
