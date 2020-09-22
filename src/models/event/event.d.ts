import ILocation from './location';
import ISeat from './seat';

export interface IEvent {
    title: string;
    time: Date;
    image: string;
    location: ILocation;
    availableSeats: ISeat[];
}

export interface IApiEvent {
    title: string;
    time: string;
    image: string;
    location: string;
    availableSeats: ISeat[];
}

export interface ICalendarEvent{
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
}
