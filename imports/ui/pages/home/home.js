import { Template } from 'meteor/templating';

import './home.html';

import '../../components/hello/hello.js';
import '../../components/info/info.js';
import '../search.js';
Session.set("isTyping",0);

diseases = ["Allergies", "Sleep Apnea", "AIDS/HIV", "Asthma", "Gonorrhea", "Ovarian Cancer", "Leukemia", "Hepatitis A", "Hepatitis B", "Hepatitis C",  "Influenza", "Jaundice", "Leprosy", "Lyme Disease", "Malaria", "Insomnia", "Pneumonia", "Tuberculosis", "Testicular Cancer", "Tetanus", "Ebola"];

Template.App_home.rendered = function(){
  $(window).on('keydown', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });

  $(window).on('click', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });

  $("input").attr("autocomplete", "off");
};


Template.App_home.helpers({
  suggestion: function(){
    Session.get("isTyping");

    var input = $("#searchInput").val();
    var returnArray = [];

    if($("#searchInput").val().length>1  && $("#searchInput").is(":focus")) {
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
