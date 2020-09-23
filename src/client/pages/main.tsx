import React from 'react'
import { IEvent, ICalendarEvent } from '@models/event';
import httpService from '@clientServices/httpService';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import GridBar from '@components/gridBar';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { CalendarToday, LocationOn, Description, OpenInNew, EventSeat } from '@material-ui/icons'
import { connect } from 'react-redux';
import { setDate } from 'actions';
import customToolbar from '@components/customToolbar'
import customEvent from '@components/customEvent'
import { Link } from 'react-router-dom';

dayjs.extend(localizedFormat);

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        event: {
            backgroundColor: theme.palette.primary.main,
            width: '100%',
            borderRadius: 0,
            color: 'white'
        },
        selected: {
            backgroundColor: theme.palette.primary.dark,
            width: '100%',
            borderRadius: 0,
            color: 'white'
        },
        modalTextWrapper: {
            display: 'flex'
        },
        modalText: {
            marginLeft: 15
        },
        toolbarViews: {
            float: 'right'
        },
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        selectedView: {
            border: '1px solid'
        },
        link: {
            textDecoration: 'none',
            color: 'black',
            fontSize: '16px'
        },
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        }
    }));

const localizer = momentLocalizer(moment);

const main = ({ filters, dispatch }) => {
    const classes = useStyles();
    const [events, setEvents] = React.useState<ICalendarEvent[]>();
    const [rendered, setRendered] = React.useState<boolean>(false);
    const [selectedEvent, setSelected] = React.useState<ICalendarEvent>();
    const [showDetails, setDetailsVisible] = React.useState<boolean>(false);
    const [backdropOpen, setBackdropOpen] = React.useState(false);
    const eventSelected = React.useCallback((ev) => {
        setSelected(ev);
        setDetailsVisible(true);
    }, []);

    /** Closes details modal. */
    const closeModal = () => {
        setDetailsVisible(false);
    }
    /** Closes backdrop. */
    const handleClose = () => {
        setBackdropOpen(false);
    };
    /** Opens backdrop. */
    const handleOpen = () => {
        setBackdropOpen(true);
    };

    /**
     * Callback function for calendar navigation.
     * @param newDate 
     * @param view 
     * @param action 
     */
    const onNavigate = (newDate: Date, view, action) => {
        dispatch(setDate(newDate));
    }

    //Retrieve all events
    React.useEffect(() => {
        const getEvents = async () => {
            const request = await httpService.Get('/api/events/');
            const evs = await request.json() as IEvent[];
            setEvents(evs.map(mapEvents));
        }
        getEvents();
    }, []);

    /** Maps event to Calendar Event. */
    const mapEvents = ({ title, time, location, description, id, availableSeats }: IEvent) => ({
        title,
        start: new Date(time),
        end: new Date(time),
        location,
        description,
        id,
        availableSeats: availableSeats?.length
    })

    //Execute search when filters change
    React.useEffect(() => {
        const searchEvents = async () => {
            handleOpen();
            const request = await httpService.Post('/api/events/search', { location: filters?.location, keyword: filters?.search });
            const evs = await request.json() as IEvent[];
            setEvents(evs.map(mapEvents));
            handleClose();
        }
        if (!rendered)
            setRendered(true);
        else
            searchEvents();
    }, [filters]);

    return (<>
        <GridBar />
        {events && <>
            <Backdrop className={classes.backdrop} open={backdropOpen}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Calendar
                localizer={localizer}
                events={events}
                // startAcessor="start"
                // endAccessor="end"
                onNavigate={onNavigate}
                date={filters?.date}
                style={{ height: 500 }}
                onSelectEvent={(ev, e) => eventSelected(ev)}
                components={{
                    toolbar: customToolbar,
                    eventWrapper: (props) => customEvent({ onClick: eventSelected, ...props })
                }}
            /></>}
        <Dialog
            open={showDetails}
            onClose={closeModal}>
            <DialogTitle><Button><Link to={`/event/${selectedEvent?.id}`} className={classes.link}>{selectedEvent?.title} <OpenInNew /></Link></Button></DialogTitle>
            <DialogContent>
                <DialogContentText className={classes.modalTextWrapper}><CalendarToday /> <span className={classes.modalText}>{dayjs(selectedEvent?.start).format('LLLL')}</span></DialogContentText>
                <DialogContentText className={classes.modalTextWrapper}>
                    <LocationOn />{' '}
                    <div>
                        <div><b className={classes.modalText}>{selectedEvent?.location?.name}</b></div>
                        <span className={classes.modalText}>{selectedEvent?.location?.city}, {selectedEvent?.location?.state}, {selectedEvent?.location?.country}</span>
                    </div>
                </DialogContentText>
                <DialogContentText className={classes.modalTextWrapper}><Description /> <span className={classes.modalText}>{selectedEvent?.description}</span></DialogContentText>
                <DialogContentText className={classes.modalTextWrapper}><EventSeat /> <span className={classes.modalText}>{selectedEvent?.availableSeats}</span></DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    OK
          </Button>
            </DialogActions>
        </Dialog>
    </>)
}

export default connect((state: any) => ({ filters: state.filters }))(main);