/* global Router */
Router.route('/', function(){
	this.render('page_map', { });
});

Router.route('/Schedule', function(){
	this.render('page_schedule', { });
});
