import BaseApi from './BaseApi';
import fetch from 'node-fetch';

export default class Location extends BaseApi {
    constructor(){
        super();
    }
    async get<T>(id: string){
        const req = await fetch(`${this.endpoint}locations/${id}`, {
            method: 'GET'
        });
        return await req.json() as T;
    }
    async getMany<T>(){
        const req = await fetch(`${this.endpoint}locations`, {
            method: 'GET'
        });
        return await req.json() as T[];
    }
    async post(){}
    async put(){}
}