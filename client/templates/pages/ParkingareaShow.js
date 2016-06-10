/* global Template */
/* global ParkingareasCollection */
Template.ParkingareaShow.helpers({
    //today: function(){ return moment(new Date()).format('YYYY-MM-DD'); },
    now: function(offset){
        console.log('now()');
        
        var dt = new Date();
        console.log(dt);

        //if(offset)
        //    dt = dt.addMinutes(offset);
        
        var s = moment(dt).format('YYYY-MM-DD HH:mm'); 
        console.log('returning: ' + s); 
        
        return s; 
    },
    item: function(id){
      console.log('ParkingareaShow: item for id: ' + id);
      var result = ParkingareasCollection.findOne({_id: id});
      console.dir(result);
      return result;
    }
});

Template.ParkingareaShow.onRendered(function(){
    var self = this;
    console.log('ParkingareaShow rendered');


    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    
    var startDateTime = self.$('#startDateTime').fdatepicker({
        format: 'yyyy-mm-dd hh:ii',
        disableDblClickSelection: true,
        pickTime: true,
        //language: 'vi', //Vietnamese language
        onRender: function(date){ return (date.valueOf() < today.valueOf()) ? 'disabled' : ''; }
    }).on('changeDate', function(e){
        console.log('startDateTime.changeDate()');
        console.log('Start: ' + startDateTime.originalValue);
        console.log('End  : ' + endDateTime.originalValue);
        var timeDiff = endDateTime.originalValue - startDateTime.originalValue;
        console.log('Diff : ' + timeDiff);

        var newStartDateTime = new Date(e.date);
        console.log('New Start: ' + newStartDateTime);

        var newEndDateTime = new Date(newStartDateTime.getTime() + timeDiff);
        console.log('New End  : ' + newEndDateTime);
        endDateTime.update(newEndDateTime);
        
        startDateTime.originalValue = newStartDateTime.valueOf(); 
        
        /*
        if(e.date.valueOf() > endDateTime.date.valueOf()){
            var newDate = new Date(e.date);
            //newDate.setDate(newDate.getDate()+1);
            newDate.setHour(newDate.getHour()+1);
            console.log('Updating endDateTime to: ' + newDate);
            endDateTime.update(newDate);
        }
        startDateTime.hide();
        //endDateTime.focus();//$('#dpd2')[0].focus();
        */
    }).on('changeTime', function(e){
        console.log('startDateTime.changeTime()');
    }).data('datepicker');
    var endDateTime = self.$('#endDateTime').fdatepicker({
        format: 'yyyy-mm-dd hh:ii',
        disableDblClickSelection: true,
        pickTime: true,
        //language: 'vi', //Vietnamese language
        onRender: function (date) { return date.valueOf() <= startDateTime.date.valueOf() ? 'disabled' : ''; }
    }).on('changeDate', function (ev) {
        console.log('endDateTime.changeDate()');
        var newEndDateTime = new Date(e.date);
        endDateTime.originalValue = newEndDateTime.valueOf(); 
        //endDateTime.hide();
    }).data('datepicker');    
    
    startDateTime.originalValue = startDateTime.date.valueOf();
    endDateTime.originalValue = endDateTime.date.valueOf();
    
    console.log('ParkingareaShow onrendered DONE');
});