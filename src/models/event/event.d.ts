import ILocation from './location';
import ISeat from './seat';

export interface IEvent {
    title: string;
    time: Date;
    image: string;
    location: ILocation;
    description?: string;
    availableSeats: ISeat[];
}

export interface IApiEvent {
    title: string;
    time: string;
    image: string;
    location: string;
    description: string;
    availableSeats: ISeat[];
}

export interface ICalendarEvent{
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
    location?: ILocation;
    description?: string;
}
