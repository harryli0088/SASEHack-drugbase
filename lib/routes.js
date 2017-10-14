FlowRouter.route('/search', {
  name: 'search',
  action() {
    BlazeLayout.render('search');
  }
});

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('App_home');
  }
});
