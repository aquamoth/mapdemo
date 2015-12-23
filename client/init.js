/* global ParkingLotsCollection */
/* global Meteor, Template, Mongo */
/* global GoogleMaps, google */
var MAP_ZOOM = 15;

Meteor.startup(function(){
  GoogleMaps.load();  
});

Template.bottom_menu.helpers({
  currentRoute: function(){
   return Router.current().route.getName();
  },
});


Template.body.helpers({
  parkinglots: function(){
    return ParkingLotsCollection.find({});
  }
});


Template.page_map.onRendered(function(){
	$(document).foundation();
});

Template.page_schedule.helpers({
  currentPosition: function(){
      var latLng = Geolocation.latLng();
      return latLng;
  }
})

  
Template.map.helpers({
  geolocationError: function(){
    var error = Geolocation.error();
    return error && error.message;
  },
  currentRoute: function(){
    return Router.current().route.getName();
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
    console.log('Google map is ready');

    var allParkinglots = ParkingLotsCollection.find({});
    console.dir(allParkinglots);
    console.log('Looping through parking lots');
    allParkinglots.forEach(function(parkinglot){
      //console.log(JSON.stringify(allParkinglots, null, 2));
        console.dir(parkinglot);

        var parkinglotMarker = new google.maps.Marker({
          position: new google.maps.LatLng(parkinglot.lat, parkinglot.lng),
          title: parkinglot.title,
          icon: '/images/beachflag.png',
          map: map.instance,
        });

        console.log('Added marker ');
        console.dir(parkinglotMarker);

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
