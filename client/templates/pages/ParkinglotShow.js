/* global Template */
/* global ParkingareasCollection */
Template.ParkinglotShow.helpers({
  item: function(id){
      console.log('ParkinglotShow: item for id: ' + id);
      var result = ParkingareasCollection.findOne({_id: id});
      console.dir(result);
      return result;
  }
});
