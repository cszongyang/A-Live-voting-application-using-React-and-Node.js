var express = require('express');
var app = express();


//store all the connected sockets.
var connections = [];

//store all the audience that has entered.
var audience = [];
//only one speaker.
var speaker = {};

var questions = require('./app-questions');
var currentQuestion = false;
var results = {
    a: 0,
    b: 0,
    c: 0,
    d: 0
}; 

var title = 'Untitled Presentation';
var _ = require('underscore');

app.use(express.static('./public'));
app.use(express.static('./node_modules/bootstrap/dist'));

var server = app.listen(3000);
var io = require('socket.io').listen(server);


io.sockets.on('connection',function(socket){
  
    socket.once('disconnect',function(){

        var member = _.findWhere(audience, {id: this.id});
        if(member){
            audience.splice(audience.indexOf(member),1);
            io.sockets.emit('audience', audience);
            console.log(member.name + " left; " + " now "+ audience.length + " members left");
        }
        //Speaker is left, the presentation is over.
        else if(this.id === speaker.id){
            console.log('The speaker is left. The Presentation is over.');
            speaker={};
            title = 'Untitled Presentation';
            io.sockets.emit('end',{title:title, speaker:''});
        }


    	connections.splice(connections.indexOf(socket),1);
    	socket.disconnect();
    	console.log('Disconnected: %s sockets remaining', connections.length);
    });
 

    //handles the case when a question comes in
    socket.on('ask', function(question) {
        currentQuestion = question;
        results = {a:0, b:0, c:0, d:0};
        io.sockets.emit('ask', currentQuestion);
        console.log("Question Asked: '%s'", question.q);
    });

    socket.on('answer', function(payload) {
        results[payload.choice]++;
        io.sockets.emit('results', results);
        console.log("Answer: '%s' - %j", payload.choice, results);
    });
    
    //send signal back to all the clients when a new one comes in
    socket.emit('welcome',{
        title: title,
        audience: audience,
        speaker: speaker.name,
        questions: questions,
        currentQuestion: currentQuestion,
        results: results
    });
    //A speaker joins
    socket.on('start',function(payload){

        speaker.name = payload.name;
        speaker.id = this.id;
        speaker.type = 'speaker';
        title = payload.title; 
        this.emit('joined', speaker);
        io.sockets.emit('start', { title: title, speaker: speaker.name });
        console.log("Presentation started: %s by %s", title, speaker.name);
    });
 
    //handles a member joining in
    socket.on('join',function(payload){
        var newMember = {
            id: this.id,
            name: payload.name,
            type: 'member'
        };
        
        this.emit('joined', newMember);
        audience.push(newMember);
        io.sockets.emit('audience', audience);
        console.log(payload.name + "joined");
    });



	connections.push(socket);
    console.log('connected: %s sockets connected',connections.length);
});

console.log("polling server is running at localhost:3000");




