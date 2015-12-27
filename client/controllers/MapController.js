/* global MapController */
MapController = function(map)
{
    var trackCurrentPositionOnMap = true;
    var marker;
    var markerCircle;


/*    
    marker.addListener('click', function() {
      map.setZoom(8);
      map.setCenter(marker.getPosition());
    });
*/

    map.addListener('center_changed', function() {
      trackCurrentPositionOnMap=false;
    });




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


    function markerMovedTo(position){
      if(trackCurrentPositionOnMap){
        //Center and zoom the map view onto the current position
        setCenter(position);
        trackCurrentPositionOnMap=true; //Reenforce tracking since the panTo() event just disabled it
      }
    }

    MapController.prototype.setPosition = function(position){
      console.log('setPosition');
      
      if(!marker){
        //If the marker doesn't yet exist, create it
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(position.lat, position.lng),
          map: map
        });

        // Create the DIV to hold the control and call the CenterControl() constructor
        // passing in this DIV.
        var centerControlDiv = document.createElement('div');
        var centerControl = new CenterControl(centerControlDiv, map.instance, marker);
        centerControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.BOTTOM].push(centerControlDiv);//TOP_CENTER
      }
      else{
        //The marker already exists, so we'll just change its position
        marker.setPosition(position);
      }



      if(!markerCircle){
        markerCircle = new google.maps.Circle({
          strokeColor: '#0000FF',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0000FF',
          fillOpacity: 0.35,
          map: map,
          center: position,
          radius: 200
        });
      }
      else{
        console.warn('TODO: Should reposition the markerCircle here');
        //markerCircle.setPosition(latLng);
      }


      markerMovedTo(marker.getPosition());
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
      setCenter(marker.getPosition());
      enableTracking();
    });
  }
}
