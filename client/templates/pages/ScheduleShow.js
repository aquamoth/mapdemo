
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
    var selectedParkingLot = selectedValueOf(this);
    var selectedParkingArea = toObjectId(selectedValueOf(self.$('#ParkingAreaDropdown').get(0)));
    var parkinglot = parkinglotsFor(selectedParkingArea).filter(function(lot){return lot.id == selectedParkingLot;})[0];
    displayTimeslotsFor(parkinglot);
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
    else{
        clearTimeslotsSection();
    }
}

function clearTimeslotsSection(){
    var timeslotsSection = self.$('#TimeslotsSection');
    timeslotsSection.empty();
}

function displayTimeslotsFor(parkinglot){

    console.log('Display Schedule For');
    console.log(parkinglot);
    var data = parkinglot ? {isValid: true,  timeslots: parkinglot.timeslots} : {isValid: false};
    console.log(data);
    
    var timeslotsSection = self.$('#TimeslotsSection');
    timeslotsSection.empty();
    UI.renderWithData(Template.TimeslotsSection, data, timeslotsSection[0]);
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
