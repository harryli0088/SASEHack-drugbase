import { Template } from 'meteor/templating';


import "./search.html";
import "./home/data.js";

Template.search.rendered = function(){
  $(window).on('keydown', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });

  $("input").val(Session.get("search"));

  $("input").attr("autocomplete", "off");


  var str = Session.get("search").toLowerCase();

  rebuildDash(window[str]);
};

rebuildDash = function (data) {
  barchartPrice(data);
  barchartEfficacy(data);
  donut(data);
}


Template.search.helpers({
  suggestion: function(){
    Session.get("isTyping");

    var input = $("#searchInput").val();
    var returnArray = [];

    if($("input").val().length > 2) {
      for (var i=0; i<diseases.length; ++i) {
        if(diseases[i].toLowerCase().indexOf($("#searchInput").val().toLowerCase()) !== -1) {
          returnArray.push({name:diseases[i]});
        }
      }
    }

    return returnArray;
  },
});

Template.search.events({
  "submit form": function(event, template){
    event.preventDefault();
  },

  "keydown input": function(event, template){
    Session.set("isTyping",Session.get("isTyping")+1);
  },

  "click .suggestion": function(event, template){
    $("input").val($(event.target).closest(".suggestion").attr("id").split("-")[1]);

    Session.set("search",$(event.target).closest(".suggestion").attr("id").split("-")[1]);

    var str = Session.get("search").toLowerCase();

    rebuildDash(window[str]);
  },

});







barchartPrice = function(data) {

  var margin = {top: 40, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

  var formatPercent = d3.format("$0.00");

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(formatPercent);

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Price per pill:</strong> <span style='color:"+d.priceColor+"'>" + d.price + "</span>";
  })

  d3.select("#price").selectAll("svg").remove();

  var svg = d3.select("#price").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.price; })]);

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Price per pill");

  svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("fill", function(d) { return d.priceColor; })
  .attr("x", function(d) { return x(d.name); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.price); })
  .attr("height", function(d) { return height - y(d.price); })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide)

}

barchartEfficacy = function(data) {

  var margin = {top: 40, right: 20, bottom: 30, left: 40},
  width = 500 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

  var formatPercent = d3.format("%");

  var x = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
  .range([height, 0]);

  var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

  var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(formatPercent);

  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Efficacy:</strong> <span style='color:"+d.efficacyColor+"'>" + d.efficacy*100 + "% </span>";
  })

  d3.select("#efficacy").selectAll("svg").remove();

  var svg = d3.select("#efficacy").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.call(tip);

  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.efficacy; })]);

  svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

  svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Efficacy");

  svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("fill", function(d) { return d.efficacyColor; })
  .attr("x", function(d) { return x(d.name); })
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.efficacy); })
  .attr("height", function(d) { return height - y(d.efficacy); })
  .on('mouseover', tip.show)
  .on('mouseout', tip.hide)


}

function type(d) {
  d.price = +d.price;
  return d;
}


// d3.tip
// Copyright (c) 2013 Justin Palmer
//
// Tooltips for d3.js SVG visualizations

// Public - contructs a new tooltip
//
// Returns a tip
d3.tip = function() {
  var direction = d3_tip_direction,
  offset    = d3_tip_offset,
  html      = d3_tip_html,
  node      = initNode(),
  svg       = null,
  point     = null,
  target    = null

  function tip(vis) {
    svg = getSVGNode(vis)
    point = svg.createSVGPoint()
    document.body.appendChild(node)
  }

  // Public - show the tooltip on the screen
  //
  // Returns a tip
  tip.show = function() {
    var args = Array.prototype.slice.call(arguments)
    if(args[args.length - 1] instanceof SVGElement) target = args.pop()

    var content = html.apply(this, args),
    poffset = offset.apply(this, args),
    dir     = direction.apply(this, args),
    nodel   = d3.select(node), i = 0,
    coords

    nodel.html(content)
    .style({ opacity: 1, 'pointer-events': 'all' })

    while(i--) nodel.classed(directions[i], false)
    coords = direction_callbacks.get(dir).apply(this)
    nodel.classed(dir, true).style({
      top: (coords.top +  poffset[0]) + 'px',
      left: (coords.left + poffset[1]) + 'px'
    })

    return tip
  }

  // Public - hide the tooltip
  //
  // Returns a tip
  tip.hide = function() {
    nodel = d3.select(node)
    nodel.style({ opacity: 0, 'pointer-events': 'none' })
    return tip
  }

  // Public: Proxy attr calls to the d3 tip container.  Sets or gets attribute value.
  //
  // n - name of the attribute
  // v - value of the attribute
  //
  // Returns tip or attribute value
  tip.attr = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return d3.select(node).attr(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.attr.apply(d3.select(node), args)
    }

    return tip
  }

  // Public: Proxy style calls to the d3 tip container.  Sets or gets a style value.
  //
  // n - name of the property
  // v - value of the property
  //
  // Returns tip or style property value
  tip.style = function(n, v) {
    if (arguments.length < 2 && typeof n === 'string') {
      return d3.select(node).style(n)
    } else {
      var args =  Array.prototype.slice.call(arguments)
      d3.selection.prototype.style.apply(d3.select(node), args)
    }

    return tip
  }

  // Public: Set or get the direction of the tooltip
  //
  // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
  //     sw(southwest), ne(northeast) or se(southeast)
  //
  // Returns tip or direction
  tip.direction = function(v) {
    if (!arguments.length) return direction
    direction = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: Sets or gets the offset of the tip
  //
  // v - Array of [x, y] offset
  //
  // Returns offset or
  tip.offset = function(v) {
    if (!arguments.length) return offset
    offset = v == null ? v : d3.functor(v)

    return tip
  }

  // Public: sets or gets the html value of the tooltip
  //
  // v - String value of the tip
  //
  // Returns html value or tip
  tip.html = function(v) {
    if (!arguments.length) return html
    html = v == null ? v : d3.functor(v)

    return tip
  }

  function d3_tip_direction() { return 'n' }
  function d3_tip_offset() { return [0, 0] }
  function d3_tip_html() { return ' ' }

  var direction_callbacks = d3.map({
    n:  direction_n,
    s:  direction_s,
    e:  direction_e,
    w:  direction_w,
    nw: direction_nw,
    ne: direction_ne,
    sw: direction_sw,
    se: direction_se
  }),

  directions = direction_callbacks.keys()

  function direction_n() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.n.y - node.offsetHeight,
      left: bbox.n.x - node.offsetWidth / 2
    }
  }

  function direction_s() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.s.y,
      left: bbox.s.x - node.offsetWidth / 2
    }
  }

  function direction_e() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.e.y - node.offsetHeight / 2,
      left: bbox.e.x
    }
  }

  function direction_w() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.w.y - node.offsetHeight / 2,
      left: bbox.w.x - node.offsetWidth
    }
  }

  function direction_nw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.nw.y - node.offsetHeight,
      left: bbox.nw.x - node.offsetWidth
    }
  }

  function direction_ne() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.ne.y - node.offsetHeight,
      left: bbox.ne.x
    }
  }

  function direction_sw() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.sw.y,
      left: bbox.sw.x - node.offsetWidth
    }
  }

  function direction_se() {
    var bbox = getScreenBBox()
    return {
      top:  bbox.se.y,
      left: bbox.e.x
    }
  }

  function initNode() {
    var node = d3.select(document.createElement('div'))
    node.style({
      position: 'absolute',
      opacity: 0,
      pointerEvents: 'none',
      boxSizing: 'border-box'
    })

    return node.node()
  }

  function getSVGNode(el) {
    el = el.node()
    if(el.tagName.toLowerCase() == 'svg')
    return el

    return el.ownerSVGElement
  }

  // Private - gets the screen coordinates of a shape
  //
  // Given a shape on the screen, will return an SVGPoint for the directions
  // n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
  // sw(southwest).
  //
  //    +-+-+
  //    |   |
  //    +   +
  //    |   |
  //    +-+-+
  //
  // Returns an Object {n, s, e, w, nw, sw, ne, se}
  function getScreenBBox() {
    var targetel   = target || d3.event.target,
    bbox       = {},
    matrix     = targetel.getScreenCTM(),
    tbbox      = targetel.getBBox(),
    width      = tbbox.width,
    height     = tbbox.height,
    x          = tbbox.x,
    y          = tbbox.y,
    scrollTop  = document.documentElement.scrollTop || document.body.scrollTop,
    scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft


    point.x = x + scrollLeft
    point.y = y + scrollTop
    bbox.nw = point.matrixTransform(matrix)
    point.x += width
    bbox.ne = point.matrixTransform(matrix)
    point.y += height
    bbox.se = point.matrixTransform(matrix)
    point.x -= width
    bbox.sw = point.matrixTransform(matrix)
    point.y -= height / 2
    bbox.w  = point.matrixTransform(matrix)
    point.x += width
    bbox.e = point.matrixTransform(matrix)
    point.x -= width / 2
    point.y -= height / 2
    bbox.n = point.matrixTransform(matrix)
    point.y += height
    bbox.s = point.matrixTransform(matrix)

    return bbox
  }

  return tip
};








donut = function(data) {
  var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(radius - 70);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.years; });

    d3.select("#donut").select("svg").remove();

var svg = d3.select("#donut").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    console.log(svg);

  var g = svg.selectAll(".arc")
      .data(pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.name); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .text(function(d) { return d.data.name; });
}

function type(d) {
  d.years = +d.years;
  return d;
}
