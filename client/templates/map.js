
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


    self.autorun(function(){
      var parkingareas = ParkingareasCollection.find({}).fetch();
      mapController.registerParkingAreas(parkingareas);
    });
    
/*
    var latLng = Geolocation.latLng();
    if(latLng){
      var secondaryMarker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat-0.005, latLng.lng-0.004),
        title: 'Bredsands strand',
        icon: '/images/beachflag.png',
        map: map.instance,
      });
    }
*/
    
    //Create and move the marker when latLng changes
    self.autorun(function(){
      var latLng = Geolocation.latLng();
      if(!latLng)
        return;

      mapController.setPosition(latLng);
    });
    
  

  });

});
