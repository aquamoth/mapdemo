/* global MapController */
MapController = function(map) {
    var ICON_PARKINGAREA_URL = '/images/beachflag.png';
    
    var trackCurrentPositionOnMap;
    var currentPositionMarker;
    var centerOfScreenCircle;
    var infoWindow = new google.maps.InfoWindow();
    var registeredParkingAreas = [];


    constructor();



    MapController.prototype.setCurrentPosition = function(position){
      if(!currentPositionMarker){
        currentPositionMarker = createMarkerOnMap(position.lat, position.lng, 'You are here');
      }
      else{
        currentPositionMarker.setPosition(position);
      }

      if(trackCurrentPositionOnMap){
        setCenter(position);
        trackCurrentPositionOnMap = true; //Reenforce tracking since the panTo() event just disabled it
      }
    }
    
    MapController.prototype.registerParkingAreas = function(parkingareas){
        removeRegisteredParkingAreas();

        parkingareas.forEach(function(parkingarea){
            var marker = createMarkerOnMap(parkingarea.lat, parkingarea.lng, parkingarea.title, ICON_PARKINGAREA_URL);
            marker.addListener('click', function(){ onParkingAreaClicked(this, parkingarea); });
            registeredParkingAreas.push(marker);
        });
    }



    function constructor(){
        map.addListener('center_changed', onMapCenterChanged);

        createTrackCurrentPositionButton();
        onMapCenterChanged();
        trackCurrentPositionOnMap = true;
    }
   
   
   
    function onMapCenterChanged() {
        trackCurrentPositionOnMap = false;
        var position = map.getCenter();
        drawCenterOfScreenCircleAt(position);
    }
    
    function onParkingAreaClicked(marker, parkingarea) { 
        var url = '/parkingarea/' + parkingarea._id;
        var contentString = 
            '<div id="content">'+
                '<div id="siteNotice">'+'</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + parkingarea.title + '</h1>'+
                '<div id="bodyContent">'+ 
                descriptionAsHtml(parkingarea.description) +
                '<p><a href="' + url +'">Read more</a></p>'+
                '</div>'+
            '</div>';

        infoWindow.setContent(contentString);
        infoWindow.open(map, marker);
    }    
    

        
    function createTrackCurrentPositionButton(){
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM].push(centerControlDiv);//TOP_CENTER
    }

    function setCenter(position){
        map.panTo(position);
        var MAP_ZOOM = Session["MAP_ZOOM"];
        map.setZoom(MAP_ZOOM);
    }
    
    function enableTracking(enable){
        if(enable!==false) 
            enable=true;
        trackCurrentPositionOnMap=enable;
    }

    function drawCenterOfScreenCircleAt(position) {
        if(!centerOfScreenCircle){
            centerOfScreenCircle = new google.maps.Circle({
                strokeColor: '#0000FF',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#0000FF',
                fillOpacity: 0.35,
                map: map,
                center: position,
                radius: 300
            });
        }
        else{
            centerOfScreenCircle.setCenter(position);
        }
    }
        
    function descriptionAsHtml(description){
        return description;//TODO: Convert to html here
    }
    
    function createMarkerOnMap(lat, lng, title, icon){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            title: title,
            icon: icon,
            map: map,
        });
        return marker;
    }
    
    function removeRegisteredParkingAreas(){
        registeredParkingAreas.forEach(function(marker){
           marker.setMap(null);
        });
        registeredParkingAreas.length = 0;
    }


    


    /**
     * The CenterControl adds a control to the map that recenters the map on the current position currentPositionMarker
    * @constructor
    */
    function CenterControl(controlDiv) {
        var controlUI = document.createElement('div');
        controlUI.className = 'widget-mylocation-button';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        var controlIcon = document.createElement('div');
        controlIcon.className='widget-mylocation-button-normal widget-mylocation-cookieless';
        controlUI.appendChild(controlIcon);

        controlUI.addEventListener('click', function() {
            setCenter(currentPositionMarker.getPosition());
            enableTracking();
        });
    }
}
