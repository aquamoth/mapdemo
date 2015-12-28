
Template.ScheduleShow.helpers({
    currentPosition: function(){
        var latLng = Geolocation.latLng();
        return latLng;
    },
})

Template.ScheduleShow.onRendered(function(){
    var self = this;

    self.$('#ParkingAreaDropdown').on('change', onParkingAreaDropdownChange);
    self.$('#ParkingLotDropdown').on('change', onParkingLotDropdownChange);
});


function onParkingAreaDropdownChange(e){
    var id = toObjectId(selectedValueOf(this));
    displayParkingLotOptionsFor(id);
}

function onParkingLotDropdownChange(e){
    var id = selectedValueOf(this);
    console.log('Selected parking lot: ' + id);
}


function displayParkingLotOptionsFor(selectedParkingArea){
    var data = { parkinglots: parkinglotsFor(selectedParkingArea) };
    if(data.parkinglots && data.parkinglots.length === 1){
        data.parkinglots[0].selected = "selected";
    }

    var parkingLotDropdown = self.$('#ParkingLotDropdown');
    parkingLotDropdown.find('option').remove();
    UI.renderWithData(Template.ParkingLotOptions, data, parkingLotDropdown[0]);
    
    if(data.parkinglots && data.parkinglots.length === 1){
        onParkingLotDropdownChange.call(parkingLotDropdown[0]);
    }
}


function parkinglotsFor(selectedParkingArea){
    var parkingArea = ParkingareasCollection.findOne({_id: selectedParkingArea });
    if(!parkingArea)
        return [];
    return parkingArea.lots;
}

function selectedValueOf(dropdown){
    var selectedIndex = dropdown.selectedIndex;
    var selectedOption = dropdown.options[selectedIndex];
    return selectedOption.value    
}

function toObjectId(objectIdString){
    var idString = objectIdString.substring(10, 34);
    var id = new Mongo.ObjectID(idString);
    return id;
}
