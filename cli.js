#!/usr/bin/env node

'use strict';

const fs = require('fs');
const http = require('follow-redirects').http;
const mkdirp = require('mkdirp');
const colors = require('colors');

colors.setTheme({
	error: ['red', 'bold']
});

colors.setTheme({
	info: ['cyan', 'bold']
});

colors.setTheme({
	normal: ['green', 'bold']
});

const argv = require('yargs')
  .usage(colors.cyan('\nUsage: $0 -u [/user.id] -n [file name]'))
  .demand(['u', 'n'])
  .describe('u', 'ID of facebook user')
  .describe('n', 'File name')
  .argv;

const imageIn = './Images/';

const removeSlash = imageIn.replace('./', '');

mkdirp(imageIn, function (err) {
	if (err) {
		console.error(err);
	}	else {
		console.log('\n\tDirectory Created : ' + removeSlash);
	}
});

console.log('\n\tDownload in Progress');

const file = fs.createWriteStream(imageIn + argv.n + '.jpg');

http.get('http://graph.facebook.com/' + argv.u + '/picture?width=800', function (res) {
	res.pipe(file);
	console.log('\n\tImage Saved\n');
}).on('error', function (err) {
	console.error(err);
});

