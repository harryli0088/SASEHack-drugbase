import { Template } from 'meteor/templating';


import "./search.html";
import "./home/data.js";

Template.search.rendered = function(){
  $(window).on('keydown', function(e){
    Session.set("isTyping",Session.get("isTyping")+1);
  });

  $(window).on('click', function(e){
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

    if($("input").val().length>1 && $("#searchInput").is(":focus")) {
      for (var i=0; i<diseases.length; ++i) {
        if(diseases[i].toLowerCase().indexOf($("#searchInput").val().toLowerCase()) !== -1) {
          returnArray.push({name:diseases[i]});
        }
      }
    }

    return returnArray;
  },

  getInfo: function(){
    if(Session.get("search").toLowerCase() == "allergies") {
      return [{
        name: "Seasonal Allergies",
        description:"Allergic rhinitis occurs seasonally or year-round. Diagnosis involves history-taking, examination of the nasal passages, and sometimes skin testing.",
        symptoms: [{name:"Runny Nose"},{name:"Stuffy Nose"},{name:"Sneezing"},{name:"Itchy Eyes"},{name:"Headaches"}],
        treatments: [{name:"Claritan"},{name:"Zyrtec"},{name:"Benadryl"}]
      }];
    }

    return returnArray;
  },

  imageLink: function() {
    if(Session.get("search").toLowerCase() == "allergies") {
      return "/img/allergy-s1-facts.jpg";
    }
  },

  getArticles: function() {
    if(Session.get("search").toLowerCase() == "allergies") {
      return [
        {
          headline:"Popular drugs for colds, allergies, sleep linked to dementia",
          description:"Taking over-the-counter medications for colds, flu and allergies may seem harmless, but a new study...",
          link:"https://www.cbsnews.com/news/popular-drugs-for-colds-allergies-linked-to-dementia/",
          newsImageLink:"/img/cold-medicine.jpg"
        },
        {
          headline:"Connecticut issues warning to parents about dangers of..",
          description:"Parents and caregivers in Connecticut this month are being warned about the dangers of misusing...",
          link:"http://abcnews.go.com/Health/connecticut-issues-warning-parents-dangers-misusing-antihistamines/story?id=47297931",
          newsImageLink:"/img/antihistamines.jpg"
        },
      ];
    }
  },

  getMedicineImages: function() {
    if(Session.get("search").toLowerCase() == "allergies") {
      return [
        {
          name:"Benadryl",
          medicineImageLink:"/img/UMXkjlSP.png",
          score:"86",
          color:"#F4D03F"
        },
        {
          name:"Claritin",
          medicineImageLink:"/img/Beautiful-Claritin-Logo-91-In-Create-Logo-Free-with-Claritin-Logo.jpg",
          score:"89",
          color:"#F4D03F"
        },
        {
          name:"Zyrtec",
          medicineImageLink:"/img/zyrtec.png"
          ,
          score:"80",
          color:"#F39C12"
        },
        {
          name:"Loratadine",
          medicineImageLink:"/img/0078742050812_A.jpg"
          ,
          score:"95",
          color:"#58D68D"
        },
      ];
    }
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
    return "<strong>Price per pill:</strong> <span style='color:"+d.priceColor+"'>$" + d.price + "</span>";
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
  .style("text-anchor", "end");

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

  var margin = {top: 40, right: 10, bottom: 30, left: 40},
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
  .style("text-anchor", "end");

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
  var width = 400,
  height = 400,
  radius = Math.min(width, height) / 2;

  var total = 0;
  for(var i=0; i<data.length; ++i) {
    total+=parseInt(data[i].usage);
  }
  for(var i=0; i<data.length; ++i) {
    data[i].total = total;
  }

  var arc = d3.svg.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70);

  var pie = d3.layout.pie()
  .sort(null)
  .value(function(d) { return d.usage; });

  d3.select("#donut").select("svg").remove();

  var svg = d3.select("#donut").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var g = svg.selectAll(".arc")
  .data(pie(data))
  .enter().append("g")
  .attr("class", "arc");

  g.append("path")
  .attr("d", arc)
  .style("fill", function(d) { return d.data.usageColor; })
  .on("mouseover",mouseover);

  function mouseover(d) {
    sidewaysBarchart(d);
    console.log(d);


    var percentage = (100 * d.data.usage / total).toPrecision(3);
    var percentageString = percentage + "%";
    svg.selectAll(".percentage").remove();
    svg.append("text").attr("class","percentage")
    .attr("text-anchor","middle")
    .style("fill",d.data.usageColor)
    .style("font-size","50px")
    .text(percentageString);

    svg.append("text").attr("class","percentage")
    .attr("text-anchor","middle")
    .style("fill",d.data.usageColor)
    .style("transform","translate(0px,20px)")
    .text(d.data.name);
  }
}

function type(d) {
  d.usage = +d.usage;
  return d;
}









sequences = function(str) {
  // Dimensions of sunburst.
  var width = 750;
  var height = 600;
  var radius = Math.min(width, height) / 2;

  // Breadcrumb dimensions: width, height, spacing, width of tip/tail.
  var b = {
    w: 75, h: 30, s: 3, t: 10
  };

  // Mapping of step names to colors.
  var colors = {
    "home": "#5687d1",
    "product": "#7b615c",
    "search": "#de783b",
    "account": "#6ab975",
    "other": "#a173d1",
    "end": "#bbbbbb"
  };

  // Total size of all segments; we set this later, after loading the data.
  var totalSize = 0;

  var vis = d3.select("#chart").append("svg:svg")
  .attr("width", width)
  .attr("height", height)
  .append("svg:g")
  .attr("id", "container")
  .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var partition = d3.layout.partition()
  .size([2 * Math.PI, radius * radius])
  .value(function(d) { return d.size; });

  var arc = d3.svg.arc()
  .startAngle(function(d) { return d.x; })
  .endAngle(function(d) { return d.x + d.dx; })
  .innerRadius(function(d) { return Math.sqrt(d.y); })
  .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

  // Main function to draw and set up the visualization, once we have the data.
  function createVisualization(json) {

    // Basic setup of page elements.
    initializeBreadcrumbTrail();
    drawLegend();
    d3.select("#togglelegend").on("click", toggleLegend);

    // Bounding circle underneath the sunburst, to make it easier to detect
    // when the mouse leaves the parent g.
    vis.append("svg:circle")
    .attr("r", radius)
    .style("opacity", 0);

    // For efficiency, filter nodes to keep only those large enough to see.
    var nodes = partition.nodes(json)
    .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
    });

    var path = vis.data([json]).selectAll("path")
    .data(nodes)
    .enter().append("svg:path")
    .attr("display", function(d) { return d.depth ? null : "none"; })
    .attr("d", arc)
    .attr("fill-rule", "evenodd")
    .style("fill", function(d) { return colors[d.name]; })
    .style("opacity", 1)
    .on("mouseover", mouseover);

    // Add the mouseleave handler to the bounding circle.
    d3.select("#container").on("mouseleave", mouseleave);

    // Get total size of the tree = value of root node from partition.
    totalSize = path.node().__data__.value;
  };

  // Fade all but the current sequence, and show it in the breadcrumb trail.
  function mouseover(d) {

    var percentage = (100 * d.value / totalSize).toPrecision(3);
    var percentageString = percentage + "%";
    if (percentage < 0.1) {
      percentageString = "< 0.1%";
    }

    d3.select("#percentage")
    .text(percentageString);

    d3.select("#explanation")
    .style("visibility", "");

    var sequenceArray = getAncestors(d);
    updateBreadcrumbs(sequenceArray, percentageString);

    // Fade all the segments.
    d3.selectAll("path")
    .style("opacity", 0.3);

    // Then highlight only those that are an ancestor of the current segment.
    vis.selectAll("path")
    .filter(function(node) {
      return (sequenceArray.indexOf(node) >= 0);
    })
    .style("opacity", 1);
  }

  // Restore everything to full opacity when moving off the visualization.
  function mouseleave(d) {

    // Hide the breadcrumb trail
    d3.select("#trail")
    .style("visibility", "hidden");

    // Deactivate all segments during transition.
    d3.selectAll("path").on("mouseover", null);

    // Transition each segment to full opacity and then reactivate it.
    d3.selectAll("path")
    .transition()
    .duration(1000)
    .style("opacity", 1)
    .each("end", function() {
      d3.select(this).on("mouseover", mouseover);
    });

    d3.select("#explanation")
    .style("visibility", "hidden");
  }

  // Given a node in a partition layout, return an array of all of its ancestor
  // nodes, highest first, but excluding the root.
  function getAncestors(node) {
    var path = [];
    var current = node;
    while (current.parent) {
      path.unshift(current);
      current = current.parent;
    }
    return path;
  }

  function initializeBreadcrumbTrail() {
    // Add the svg area.
    var trail = d3.select("#sequence").append("svg:svg")
    .attr("width", width)
    .attr("height", 50)
    .attr("id", "trail");
    // Add the label at the end, for the percentage.
    trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
  }

  // Generate a string that describes the points of a breadcrumb polygon.
  function breadcrumbPoints(d, i) {
    var points = [];
    points.push("0,0");
    points.push(b.w + ",0");
    points.push(b.w + b.t + "," + (b.h / 2));
    points.push(b.w + "," + b.h);
    points.push("0," + b.h);
    if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
  .selectAll("g")
  .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
  .attr("points", breadcrumbPoints)
  .style("fill", function(d) { return colors[d.name]; });

  entering.append("svg:text")
  .attr("x", (b.w + b.t) / 2)
  .attr("y", b.h / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", "middle")
  .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
  .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
  .attr("y", b.h / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", "middle")
  .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
  .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
  .attr("width", li.w)
  .attr("height", d3.keys(colors).length * (li.h + li.s));

  var g = legend.selectAll("g")
  .data(d3.entries(colors))
  .enter().append("svg:g")
  .attr("transform", function(d, i) {
    return "translate(0," + i * (li.h + li.s) + ")";
  });

  g.append("svg:rect")
  .attr("rx", li.r)
  .attr("ry", li.r)
  .attr("width", li.w)
  .attr("height", li.h)
  .style("fill", function(d) { return d.value; });

  g.append("svg:text")
  .attr("x", li.w / 2)
  .attr("y", li.h / 2)
  .attr("dy", "0.35em")
  .attr("text-anchor", "middle")
  .text(function(d) { return d.key; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
        // Not yet at the end of the sequence; move down the tree.
        var foundChild = false;
        for (var k = 0; k < children.length; k++) {
          if (children[k]["name"] == nodeName) {
            childNode = children[k];
            foundChild = true;
            break;
          }
        }
        // If we don't already have a child node for this branch, create it.
        if (!foundChild) {
          childNode = {"name": nodeName, "children": []};
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        // Reached the end of the sequence; create a leaf node.
        childNode = {"name": nodeName, "size": size};
        children.push(childNode);
      }
    }
  }
  return root;
};

// Use d3.text and d3.csv.parseRows so that we do not need to have a header
// row, and can receive the csv as an array of arrays.
d3.text("./"+str+"-sequences.csv", function(text) {
  var csv = d3.csv.parseRows(text);
  var json = buildHierarchy(csv);
  createVisualization(json);
});


}





sidewaysBarchart = function (item) {

  var data = [
    {label:"Positive Experience", value:item.data.approval},
    {label:"Negative Experience", value:100-item.data.approval}
  ];

  d3.select("#sideways").selectAll("*").remove();
  d3.select("#sideways").append("h1").html("Feedback");


  var div = d3.select("#sideways").append("div").attr("class", "toolTip");

  var axisMargin = 20,
  margin = 40,
  valueMargin = 4,
  width = 600,
  height = 400,
  barHeight = (height-axisMargin-margin*2)* 0.4/data.length,
  barPadding = (height-axisMargin-margin*2)*0.6/data.length,
  data, bar, svg, scale, xAxis, labelWidth = 0;

  max = d3.max(data, function(d) { return d.value; });

  svg = d3.select('#sideways')
  .append("svg")
  .attr("width", width)
  .attr("height", height);


  bar = svg.selectAll("g")
  .data(data)
  .enter()
  .append("g");

  bar.attr("class", "bar")
  .attr("cx",0)
  .attr("transform", function(d, i) {
    return "translate(" + margin + "," + (i * (barHeight + barPadding) + barPadding) + ")";
  });

  bar.append("text")
  .attr("class", "label")
  .attr("y", barHeight / 2)
  .attr("dy", ".35em") //vertical align middle
  .text(function(d){
    return d.label;
  }).each(function() {
    labelWidth = Math.ceil(Math.max(labelWidth, this.getBBox().width));
  })
  .style("fill",function(d) {
    if(d.label == "Positive Experience") {
      return "#82E0AA";
    }
    return "#F1948A";
  });

  scale = d3.scale.linear()
  .domain([0, max])
  .range([0, width - margin*2 - labelWidth]);

  xAxis = d3.svg.axis()
  .scale(scale)
  .tickSize(-height + 2*margin + axisMargin)
  .orient("bottom");

  bar.append("rect")
  .attr("transform", "translate("+labelWidth+", 0)")
  .attr("height", barHeight)
  .attr("width", function(d){
    return scale(d.value);
  })
  .style("fill",function(d) {
    if(d.label == "Positive Experience") {
      return "#82E0AA";
    }
    return "#F1948A";
  });

  bar.append("text")
  .attr("class", "value")
  .attr("y", barHeight / 2)
  .attr("dx", -valueMargin + labelWidth + 10) //margin right
  .attr("dy", ".35em") //vertical align middle
  .attr("text-anchor", "start")
  .style("fill",function(d) {
    if(d.label == "Positive Experience") {
      return "#82E0AA";
    }
    return "#F1948A";
  })
  .text(function(d){
    return (d.value+"%");
  })
  .attr("x", function(d){
    var width = this.getBBox().width;
    return Math.max(width + valueMargin, scale(d.value));
  });


  svg.insert("g",":first-child")
  .attr("class", "axisHorizontal")
  .attr("transform", "translate(" + (margin + labelWidth) + ","+ (height - axisMargin - margin)+")")
  .call(xAxis);

}
