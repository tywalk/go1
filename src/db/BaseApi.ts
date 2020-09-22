export default abstract class BaseApi {
    protected endpoint = 'https://5f62f652363f0000162d7dcc.mockapi.io/api/v1/';
    abstract get<T>(id: string): Promise<T>;
    abstract getMany<T>(): Promise<T[]>;
    abstract put(id: string): Promise<any>;
    abstract post(id: string): Promise<any>;
}