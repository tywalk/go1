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
import { Button, FormControl, InputLabel, Link, MenuItem, Select } from '@material-ui/core';
import DayjsUtils from '@date-io/dayjs';
import dayjs from 'dayjs'
import { connect } from 'react-redux';
import { setDate, setLocation, setSearchFilter } from 'actions';
import _ from 'lodash';

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
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(1),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
        filter: {
            // paddingLeft: 10,
            paddingRight: 25
        },
        select: {
            margin: 0,
            minWidth: 150
        },
        link: {
            textDecoration: 'none'
        }
    }),
);

const gridBar = ({ dispatch, filters }) => {
    const classes = useStyles();
    // const utils = useUtils();
    const [selectedDate, setSelectedDate] = React.useState<dayjs.Dayjs | null>(filters?.date ?? new Date());
    const [locations, setLocations] = React.useState<ILocation[]>([]);
    const [location, setSelectedLocation] = React.useState('99');
    const [search, setSearch] = React.useState('');

    React.useEffect(() => {
        const getLocations = async () => {
            const request = await httpService.Get('/api/events/locations');
            const locs = await request.json() as ILocation[];
            setLocations(locs);
        }
        getLocations();
    }, [])

    const handleDateChange = (date: dayjs.Dayjs) => {
        setSelectedDate(date);
        dispatch(setDate(date.toDate()));
    };
    const handleLocationChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        let loc = event.target.value as string;
        setSelectedLocation(loc);
        if(loc == '99') loc = '';
        dispatch(setLocation(loc));
    };
    const searchChange = (value: string) => {
        setSearch(value);
        handleSearch(value);
    }
    const handleSearch = React.useCallback(_.debounce((value: string) => {
        dispatch(setSearchFilter(value));
    }, 500), [])

    return (
        <MuiPickersUtilsProvider utils={DayjsUtils}>
            <div className={classes.root}>
                <AppBar position="static" color="secondary">
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
                            <Button>Events Calendar - Tech Challenge</Button>
                        </Typography>
                        <div className={classes.filter}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="MM/DD/YYYY"
                                margin="normal"
                                id="date-picker-inline"
                                value={selectedDate}
                                style={{ margin: 0 }}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                            />
                        </div>
                        <FormControl className={classes.filter}>
                            <Select
                                labelId="select-label"
                                id="select"
                                className={classes.select}
                                value={location}
                                onChange={handleLocationChange}
                            >
                                <MenuItem value="99">
                                    All Locations
                                </MenuItem>
                                {locations?.map(l =>
                                    <MenuItem value={l.id} key={l.id}>{l.name}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                // value={search}
                                onChange={(ev) => searchChange(ev.target.value)}
                            />
                        </div>
                    </Toolbar>
                </AppBar>
            </div>
        </MuiPickersUtilsProvider>
    );
}

export default connect((state: any) => ({ filters: state.filters }))(gridBar)