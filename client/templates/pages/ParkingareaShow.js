/* global Template */
/* global ParkingareasCollection */
Template.ParkingareaShow.helpers({
  item: function(id){
      console.log('ParkingareaShow: item for id: ' + id);
      var result = ParkingareasCollection.findOne({_id: id});
      console.dir(result);
      return result;
  }
});
