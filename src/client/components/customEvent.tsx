import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { ICalendarEvent } from '@models/event';
import React from 'react'
import { EventWrapperProps } from 'react-big-calendar';
import { connect } from 'react-redux'

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
        }
    }));

export default ({ event, accessors, onClick, dispatch }: EventWrapperProps<ICalendarEvent> & { dispatch?: any }) => {
    const classes = useStyles();
    const title = accessors.title(event);
    const [selected, setSelected] = React.useState(false);
    const onSelect = (ev) => {
        setSelected(true);
        onClick(event as any);
    }
    return (<div title={title} className="event-button">
        <Button className={selected ? classes.selected : classes.event} size="small" onClick={(ev) => onSelect(ev)}>{title}</Button>
    </div>)
}