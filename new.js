#!/usr/bin/env node

'use strict';

const http = require('follow-redirects').http;

const https = require('follow-redirects').https;

const fs = require('fs');

const mkdirp = require('mkdirp');

const colors = require('colors/safe');

const argv = require('yargs')

.usage(colors.cyan.bold('\nUsage : $0 -u <command> [info] <command> [file]'))

.command('u', colors.cyan.bold('❱ ') + 'facebook user\'s username')

.command('i', colors.cyan.bold('❱ ') + 'facebook user\'s user-id')

.demand(['n'])

.describe('n', colors.cyan.bold('❱ ') + 'save image as')

.argv;

const updateNotifier = require('update-notifier');

const idFinder = {

    hostname: 'www.facebook.com',

    port: 443,

    path: '/' + argv.u,

    method: 'GET',

    headers: {

        'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',

        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',

        'Host': 'www.facebook.com',

        'Connection': 'Keep-Alive',

        'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'
    }
};

const userID = {

    hostname: 'www.facebook.com',

    port: 443,

    path: '/' + argv.i,

    method: 'GET',

    headers: {

        'accept': 'text/html,application/json,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',

        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36',

        'Host': 'www.facebook.com',

        'Connection': 'Keep-Alive',

        'Accept-Language': 'en-GB,en-US;q=0.8,en;q=0.6'

    }

};

const folderName = './Image/';

mkdirp(folderName, err => {
    if (err) {
        console.error(err);
        process.exit(1);
    } else {
        console.log('Direcotry Created');
    }
});

if (argv.i) {
    const getUserID = https.request(userID, res => {
        if (res.statusCode === 200) {
            console.log('user found');
        } else {
            console.log('not done!');

            process.exit(1);
        }

        let storeData = '';

        res.setEncoding('utf8');

        res.on('data', d => {

            storeData += d;

        });

        res.on('end', () => {

            const matchPattern = new RegExp(/entity_id":"\d*/);

            const arrMatches = storeData.match(matchPattern);

            if (arrMatches && arrMatches[0]) {
                const getID = arrMatches[0].replace('entity_id":"', '');

                const getImageIn = fs.createWriteStream(folderName + argv.n + '.jpg');
                http.get('http://graph.facebook.com/' + getID +'/picture?width=1600', res => {
                        res.pipe(getImageIn);
                        console.log('image saved');
                    }).on('error', err => {
                    console.error(err);
                    process.exit(1);
                });
            } else {
                process.exit(1);
            }
        });
    });
    getUserID.end();
}