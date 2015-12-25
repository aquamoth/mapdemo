/* global Template */
/* global ParkingLotsCollection */
Template.ParkinglotShow.helpers({
  item: function(id){
      console.log('ParkinglotShow: item for id: ' + id);
      var result = ParkingLotsCollection.findOne({_id: id});
      console.dir(result);
      return result;
  }
});
