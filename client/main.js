/* global ParkingareasCollection */
/* global Meteor, Session, Template, Mongo */
/* global GoogleMaps, google */

Meteor.startup(function(){
  GoogleMaps.load();  
});

/*
Template.body.helpers({
  parkingareas: function(){
    return ParkingareasCollection.find({});
  }
});
*/

/*
Template.ParkingShow.onRendered(function(){
	$(document).foundation();
});
*/
