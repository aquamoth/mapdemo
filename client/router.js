/* global Router */
Router.configure({
	layoutTemplate: 'foundation_layout' 
});

Router.route('/', { name: 'home.show', layoutTemplate: 'foundation_layout_empty' });

Router.route('/parking', { name: 'parking.show'});

Router.route('/parkingarea/:_id', {
    name: 'parkingarea.show', 
    data: function(){
        //console.log('loading data for parkinglot.show');
        var id = new Meteor.Collection.ObjectID(this.params._id);
        var item = ParkingareasCollection.findOne({ _id: id});
        return item;
    } 
});

Router.route('/schedule', { 
    name: 'schedule.show',
    data: function(){
        var items = ParkingareasCollection.find({});
        return { parkingareas: items };
    }
});
