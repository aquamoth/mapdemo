/* global Router */
Router.configure({
	layoutTemplate: 'foundation_layout' 
});
/*
*/

Router.route('/', function(){
//	this.layout('foundation_layout');
	this.render('page_map');
}, { name: 'parking'});

Router.route('/Schedule', function(){
//	this.layout('foundation_layout');
	this.render('page_schedule');
}, { name: 'schedule'});
