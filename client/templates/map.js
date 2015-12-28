
Template.map.helpers({
  geolocationError: function(){
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function(){
    var latLng = Geolocation.latLng();
    //Initialize the map once we have the latLng
    var MAP_ZOOM = Session["MAP_ZOOM"];
    if(GoogleMaps.loaded() && latLng){
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: MAP_ZOOM,
        scaleControl: true
      };
    }
  }
});


Template.map.onCreated(function(){
  var self = this;
  GoogleMaps.ready('map', function(map){
    var mapController = new MapController(map.instance);

    //Add markers for available parkingareas
    self.autorun(function(){
      var parkingareas = ParkingareasCollection.find({}).fetch();
      mapController.registerParkingAreas(parkingareas);
    });
    
    //Track the current position on the map
    self.autorun(function(){
      var latLng = Geolocation.latLng();
      if(!latLng)
        return;
      mapController.setCurrentPosition(latLng);
    });

  });
});
