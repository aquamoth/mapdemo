
Template.ScheduleShow.helpers({
  currentPosition: function(){
      var latLng = Geolocation.latLng();
      return latLng;
  }
})