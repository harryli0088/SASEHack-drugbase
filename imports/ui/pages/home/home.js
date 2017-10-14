import { Template } from 'meteor/templating';

import './home.html';

import '../../components/hello/hello.js';
import '../../components/info/info.js';
import '../search.js';
Session.set("isTyping",0);

diseases = ["AAAA","Allergies","BBBB","CCCC","DDDD","DDDEEEE"];

Template.App_home.rendered = function(){
  $(window).on('keydown', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });

  $("input").attr("autocomplete", "off");
};


Template.App_home.helpers({
  suggestion: function(){
    Session.get("isTyping");

    var input = $("#searchInput").val();
    var returnArray = [];

    if($("#searchInput").val().length > 2) {
      for (var i=0; i<diseases.length; ++i) {
        if(diseases[i].toLowerCase().indexOf($("#searchInput").val().toLowerCase()) !== -1) {
          returnArray.push({name:diseases[i]});
        }
      }
    }

    return returnArray;
  },
});

Template.App_home.events({
  "submit #searchForm": function(event, template){
    event.preventDefault();
    console.log("test");
  },

  "keydown input": function(event, template){
    Session.set("isTyping",Session.get("isTyping")+1);
  },

  "click .suggestion": function(event, template){
    $("input").val($(event.target).closest(".suggestion").attr("id").split("-")[1]);

    Session.set("search",$(event.target).closest(".suggestion").attr("id").split("-")[1]);

    FlowRouter.go("search");
  },

});
