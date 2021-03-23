var express = require('express');
var router = express.Router();
const axios = require('axios');
const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 43200, checkperiod: 43000 });

/* GET users listing. */
router.get('/:papel', function(req, res, next) {
    var papel = req.params.papel;

    if (myCache.get(papel)) {
        //console.log("*************from cache", papel);
        //console.log("****************** *TTL", new Date(myCache.getTtl(papel)).toUTCString())
        res.send(myCache.get(papel))
    } else {
        axios.get(`https://query1.finance.yahoo.com/v1/finance/search?q=${papel}`)
            .then((response) => {
                if (response.data['quotes'].length == 0) {
                    res.status = 404
                    res.end()
                } else {
                    //console.log('Looking for symbol:', response.data['quotes'][0]['symbol']);
                    return response.data['quotes'][0]['symbol']
                }
            })
            .then((symbol) => axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d&corsDomain=finance.yahoo.com&.tsrc=finance`))
            .then((response) => {
                    const dates = response.data.chart.result[0].timestamp
                    const quotes = response.data.chart.result[0].indicators.quote[0].close
                    let data = []
                        //console.dir(dates)
                    dates.forEach((d, i) => {
                        if (quotes[i] > 0) {
                            let a = new Date((Number)(d + '000'))
                            data.push({ 'date': a.toLocaleDateString(), 'quote': quotes[i].toFixed(2) })
                        }
                    });

                    myCache.set(papel, data);
                    res.send(data)
                }

            )
            .catch(function(error) {
                //console.log(error)
                next(error);
            })
    }

});


module.exports = router;