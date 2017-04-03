'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var customers = [];
var id = 0;
customers.push({id: ++id, name: "Ola", city: "Trondheim"});
customers.push({id: ++id, name: "Kari", city: "Oslo"});
customers.push({id: ++id, name: "Per", city: "Tromsø"});
var multer = require('multer');
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//This resource makes it possible to download and start the React client
app.use(express.static(__dirname + "/../client"));

//Start the web server
//Open for instance http://localhost:3000 in a web browser
var server = app.listen(3000, () => {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


app.get('/get-customers', (req, res) => {

    console.log(req.body);
    // console.log(res);
    res.send(customers);
});

app.put('/add-customer', (req, res) => {
    let customer = req.body['customer'];
    customer.id = ++id;
    customers.push(customer);
    res.send(customer.id + '');
});

app.get('/test', (req, res) => {

    console.log(req.body);
    // console.log(res);
    let str = 'ynono'
    let responsemondo = ({'answ': 'motherfucker'});
   res.send([responsemondo]);
});

app.delete('/delete-customer', (req, res) => {
    let customer = req.body['customer'];
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === customer.id) {
            customers.splice(i,1);
        }
    }
    res.send(true);
});

app.put('/update-customer', (req, res) => {
    console.log(req.body);
    let customer = req.body;
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === customer.id) {
            console.log("hit")
            customers[i] = customer;
        }
    }
    res.send(true);
});

/*Frivillig: om dere løste øving 6 i React, bruk Angular, og
 omvendt, på klientsiden.
 Data skal lagres, endres og hentes fra serveren
 Legg til endring av en kunde mot serveren (bruk HTTP
 metoden PUT)
 Legg til sletting av en kunde mot serveren (bruk HTTP
 metoden DELETE)
 Databaselagring er ikke et krav i øvingen
 Kjør server løsningen i Debian Testing gjennom Docker, og
 prøv ut de ulike server ressursene ved hjelp av telnet*/