/* global MapController */
MapController = function(map)
{
    var trackCurrentPositionOnMap;
    var currentPositionMarker;
    var centerOfScreenCircle;


/*    
    currentPositionMarker.addListener('click', function() {
      map.setZoom(8);
      map.setCenter(currentPositionMarker.getPosition());
    });
*/

    map.addListener('center_changed', onMapCenterChanged);

    createTrackCurrentPositionButton();
    onMapCenterChanged();
    trackCurrentPositionOnMap = true;




    
    function onMapCenterChanged() {
      trackCurrentPositionOnMap = false;
      var position = map.getCenter();
      drawCenterOfScreenCircleAt(position);
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

    function markerMovedTo(position){
      if(trackCurrentPositionOnMap){
        //Center and zoom the map view onto the current position
        setCenter(position);
        trackCurrentPositionOnMap = true; //Reenforce tracking since the panTo() event just disabled it
      }
    }

    MapController.prototype.setPosition = function(position){
      console.log('setPosition');
      
      if(!currentPositionMarker){
        //If the currentPositionMarker doesn't yet exist, create it
        currentPositionMarker = new google.maps.Marker({
          position: new google.maps.LatLng(position.lat, position.lng),
          map: map
        });
      }
      else{
        //The currentPositionMarker already exists, so we'll just change its position
        currentPositionMarker.setPosition(position);
      }

      markerMovedTo(currentPositionMarker.getPosition());
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
