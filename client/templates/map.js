
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
    var infoWindow = new google.maps.InfoWindow();


    self.autorun(function(){
      var knownParkingareas = Session["parkingareas"] || [];
      console.log('Known parkingareas');
      console.dir(knownParkingareas);
      
      var allParkingareas = ParkingareasCollection.find({});
      //console.dir(allParkingareas);
      allParkingareas.forEach(function(parkinglot){
      //  console.dir(parkinglot);
  
        var parkinglotMarker = new google.maps.Marker({
          position: new google.maps.LatLng(parkinglot.lat, parkinglot.lng),
          title: parkinglot.title,
          icon: '/images/beachflag.png',
          map: map.instance,
        });
        
        parkinglotMarker.addListener('click', function(){ 
          console.log('Parkinglot marker clicked');
          var url = '/parkinglot/' + parkinglot._id;
          console.log('Read more: ' + url);
          //showInfoWindowFor(parkinglot); 
          var contentString = 
              '<div id="content">'+
                '<div id="siteNotice">'+'</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + parkinglot.title + '</h1>'+
                '<div id="bodyContent">'+ 
                  descriptionAsHtml(parkinglot.description) +
                  '<p><a href="' + url +'">Read more</a></p>'+
                '</div>'+
              '</div>';
          infoWindow.setContent(contentString);
          infoWindow.open(map.instance, this);

        });
    
        console.log('Added parkinglot to map');
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

      mapController.setPosition(latLng);
    });
    
  
    function showInfoWindowFor(parkinglot){
    }

  });

  function descriptionAsHtml(description){
    return description;//TODO: Convert to html here
  }
});
