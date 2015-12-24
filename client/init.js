/* global ParkingLotsCollection */
/* global Meteor, Session, Template, Mongo */
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

/*
Template.body.helpers({
  parkinglots: function(){
    return ParkingLotsCollection.find({});
  }
});
*/

/*
Template.page_map.onRendered(function(){
	$(document).foundation();
});
*/

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
        zoom: MAP_ZOOM,
        scaleControl: true
      };
    }
  }
});

Template.map.onCreated(function(){
  var self = this;
  var marker;
  var markerCircle;
  var trackCurrentPositionOnMap = true;
  
  GoogleMaps.ready('map', function(map){
    console.log('Google map is ready');
    //console.dir(map);

    var infoWindow = new google.maps.InfoWindow();


    map.instance.addListener('center_changed', function() {
      console.log('Center changed');
      trackCurrentPositionOnMap=false;
    });
/*    
    marker.addListener('click', function() {
      map.setZoom(8);
      map.setCenter(marker.getPosition());
    });
*/

    self.autorun(function(){
      console.log('Looping through parking lots');
  
      var knownParkinglots = Session["parkinglots"] || [];
      console.log('Known parkinglots');
      console.dir(knownParkinglots);
      
      var allParkinglots = ParkingLotsCollection.find({});
      console.dir(allParkinglots);
      allParkinglots.forEach(function(parkinglot){
        console.dir(parkinglot);
  
        var parkinglotMarker = new google.maps.Marker({
          position: new google.maps.LatLng(parkinglot.lat, parkinglot.lng),
          title: parkinglot.title,
          icon: '/images/beachflag.png',
          map: map.instance,
        });
        
        parkinglotMarker.addListener('click', function(){ 
          console.log('Parkinglot marker clicked');
          //showInfoWindowFor(parkinglot); 
          var contentString = 
              '<div id="content">'+
                '<div id="siteNotice">'+'</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + parkinglot.title + '</h1>'+
                '<div id="bodyContent">'+ 
                  descriptionAsHtml(parkinglot.description) +
                  '<p><a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">Read more</a></p>'+
                '</div>'+
              '</div>';
          infoWindow.setContent(contentString);
          infoWindow.open(map.instance, this);

        });
    
        console.log('Added marker');
      });
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

    
        // Create the DIV to hold the control and call the CenterControl() constructor
        // passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map.instance, marker);
        centerControlDiv.index = 1;
        map.instance.controls[google.maps.ControlPosition.BOTTOM].push(centerControlDiv);//TOP_CENTER
      }
      else{
        //The marker already exists, so we'll just change its position
        marker.setPosition(latLng);
      }
      
      if(!markerCircle){
        markerCircle = new google.maps.Circle({
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000FF',
          fillOpacity: 0.35,
          map: map.instance,
          center: latLng,
          radius: 200
        });
      }
      else{
        console.warn('TODO: Should reposition the markerCircle here');
        //markerCircle.setPosition(latLng);
      }
      
      
      if(trackCurrentPositionOnMap){
        //Center and zoom the map view onto the current position
        map.instance.panTo(marker.getPosition());
        map.instance.setZoom(MAP_ZOOM);
      }
    });
    
  
    function showInfoWindowFor(parkinglot){
    }

  });

  function descriptionAsHtml(description){
    return description;//TODO: Convert to html here
  }




  /**
  * The CenterControl adds a control to the map that recenters the map on the current position marker
  * @constructor
  */
  function CenterControl(controlDiv, map, marker) {
    var controlUI = document.createElement('div');
    controlUI.className = 'widget-mylocation-button';
    controlUI.title = 'Click to recenter the map';
    controlDiv.appendChild(controlUI);
  
    var controlIcon = document.createElement('div');
    controlIcon.className='widget-mylocation-button-normal widget-mylocation-cookieless';
    controlUI.appendChild(controlIcon);
  
    controlUI.addEventListener('click', function() {
      map.setCenter(marker.getPosition());
      map.setZoom(MAP_ZOOM);
      console.log('Enabling tracking of current position');
      trackCurrentPositionOnMap=true;
    });
  }
});
