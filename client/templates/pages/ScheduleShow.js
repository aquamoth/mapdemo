
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

Template.Timeslot.onRendered(function(){
   var self = this;
   
   console.log('Timeslot template rendered');
   /*
   var selectedParkingArea = Template.parentData(1).parkingarea;
   var selectedParkinglot = Template.parentData(1).parkinglot; 
   var timeslot = Template.parentData(0); 
   console.log(selectedParkingArea);
   console.log(selectedParkinglot);
   console.log(timeslot);
   

   //var timeslot_id = self.$('.timeslot').data('timeslot');
   //console.log('Timeslot id: ' + timeslot_id);
   
   self.$('#From').on('change', function(e){
        console.log('From changed');
        //console.log(this); 
        //console.log(e);
        var from = self.$('#From').val();
        console.log('From: ' + from);
      
        //var selectedParkingArea = toObjectId(selectedValueOf(self.$('#ParkingAreaDropdown').get(0)));
        //var parkinglot = parkinglotsFor(selectedParkingArea).filter(function(lot){return lot.id == selectedParkingLot;})[0];
        //var timeslot = parkinglot.timeslots.filter(function(timeslot){ return timeslot.id === timeslot_id; });
        console.log('Updating timeslot');
        Meteor.call('updateTimeslot', { _id: selectedParkingArea, lots:{id: selectedParkinglot, from: from }});
        //console.log(timeslot);
        //timeslot.start = parseInt(from);
        //console.log(timeslot);
        
        console.log('Updating timeslot DONE');
   });
   
   
   var to = self.$('#To').val();
   console.log('To: ' + to);
*/    
});

function onParkingAreaDropdownChange(e){
    var id = toObjectId(selectedValueOf(this));
    displayParkingLotOptionsFor(id);
}

function onParkingLotDropdownChange(e){
    var selectedParkingLot = selectedValueOf(this);
    var selectedParkingArea = toObjectId(selectedValueOf(self.$('#ParkingAreaDropdown').get(0)));
    var parkinglot = parkinglotsFor(selectedParkingArea).filter(function(lot){return lot.id == selectedParkingLot;})[0];
    displayScheduleFor(selectedParkingArea, parkinglot);
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

function clearScheduleSection(){
    var section = self.$('#ScheduleSection');
    section.empty();
}

function displayScheduleFor(selectedParkingArea, parkinglot){
    console.log('Display Schedule For');
    console.log(selectedParkingArea);
    console.log(parkinglot);
/*
    var data = parkinglot ? {isValid: true, parkingarea: selectedParkingArea, parkinglot: parkinglot.id, timeslots: parkinglot.timeslots} : {isValid: false};
    console.log(data);
    
    var timeslotsSection = self.$('#TimeslotsSection');
    timeslotsSection.empty();
    UI.renderWithData(Template.TimeslotsSection, data, timeslotsSection[0]);
*/
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
