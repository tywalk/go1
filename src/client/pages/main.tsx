import React from 'react'
import { IEvent, ICalendarEvent } from '@models/event';
import httpService from '@clientServices/httpService';
import { Calendar, CalendarProps, momentLocalizer, ToolbarProps, EventProps, EventWrapperProps } from 'react-big-calendar';
import moment from 'moment';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon } from '@material-ui/core';
import GridBar from '@components/gridBar';
import { createStyles, fade, Theme, makeStyles } from '@material-ui/core/styles';
import { IApiEvent } from '@models/event/event';
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { CalendarToday, LocationOn, Description } from '@material-ui/icons'
import { connect } from 'react-redux';
import { setDate } from 'actions';
import customToolbar from '@components/customToolbar'
import customEvent from '@components/customEvent'

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
        }
    }));

const localizer = momentLocalizer(moment);

const main = ({ filters, dispatch }) => {
    const classes = useStyles();
    const [events, setEvents] = React.useState<ICalendarEvent[]>();
    const [rendered, setRendered] = React.useState<boolean>(false);
    const [selectedEvent, setSelected] = React.useState<ICalendarEvent>();
    const [showDetails, setDetailsVisible] = React.useState<boolean>(false);
    const eventSelected = React.useCallback((ev) => {
        setSelected(ev);
        setDetailsVisible(true);
    }, []);

    /** Closes details modal. */
    const closeModal = () => {
        setDetailsVisible(false);
    }

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
            setEvents(evs.map(({ title, time, location, description }) => ({
                title,
                start: new Date(time),
                end: new Date(time),
                location,
                description
            })));
        }
        getEvents();
    }, []);

    //Execute search when filters change
    React.useEffect(() => {
        const searchEvents = async () => {
            const request = await httpService.Post('/api/events/search', { location: filters?.location });
            const evs = await request.json() as IEvent[];
            setEvents(evs.map(({ title, time, location, description }) => ({
                title,
                start: new Date(time),
                end: new Date(time),
                location,
                description
            })));
        }
        if (!rendered)
            setRendered(true);
        else
            searchEvents();
    }, [filters]);

    return (<>
        <GridBar />
        {events &&
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
            />}
        <Dialog
            open={showDetails}
            onClose={closeModal}>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogContent>
                <DialogContentText className={classes.modalTextWrapper}><CalendarToday /> <span className={classes.modalText}>{dayjs(selectedEvent?.start).format('LLLL')}</span></DialogContentText>
                <DialogContentText className={classes.modalTextWrapper}>
                    <LocationOn />{' '}
                    <div><b className={classes.modalText}>{selectedEvent?.location?.name}</b></div>
                    <span className={classes.modalText}>{selectedEvent?.location?.city},{selectedEvent?.location?.state},{selectedEvent?.location?.country}</span>
                </DialogContentText>
                <DialogContentText className={classes.modalTextWrapper}><Description /> <span className={classes.modalText}>{selectedEvent?.description}</span></DialogContentText>
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