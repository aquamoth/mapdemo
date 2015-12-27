
Template.bottom_menu.helpers({
  currentRoute: function(){
   return Router.current().route.getName();
  },
});
