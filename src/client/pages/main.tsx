import React from 'react'
import { IEvent, ICalendarEvent } from '@models/event';
import httpService from '@clientServices/httpService';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'

const localizer = momentLocalizer(moment);
export default () => {
    const [events, setEvents] = React.useState<ICalendarEvent[]>();
    const eventSelected = React.useCallback((ev)=>{
        alert(ev.title);
    }, []);

    React.useEffect(() => {
        const getEvents = async () => {
            const request = await httpService.Get('/api/events/');
            const evs = await request.json() as IEvent[];
            setEvents(evs.map(({title, time})=>({
                title,
                start: new Date(time),
                end: new Date(time)
            })));
        }
        getEvents();
    }, [])

    return (<>
        {events && 
        <Calendar
            localizer={localizer}
            events={events}
            startAcessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            onSelectEvent={(ev, e) => eventSelected(ev)}
        />}
    </>)
}