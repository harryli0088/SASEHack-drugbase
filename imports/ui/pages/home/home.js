import { Template } from 'meteor/templating';

import './home.html';

import '../../components/hello/hello.js';
import '../../components/info/info.js';
import '../search.js';
Session.set("isTyping",0);

var diseases = ["AAAA","BBBB","CCCC","DDDD","DDDEEEE"];

Template.App_home.rendered = function(){
  $(window).on('keydown', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });
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
});
