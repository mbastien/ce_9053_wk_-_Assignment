var express = require('express');
var fs = require('fs');
var JSON = require('JSON');
var _ = require('underscore');

var app = express();

app.set("view engine", "jade"); // prevent Error: No default engine


var tabs = [
    {title : "Home", name : ""},
    {title : "Drivers", name : "drivers"},
    {title : "Teams", name : "teams"},
];


app.locals.pretty = true; // make source pretty

var _data;
app.use(function(req, res, next){
    if(_data){
        res.locals.data = _data;
        return next();
    }
    fs.readFile("data/f1_data.js", function(err, dataStream){
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

var teamsRouter = express.Router();

app.use("/teams", teamsRouter);

app.get("/", function(req, res){ // request, response
    res.render("index", {tabs : tabs, selected : "Home"});
    
});

teamsRouter.get("/", function(req, res, next){ // request, response
    
    // fs.readFile("data/data.js", function(err, dataStream){
    //     if(err){
    //         return next(err);
    //     };
        try{
            // var data = JSON.parse(dataStream.toString());
            // console.log(data);
            res.render("teams/teams", { teams : res.locals.data.teams, tabs : tabs, selected : "Teams"}); 
        } catch(e) {
            next(e);
        }
    // });
    
});

app.use(function(req, res, next){
    res.locals.tabs = tabs;
    next();
});

teamsRouter.get("/:id", function(req, res){ // request, response
    var team = _.find(res.locals.data.teams, function(team){
        return team._id == req.params.id;
    });
    // for(var i = 0; i < res.locals.data.things.length; i++){
    //     if(req.params.id == res.locals.data.things[i].id){
    //         thing = res.locals.data.things[i];
    //         break;
    //     };
    // };
    res.render("teams/team", { team : team, tabs : tabs, selected : "Teams"});
    
});

app.get("/drivers", function(req, res){ // request, response
//    console.log("received request : " + req);
    //res.send("<html><body><h1>hello world.  rand = " + Math.random() + "</h1></body></html>");
    res.render("drivers/drivers", { drivers : res.locals.data.drivers, tabs : tabs, selected : "Drivers"});
    
});

app.get("/drivers/:id", function(req, res){ // request, response
    var driver = _.find(res.locals.data.drivers, function(driver){
        return driver._id == req.params.id;
    });
    res.render("drivers/driver", { driver : driver, tabs : tabs, selected : "Drivers"});
    
});

app.use(function(err, req, res, next){
    res.send("Error page : " + err);
});

app.listen(process.env.PORT);