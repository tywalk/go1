import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import { KeyboardDatePicker, MuiPickersUtilsProvider, useUtils } from '@material-ui/pickers'
import httpService from '@clientServices/httpService';
import ILocation from '@models/event/location';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs'
import { connect } from 'react-redux';
import { setDate, setLocation } from 'actions';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
            marginBottom: 50
        },
        title: {
            flexGrow: 1,
            display: 'none',
            [theme.breakpoints.up('sm')]: {
                display: 'block',
            },
        },
        link: {
            textDecoration: 'none',
            color: 'black'
        }
    }),
);

const eventBar = ({ dispatch, filters }) => {
    const classes = useStyles();

    return (
        <MuiPickersUtilsProvider utils={DayjsUtils}>
            <div className={classes.root}>
                <AppBar position="static" color="secondary">
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
                            <Button><Link to="/" className={classes.link}>Events Calendar - Tech Challenge</Link></Button>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default connect((state: any) => ({ filters: state.filters }))(eventBar)