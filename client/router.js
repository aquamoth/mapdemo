/* global Router */
Router.configure({
	layoutTemplate: 'foundation_layout' 
});

Router.route('/', { name: 'home.show', layoutTemplate: 'foundation_layout_empty' });

Router.route('/parking', { name: 'parking.show'});

Router.route('/parkinglot/:_id', {
    name: 'parkinglot.show', 
    data: function(){
        //console.log('loading data for parkinglot.show');
        var id = new Meteor.Collection.ObjectID(this.params._id);
        var item = ParkingLotsCollection.findOne({ _id: id});
        return item;
    } 
});

Router.route('/schedule', { name: 'schedule.show'});
