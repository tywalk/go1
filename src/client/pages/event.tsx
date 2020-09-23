import React from 'react';
import httpService from '@clientServices/httpService';
import { Avatar, Button, Card, Container, createStyles, Grid, makeStyles, Theme, Typography } from '@material-ui/core';
import { IEvent } from '@models/event';
import { CalendarToday, LocationOn, Description, ChevronLeft, EventSeat } from '@material-ui/icons';
import dayjs from 'dayjs';
import EventBar from '@components/eventBar';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        textWrapper: {
            display: 'flex',
            marginBottom: 25
        },
        text: {
            marginLeft: 15
        },
        title: {
            marginBottom: 20
        },
        card: {
            padding: 20
        },
        link: {
            textDecoration: 'none',
            color: 'black'
        },
        avatar: {
            margin: 5
        },
        gridItem: {
            paddingRight: 10
        },
        img: {
            marginLeft: 30
        }
    }));

export default (props) => {
    const classes = useStyles();
    const [event, setEvent] = React.useState<IEvent>();
    React.useEffect(() => {
        const init = async () => {
            const id = props.match.params.id;
            const evreq = await httpService.Get(`/api/events/event/${id}`);
            const ev = await evreq.json() as IEvent;
            setEvent(ev);
        }
        init();
    }, [])
    return (<>
        <EventBar />
        <Container>
            <Button><ChevronLeft /><Link to="/" className={classes.link}> Back to Calendar</Link></Button>
            <Card className={classes.card}>
                <Grid container justify="space-evenly" wrap="nowrap">
                    <Grid item className={classes.gridItem}>
                        {event && <>
                            <Typography variant="h4" className={classes.title}>{event?.title}</Typography>
                            <Typography className={classes.textWrapper}><CalendarToday /> <span className={classes.text}>{dayjs(event?.time).format('LLLL')}</span></Typography>
                            <Typography className={classes.textWrapper}>
                                <LocationOn />{' '}
                                <div>
                                    <div><b className={classes.text}>{event?.location?.name}</b></div>
                                    <span className={classes.text}>{event?.location?.city}, {event?.location?.state}, {event?.location?.country}</span>
                                </div>
                            </Typography>
                            <Typography className={classes.textWrapper}><Description /> <span className={classes.text}>{event?.description}</span></Typography>
                            <Typography className={classes.textWrapper}><EventSeat />
                                <div className={`${classes.text} ${classes.textWrapper}`}>
                                    {event.availableSeats?.length > 0 ?
                                        event.availableSeats?.map(e => <Avatar key={e.id} className={classes.avatar}>{e.seat}</Avatar>) :
                                        '(None available)'}</div>
                            </Typography>
                            <div className={classes.img}>
                                <img src={event.image} height={200} />
                            </div>
                        </>}
                    </Grid>
                    <Grid item>
                        {event?.location &&
                            <iframe
                                width="500"
                                height="450"
                                frameBorder="0" style={{ border: 0 }}
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAq91SptPXHDAlHSvg1dC72rABCIEo3i_0
    &q=${event?.location?.name}`} allowFullScreen>
                            </iframe>}
                    </Grid>
                </Grid>
            </Card>
        </Container>
    </>)
}