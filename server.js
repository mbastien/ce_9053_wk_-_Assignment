var express = require('express');
var fs = require('fs');
var JSON = require('JSON');
var _ = require('underscore');

var app = express();

app.set("view engine", "jade"); // prevent Error: No default engine


var tabs = [
    {title : "Home", name : ""},
    {title : "People", name : "people"},
    {title : "Things", name : "things"},
];

// var things = [
//     {id : 1, name : "Rock"},
//     {id : 2, name : "Paper"},
//     {id : 3, name : "Scissors"}
// ];

// var people = [
//     {id : 1, name : "Larry"},
//     {id : 2, name : "Curly"},
//     {id : 3, name : "Moe"}
// ];

app.locals.pretty = true; // make source pretty

var _data;
app.use(function(req, res, next){
    if(_data){
        res.locals.data = _data;
        return next();
    }
    fs.readFile("data/data.js", function(err, dataStream){
        if(err){
            return next(err);
        };
        try{
            _data = JSON.parse(dataStream.toString());
            res.locals.data = _data;
            next();
            // console.log(data);
            // res.render("things/things", { things : data.things, tabs : tabs, selected : "Things"}); 
        } catch(e) {
            next(e);
        }
    });
});

var thingsRouter = express.Router();

app.use("/things", thingsRouter);

app.get("/", function(req, res){ // request, response
    res.render("index", {tabs : tabs, selected : "Home"});
    
});

thingsRouter.get("/", function(req, res, next){ // request, response
    
    // fs.readFile("data/data.js", function(err, dataStream){
    //     if(err){
    //         return next(err);
    //     };
        try{
            // var data = JSON.parse(dataStream.toString());
            // console.log(data);
            res.render("things/things", { things : res.locals.data.things, tabs : tabs, selected : "Things"}); 
        } catch(e) {
            next(e);
        }
    // });
    
});

app.use(function(req, res, next){
    res.locals.tabs = tabs;
    next();
});

thingsRouter.get("/:id", function(req, res){ // request, response
    var thing = _.find(res.locals.data.things, function(thing){
        return thing.id == req.params.id;
    });
    // for(var i = 0; i < res.locals.data.things.length; i++){
    //     if(req.params.id == res.locals.data.things[i].id){
    //         thing = res.locals.data.things[i];
    //         break;
    //     };
    // };
    res.render("things/thing", { thing : thing, tabs : tabs, selected : "Things"});
    
});

app.get("/people", function(req, res){ // request, response
    console.log("received request : " + req);
    //res.send("<html><body><h1>hello world.  rand = " + Math.random() + "</h1></body></html>");
    res.render("people/people", { things : res.locals.data.people, tabs : tabs, selected : "People"});
    
});

app.get("/people/:id", function(req, res){ // request, response
    var person = _.find(res.locals.data.people, function(person){
        return person.id == req.params.id;
    });
    res.render("people/person", { thing : person, tabs : tabs, selected : "People"});
    
});

app.use(function(err, req, res, next){
    res.send("Error page : " + err);
});

app.listen(process.env.PORT);