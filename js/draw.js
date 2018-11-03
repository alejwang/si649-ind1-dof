var data = []; // the variable that holds the data from csv file
var origin_data = [];

$(document).ready(function() {
  // loadData();
  calculateData();
  init('1');
  init('2');
  init('3');
  drawDiagram('1');
  drawDiagram('2');
  drawDiagram('3');
});


var apeture = 11;
var allowedApeture = [1, 1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22, 32];
var aY = function(r) {
  return 32 - r / 1.5;
};
var aX = function(r) {
  return 8 - r / 4.5;
};

var distanceSetC = 1000; // max:3000 400+(distance/7.5) -> 800
var distanceSetF = 3000; // far
var distanceSetN = 900; // near
var dX = function(x) {
  return 300 + x / 6;
};

var focal = 28; // 200@50 350@200 150+focal
var fX = function(x) {
  return 150 + focal / 3;
};

var cmosSize = 20; // can't change
var coc = 0.029; // can't change

var hyperFocal = 61576;
var nearPoint = 986;
var farPoint = 1015;

var sliderDistanceCs = [];
var sliderDistanceFs = [];
var sliderDistanceNs = [];
var sliderFocals = [];
var sliderApetures = []


function calculateData() {
  hyperFocal = focal * focal / apeture / coc
  nearPoint = (hyperFocal * distanceSetC) / (hyperFocal + distanceSetC - focal)
  farPoint = (hyperFocal * distanceSetC) / (hyperFocal - distanceSetC - focal)
  if (farPoint < 0) {
    farPoint = 9999;
  }

  d3.selectAll(".distanceC").text(parseInt(distanceSetC));
  d3.selectAll(".distanceN").text(parseInt(nearPoint));
  d3.selectAll(".distanceF").text(parseInt(farPoint));
}


function init(name) {
  var sliderDistanceC = d3.sliderHorizontal().min(500).max(3000)
    .width(225).step(10).ticks(0).default(1000)
    .on('onchange', val => {
      d3.selectAll(".valueDistanceC").text(val);
      distanceSetC = val;
      calculateData();
      drawDiagram(1, update = true);
      drawDiagram(2, update = true);
      drawDiagram(3, update = true);
      sliderDistanceCs.forEach(function(entry) {
        entry.value(distanceSetC);
      })
      // console.log(d3.selectAll(".sliderDistanceF"));
    });
  sliderDistanceCs.push(sliderDistanceC);
  var groupDistanceC = d3.select("div#sliderDistanceC" + name).append("svg")
    .attr("width", 300).attr("height", 80)
    .append("g").attr("transform", "translate(30,30)");
  groupDistanceC.call(sliderDistanceC);
  d3.select("span#valueDistanceC" + name).text(sliderDistanceC.value())


  var sliderDistanceF = d3.sliderHorizontal().min(1000).max(3000)
    .width(225).step(10).ticks(0).default(3000)
    .on('onchange', val => {
      d3.selectAll(".valueDistanceF").text(val);
      distanceSetF = val;
      calculateData();
      drawDiagram(1, update = true);
      drawDiagram(2, update = true);
      drawDiagram(3, update = true);
    });
  sliderDistanceFs.push(sliderDistanceF);
  var groupDistanceF = d3.select("div#sliderDistanceF" + name).append("svg")
    .attr("width", 300).attr("height", 80)
    .append("g").attr("transform", "translate(30,30)");
  groupDistanceF.call(sliderDistanceF);
  d3.select("span#valueDistanceF" + name).text(sliderDistanceF.value())

  var sliderDistanceN = d3.sliderHorizontal().min(500).max(1000)
    .width(225).step(20).ticks(0).default(700)
    .on('onchange', val => {
      d3.selectAll(".valueDistanceN").text(val);
      distanceSetN = val;
      calculateData();
      drawDiagram(1, update = true);
      drawDiagram(2, update = true);
      drawDiagram(3, update = true);
    });
  sliderDistanceNs.push(sliderDistanceN);
  var groupDistanceN = d3.select("div#sliderDistanceN" + name).append("svg")
    .attr("width", 300).attr("height", 80)
    .append("g").attr("transform", "translate(30,30)");
  groupDistanceN.call(sliderDistanceN);
  d3.select("span#valueDistanceN" + name).text(sliderDistanceN.value())

  var sliderFocal = d3.sliderHorizontal().min(10).max(200)
    .width(225).step(1).ticks(0).default(28)
    .on('onchange', val => {
      d3.selectAll(".valueFocal").text(val);
      focal = val;
      calculateData();
      drawDiagram(1, update = true);
      drawDiagram(2, update = true);
      drawDiagram(3, update = true);
    });
  sliderFocals.push(sliderFocal);
  var groupFocal = d3.select("div#sliderFocal" + name).append("svg")
    .attr("width", 300).attr("height", 80)
    .append("g").attr("transform", "translate(30,30)");
  groupFocal.call(sliderFocal);
  d3.select("span#valueFocal" + name).text(sliderFocal.value())

  var sliderApeture = d3.sliderHorizontal()
    .min(d3.min(allowedApeture)).max(d3.max(allowedApeture))
    .width(225).tickFormat(d3.format('.2')).marks(allowedApeture).ticks(0).default(11)
    .on('onchange', val => {
      d3.selectAll(".valueApeture").text("f/" + sliderApeture.value())
      apeture = val;
      calculateData();
      drawDiagram(1, update = true);
      drawDiagram(2, update = true);
      drawDiagram(3, update = true);
    });
  sliderApetures.push(sliderApeture);
  var groupApeture = d3.select("div#sliderApeture" + name).append("svg")
    .attr("width", 300).attr("height", 80)
    .append("g").attr("transform", "translate(30,30)");

  groupApeture.call(sliderApeture);
  d3.select("span#valueApeture" + name).text("f/" + sliderApeture.value())
  // d3.select("a#setValue4").on("click", () => { slider4.value(0.015); d3.event.preventDefault(); });
}

function drawDiagram(name, update) {

  var svg = d3.select("#diagram" + name);
  // var lightsData = [-1, -0.7, -0.3, 0.3, 0.7, 1];

  var lightsData = [-1, 1];


  if (update) {
    svg.select('#blurLevelN')
    .transition().duration(100).delay(100)
    .attr("stdDeviation", function(){
      if (distanceSetN >= nearPoint) { return 0; }
      else { return (nearPoint - distanceSetN ) / nearPoint * 3; }
    });

    svg.select('#blurLevelF')
    .transition().duration(100).delay(100)
    .attr("stdDeviation", function(){
      if (distanceSetF <= farPoint) { return 0; }
      else { return (distanceSetF - farPoint) / farPoint * 3; }
    });

    var camera = svg.select('.camera')
      .transition().duration(100).delay(100)
      .attr('d', "M90 125 L130 125 L130 165 L" + parseInt(fX(focal) + 10) + " 165 L" + parseInt(fX(focal) + 10) + " 235 L130 235 L130 275 L90 275 L90 125")
    var lens_out = svg.select('.lens_out')
      .transition().duration(100).delay(100)
      .attr('cx', fX(focal)).attr('rx', aX(1))
      .attr('cy', 200).attr('ry', aY(1));
    var lens_in = svg.select('.lens_in')
      .transition().duration(100).delay(100)
      .attr('cx', fX(focal)).attr('rx', aX(apeture))
      .attr('cy', 200).attr('ry', aY(apeture));
    var clearArea = svg.select('.clearArea')
      .transition().duration(100).delay(100)
      .attr('x', dX(nearPoint))
      .attr('width', dX(farPoint) - dX(nearPoint))
    var focusLine = svg.select('.focusLine')
      .transition().duration(100).delay(100)
      .attr('x1', dX(distanceSetC)).attr('x2', dX(distanceSetC))
    var sceneN = svg.select('.sceneN')
      .transition().duration(100).delay(100)
      .attr('x', dX(distanceSetN) - 58);
    var sceneC = svg.select('.sceneC')
      .transition().duration(100).delay(100)
      .attr('x', dX(distanceSetC) - 31);
    var sceneF = svg.select('.sceneF')
      .transition().duration(100).delay(100)
      .attr('x', dX(distanceSetF) - 110);
    var lightsFrontC = svg.selectAll('.lightsFrontC')
      .transition().duration(100).delay(100)
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', dX(distanceSetC)).attr('y2', 200);
    var lightsBackC = svg.selectAll('.lightsBackC')
      .transition().duration(100).delay(100)
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', 100).attr('y2', 200);
    var lightsFrontF = svg.selectAll('.lightsFrontF')
      .transition().duration(100).delay(100)
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', dX(distanceSetF)).attr('y2', 200);
    var lightsBackF = svg.selectAll('.lightsBackF')
      .transition().duration(100).delay(100)
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', 100).attr('y2', function(d) {
        return 200 - d * cmosSize * (distanceSetF - distanceSetC) / (farPoint - distanceSetC);
      });
    var lightsFrontN = svg.selectAll('.lightsFrontN')
      .transition().duration(100).delay(100)
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', dX(distanceSetN)).attr('y2', 200);
    var lightsBackN = svg.selectAll('.lightsBackN')
      .transition().duration(100).delay(100)
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', 100).attr('y2', function(d) {
        return 200 + d * cmosSize * (distanceSetC - distanceSetN) / (distanceSetC - nearPoint);
      });
    if (name == '1') {
      var sceneF = svg.select('.sceneF')
        .transition().duration(100).delay(0)
        .attr('fill', function(){
          if ((distanceSetF <= farPoint) && (distanceSetF >= nearPoint)) {return '#4D82C1'; }
          else {return '#666'; }
        })
        .attr('cx', dX(distanceSetF) - 5).attr('cy', 200);
    }

  } else {
    var filters = svg.append("defs")
    var filterN = filters.append("filter").attr("id", "blurN")
    .append("feGaussianBlur").attr("id", "blurLevelN").attr("stdDeviation", 0.1);
    var filterF = filters.append("filter").attr("id", "blurF").append("feGaussianBlur").attr("id", "blurLevelF").attr("stdDeviation", 1.5);

    var camera = svg.append('path').attr('class', 'camera')
      .attr('d', "M90 125 L130 125 L130 165 L" + parseInt(fX(focal) + 10) + " 165 L" + parseInt(fX(focal) + 10) + " 235 L130 235 L130 275 L90 275 L90 125")
      .attr('stroke', "#90A16E").attr('stroke-width', '0.5').attr('fill', '#EAEBE2');
    var lens_out = svg.append('ellipse').attr('class', 'lens_out')
      .attr('cx', fX(focal)).attr('rx', aX(1))
      .attr('cy', 200).attr('ry', aY(1))
      .style('fill', "#D4D9AF")
    var lens_in = svg.append('ellipse').attr('class', 'lens_in')
      .attr('cx', fX(focal)).attr('rx', aX(apeture))
      .attr('cy', 200).attr('ry', aY(apeture))
      .style('fill', "#9FD3E9")
    var cmos = svg.append('line').attr('class', 'lens')
      .attr('x1', 98).attr('x2', 98)
      .attr('y1', 200 - cmosSize).attr('y2', 200 + cmosSize)
      .attr('stroke', "#36B0E2")
      .attr('stroke-width', "4");
    var clearArea = svg.append('rect').attr('class', 'clearArea')
      .attr('x', dX(nearPoint)).attr('y', 100)
      .attr('width', dX(farPoint) - dX(nearPoint)).attr('height', 200)
      .attr('fill', "#CCC")
      .style("opacity", 0.5)
    var focusLine = svg.append('line').attr('class', 'focusLine')
      .attr('x1', dX(distanceSetC)).attr('x2', dX(distanceSetC))
      .attr('y1', 0).attr('y2', 350)
      .attr('stroke', "#BBB").attr('stroke-width', "1");
    if (name == '1') {
      var sceneF = svg.append('circle').attr('class', 'sceneF')
        .attr('r', 10).attr('fill', "#666")
        .attr('cx', dX(distanceSetF) - 5).attr('cy', 200)
        .attr("filter", "url(#blurF)");
    } else {
      var sceneF = svg.append('image').attr('class', 'sceneF')
        .attr('xlink:href', 'image/park-tree-icon-by-Vexels.svg')
        .attr('width', 220).attr('height', 250)
        .attr('x', dX(distanceSetF) - 110).attr('y', 50)
        .attr("filter", "url(#blurF)");
      var sceneC = svg.append('image').attr('class', 'sceneC')
        .attr('xlink:href', 'image/beard-man-illustration-left-by-Vexels.svg')
        .attr('width', 62).attr('height', 150)
        .attr('x', dX(distanceSetC) - 31).attr('y', 155)
        .style('transform', 'scaleX(-1) tranlate(225 +' + dX(distanceSetC) + ')');
      var sceneN = svg.append('image').attr('class', 'sceneN')
        .attr('xlink:href', 'image/park-shrub-icon-by-Vexels.svg')
        .attr('width', 116).attr('height', 43)
        .attr('x', dX(distanceSetN) - 58).attr('y', 257)
        .attr("filter", "url(#blurN)");
      var ground = svg.append('line').attr('class', 'ground')
        .attr('x1', 300).attr('x2', 850)
        .attr('y1', 305).attr('y2', 305)
        .attr('stroke', '#301D21').attr('stroke-width', "10");


      var lightsFrontN = svg.selectAll('.lightsFrontN').data(lightsData).enter().append('line')
        .attr('class', 'lightsFrontN')
        .attr('x1', fX(focal)).attr('y1', function(d) {
          return 200 + aY(apeture) * d;
        })
        .attr('x2', dX(distanceSetN)).attr('y2', 200)
        .attr('stroke', "#F1D749")
        .attr('stroke-width', "1");
      var lightsBackN = svg.selectAll('.lightsBackN').data(lightsData).enter().append('line')
        .attr('class', 'lightsBackN')
        .attr('x1', fX(focal)).attr('y1', function(d) {
          return 200 + aY(apeture) * d;
        })
        .attr('x2', 100).attr('y2', function(d) {
          return 200 + d * cmosSize * (distanceSetC - distanceSetN) / (distanceSetC - nearPoint);
        })
        .attr('stroke', "#F1D749")
        .attr('stroke-width', "1");
    }
    var lightsFrontC = svg.selectAll('.lightsFrontC').data(lightsData).enter().append('line')
      .attr('class', 'lightsFrontC')
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', dX(distanceSetC)).attr('y2', 200)
      .attr('stroke', "#9FD3E9")
      .attr('stroke-width', "1");
    var lightsBackC = svg.selectAll('.lightsBackC').data(lightsData).enter().append('line')
      .attr('class', 'lightsBackC')
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', 100).attr('y2', 200)
      .attr('stroke', "#9FD3E9")
      .attr('stroke-width', "1");
    var lightsFrontF = svg.selectAll('.lightsFrontF').data(lightsData).enter().append('line')
      .attr('class', 'lightsFrontF')
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', dX(distanceSetF)).attr('y2', 200)
      .attr('stroke', "#F089A2")
      .attr('stroke-width', "1");
    var lightsBackF = svg.selectAll('.lightsBackF').data(lightsData).enter().append('line')
      .attr('class', 'lightsBackF')
      .attr('x1', fX(focal)).attr('y1', function(d) {
        return 200 + aY(apeture) * d;
      })
      .attr('x2', 100).attr('y2', function(d) {
        return 200 - d * cmosSize * (distanceSetF - distanceSetC) / (farPoint - distanceSetC);
      })
      .attr('stroke', "#F089A2")
      .attr('stroke-width', "1");
  }
}
