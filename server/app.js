require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(morgan('dev'));
var cache = {};
var oneDay = 24 * 60 * 60 * 1000;
app.get('/', function(request, response) {
    console.log(request.query);

    var query = request.query;

   if (query.i) {

    if (
    cache[query.i] &&
    Date.now() - cache[query.i].timestamp < oneDay
) {
        console.log("Getting movie data from cache");
        response.json(cache[query.i].data);

    } else {
        console.log("Getting movie data from OMDb");

        axios.get('https://www.omdbapi.com/', {
            params: {
                i: query.i,
                apikey: process.env.OMDB_API_KEY
            }
        }).then(function(result) {
            cache[query.i] = {
    data: result.data,
    timestamp: Date.now()
};
            response.json(result.data);
        });
    }
} else if (query.t) {

    if (
        cache[query.t] &&
        Date.now() - cache[query.t].timestamp < oneDay
    ) {
        console.log("Getting movie data from cache");
        response.json(cache[query.t].data);

    } else {
        console.log("Getting movie data from OMDb");

        axios.get('https://www.omdbapi.com/', {
            params: {
                t: query.t,
                apikey: process.env.OMDB_API_KEY
            }
        }).then(function(result) {
            cache[query.t] = {
                data: result.data,
                timestamp: Date.now()
            };

            response.json(result.data);
        });
    }
}
});

module.exports = app;