import { Button, createStyles, makeStyles, Theme } from '@material-ui/core';
import { ICalendarEvent } from '@models/event';
import React from 'react'
import { ToolbarProps } from 'react-big-calendar';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        toolbar: {
            display: 'flex',
            justifyContent: 'space-between'
        },
        selectedView: {
            border: '1px solid'
        }
    }));

const customToolbar = ({ view, views, onView, date, children, label, onNavigate, dispatch }: ToolbarProps<ICalendarEvent, object> & { dispatch?: any }) => {
    const classes = useStyles();
    return (<div className={classes.toolbar}>
        <div>
            <Button onClick={() => onNavigate('TODAY')}>Today</Button>
            <Button onClick={() => onNavigate('PREV')}>Previous</Button>
            <Button onClick={() => onNavigate('NEXT')}>Next</Button>
        </div>
        <div>
            {(views as any).map(v =>
                <Button className={view === v ? classes.selectedView : ''} onClick={() => onView(v)} key={v}>{v}</Button>
            )}
        </div>
    </div>)
}

export default connect()(customToolbar)