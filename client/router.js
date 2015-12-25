/* global Router */
Router.configure({
	layoutTemplate: 'foundation_layout' 
});

Router.route('/', function(){
	this.render('page_map');
}, { name: 'parking'});

Router.route('/parkinglot/:_id', {
    name: 'parkinglot.show', 
    data: function(){
        //console.log('loading data for parkinglot.show');
        var id = new Meteor.Collection.ObjectID(this.params._id);
        var item = ParkingLotsCollection.findOne({ _id: id});
        return item;
    } 
});

Router.route('/Schedule', function(){
//	this.layout('foundation_layout');
	this.render('page_schedule');
}, { name: 'schedule'});
