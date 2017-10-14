import './Search.html';
import { Template } from 'meteor/templating';

Session.set("isTyping",0);

var diseases = ["A","B"];

Template.Search.rendered = function(){
  $(window).on('keydown', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });
};


Template.Search.helpers({
  isTyping: function(){
    Session.get("isTyping");
    if($("#searchInput").val() != "") {
      return true;
    }
    return false;
  },
  suggestion: function(){
    Session.get("isTyping");

    var input = $("#searchInput").val();
    var returnArray = [];
    for (var i=0; i<diseases.length; ++i) {
      if(diseases[i].indexOf($("#searchInput").val().toLowerCase())) {
        returnArray.push({name:diseases[i]});
      }
    }

    return
  },
});

Template.Search.events({
  "submit #searchForm": function(event, template){
    event.preventDefault();
    console.log("test");
  },

  "keydown input": function(event, template){
    Session.set("isTyping",Session.get("isTyping")+1);
  },
});
