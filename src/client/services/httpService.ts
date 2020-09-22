interface IOptions {
    dataType: string;
    method: string;
    headers?: { [index: string]: string };
    body?: string;
}

var getOptions = function (verb:string, data?: any) {
    var options: IOptions = {
        dataType: 'json',
        method: verb,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    };
    if (data) {
        options.body = JSON.stringify(data);
    }
    return options;
}

export default {
    Get: (path: string)=> {
        return fetch(path, getOptions('GET'))
    },
    Post:  (path: string, data: any)=> {
        return fetch(path, getOptions('POST', data));
    },
    Put:  (path: string, data: any)=> {
        return fetch(path, getOptions('PUT', data));
    },
    Delete:  (path: string)=> {
        return fetch(path, getOptions('DELETE'));
    }
};