import BaseApi from './BaseApi';
import fetch from 'node-fetch';

export default class MockEvent extends BaseApi {
    constructor(){
        super();
    }
    async get<T>(id: string){
        const req = await fetch(`${this.endpoint}events/${id}`, {
            method: 'GET'
        });
        return await req.json() as T;
    }
    async getMany<T>(){
        const req = await fetch(`${this.endpoint}events`, {
            method: 'GET'
        });
        return await req.json() as T[];
    }
    async post(){}
    async put(){}
}