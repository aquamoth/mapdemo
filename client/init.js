/* global Meteor, Template */
/* global GoogleMaps, google */
var MAP_ZOOM = 15;
console.log('Zoom is ' + MAP_ZOOM);


Meteor.startup(function(){
  GoogleMaps.load();  
});

Template.map.helpers({
  geolocationError: function(){
    var error = Geolocation.error();
    return error && error.message;
  },
  
  mapOptions: function(){
    var latLng = Geolocation.latLng();
    //Initialize the map once we have the latLng
    if(GoogleMaps.loaded() && latLng){
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: MAP_ZOOM
      };
    }
  }
});

Template.map.onCreated(function(){
  GoogleMaps.ready('map', function(map){
    var latLng = Geolocation.latLng();
    
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latLng.lat, latLng.lng),
      map: map.instance
    });
  });
});
