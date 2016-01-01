Meteor.methods({
    updateTimeslot: function(item){
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        
        console.log('updateTimeslot() on server');
        console.log(item);
        
        ParkingareasCollection.update({
            _id: item._id,
            'lots.id': item.lots.id
        }, {
            $set: { 'lots.$.from': item.lots.from }
        });
        console.log('updateTimeslot() on server DONE');
        
        var all = ParkingareasCollection.find({}).fetch();
        console.dir(all);
    } 
});