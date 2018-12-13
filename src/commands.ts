import * as rp from 'request-promise';

export function scheduleBatch(filename: string, schedule: string) {
    console.log('filename', filename);
    console.log('schedule', schedule);
}

export function executeBatch(fileBody: string) {
    console.log('making request');

    const opts = {
        method: 'POST',
        uri: 'http://localhost:56248/app/sfdx/executeanonymous',
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            code: fileBody
        },
        json: true
    };

    rp.post(opts).then(() => {
        console.log('success');
    }).catch(err => console.log('err', err));
}