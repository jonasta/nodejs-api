var express = require('express');
var router = express.Router();
const axios = require('axios');

router.get('/:papel', function(req, res, next) {
    var papel = req.params.papel;

    axios.get(`https://query1.finance.yahoo.com/v1/finance/search?q=${papel}`)
        .then((response) => {
            if (response.data['quotes'].length == 0) {
                res.status = 404
                res.end()
            } else {
                //console.log('Looking for symbol:', response.data['quotes'][0]['symbol']);
                return response.data['quotes']
            }
        })
        .then((data) => {
            res.send(data)
        })
        .catch(function(error) {
            //console.log(error)
            next(error);
        })

});


module.exports = router;