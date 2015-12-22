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
  var self = this;
  
  GoogleMaps.ready('map', function(map){
    var marker;

/*
    var latLng = Geolocation.latLng();
    if(latLng){
      var secondaryMarker = new google.maps.Marker({
        position: new google.maps.LatLng(latLng.lat+0.1, latLng.lng),
        map: map.instance
      });
    }
*/

    
    //Create and move the marker when latLng changes
    self.autorun(function(){
      var latLng = Geolocation.latLng();
      if(!latLng)
        return;
        
      if(!marker){
        //If the marker doesn't yet exist, create it
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(latLng.lat, latLng.lng),
          map: map.instance
        });
      }
      else{
        //The marker already exists, so we'll just change its position
        marker.setPosition(latLng);
      }
      
      //Center and zoom the map view onto the current position
      map.instance.setCenter(marker.getPosition());
      map.instance.setZoom(MAP_ZOOM);
    });
    
  });
  
  
});
