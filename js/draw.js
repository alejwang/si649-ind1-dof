var data = []; // the variable that holds the data from csv file
var origin_data = [];

$(document).ready(function () {
    // loadData();
    init();
    drawDiagram1();
});

// function loadData() {
//     d3.csv("data/candy-data.csv", function (d) {
//       origin_data = d;
//       origin_data.sort((a, b) => b.winpercent - a.winpercent)
//       for (var i = 0; i < origin_data.length; i++) {
//           origin_data[i].ranknum = i + 1;
//       }
//       data = origin_data;
//       sortData('rank');
//       }
//     );
// }

var lensApeture = 30;
var lY = function(y){ return ???}
var distance = 1000; // max:3000 400+(distance/7.5) -> 800
var dX = function(x){ return 400 + x / 7.5; };
var focal = 50; // 200@50 350@200 150+focal
var fX = function(x){ return 150 + focal/3; };
var cmosSize = 10; // can't change
var coc = 0.029; // can't change
var hyperFocal = 61576;
var nearPoint = 1015;


function updateData(){
    hyperFocal = focal * focal / lensApeture / coc
    nearPoint = (hyperFocal * distance) / (hyperFocal + distance - focal)
    farPoint = (hyperFocal * distance) / (hyperFocal + distance - focal)
    // distanceLoc =
}


function init() {
    var sliderDistance = d3.sliderHorizontal().min(500).max(3000)
        .width(300).step(10).ticks(10).default(1000)
        .on('onchange', val => {
          d3.select("span#valueDistance").text(val);
          distance = val;
          drawDiagram1(update=true);
        });
    var groupDistance = d3.select("div#sliderDistance").append("svg")
       .attr("width", 500) .attr("height", 100)
       .append("g") .attr("transform", "translate(30,30)");
    groupDistance.call(sliderDistance);
    d3.select("span#valueDistance").text(sliderDistance.value())
    // d3.select("a#setValueDistance").on("click", () => { sliderDistance.value(5); d3.event.preventDefault(); });

    var sliderFocal = d3.sliderHorizontal().min(20).max(200)
        .width(300).step(1).ticks(20).default(50)
        .on('onchange', val => {
          d3.select("span#valueFocal").text(val);
          focal = val;
          drawDiagram1(update=true);
        });
    var groupFocal = d3.select("div#sliderFocal").append("svg")
       .attr("width", 500) .attr("height", 100)
       .append("g") .attr("transform", "translate(30,30)");
    groupFocal.call(sliderFocal);
    d3.select("span#valueFocal").text(sliderFocal.value())
    // d3.select("a#setValueDistance").on("click", () => { sliderFocal.value(5); d3.event.preventDefault(); });
}

function drawDiagram1(update) {

    var svg = d3.select("#diagram1");
    var lightsData = [-1, -0.7, -0.3, 0.3, 0.7, 1];

    if (update) {
      var lens = svg.select('.lens')
                    .transition()
                    .duration(300)
                    .delay(200)
                    .attr('x1', fX(focal)) .attr('x2', fX(focal))
                    .attr('y1', 200-lensApeture) .attr('y2', 200+lensApeture)

      var lightsFront = svg.selectAll('.lightsFront')
                            .transition().duration(300).delay(200)
                            .attr('x1', dX(distance)) .attr('x2', fX(focal))

      var lightsBack = svg.selectAll('.lightsBack')
                      .transition().duration(300).delay(200)
                      .attr('x2', fX(focal)) .attr('y2', function(d){ return 200 + d * lensApeture })
                      .attr('x1', 100) .attr('y1', 200)

    } else {
      var lens = svg.append('line') .attr('class', 'lens')
                    .attr('x1', fX(focal)) .attr('x2', fX(focal))
                    .attr('y1', 200-lensApeture) .attr('y2', 200+lensApeture)
                    .attr('stroke', "blue")
                    .attr('stroke-width', "4");

      var cmos = svg.append('line') .attr('class', 'lens')
                    .attr('x1', 100) .attr('x2', 100)
                    .attr('y1', 200-cmosSize) .attr('y2', 200+cmosSize)
                    .attr('stroke', "blue")
                    .attr('stroke-width', "4");

      var lightsFront = svg.selectAll('.lightsFront').data(lightsData).enter().append('line')
                      .attr('class', 'lightsFront')
                      .attr('x1', dX(distance)) .attr('x2', fX(focal))
                      .attr('y1', 200) .attr('y2', function(d){ return 200 + d * lensApeture })
                      .attr('stroke', "green")
                      .attr('stroke-width', "1");
      var lightsBack = svg.selectAll('.lightsBack').data(lightsData).enter().append('line')
                      .attr('class', 'lightsBack')
                      .attr('x1', 100) .attr('x2', fX(focal))
                      .attr('y1', 200) .attr('y2', function(d){ return 200 + d * lensApeture })
                      .attr('stroke', "green")
                      .attr('stroke-width', "1");
    }
}

//
// function filterDataForAll() {
//     var current = $("#all")[0].checked;
//     $("input:checkbox[name=filter]").each(function(){
//       if (current == true) { $(this).prop("checked", true); }
//       else { $(this).prop("checked", false); }
//     });
//     filterData();
// }
//
// function filterData() {
//     var selected = []
//     $("input:checkbox[name=filter]:checked").each(function(){
//       if ($(this).val() != 'all') { selected.push($(this).val()); }
//     });
//     if (selected.length == 6) { $("#all").prop("checked", true); }
//     else { $("#all").prop("checked", false); }
//     data = origin_data.filter(function(d) {
//         for (var i = 0; i < selected.length; i++) {
//           if (d[selected[i]] == 1) { return true; }
//         }
//         return false;
//     });
//     console.log("filter" + data);
//     // visualizeBarChart(data);
//     updateChar(data);
// }
//
// function sortData(option){
//   switch (option) {
//     case "rank": data.sort((a, b) => b.winpercent - a.winpercent); break;
//     case "price": data.sort((a, b) => b.pricepercent - a.pricepercent); break;
//     case "sugar": data.sort((a, b) => b.sugarpercent - a.sugarpercent); break;
//   }
//   // visualizeBarChart(data);
//   updateChar(data);
// };
//
// function updateChar(ds) {
//     // var svg = d3.select("#chart1")
//     var bar = d3.selectAll(".bar")
//               .data(ds)
//
//     console.log(bar)
//
//     var margin = { top: 20, right: 20, bottom: 100, left: 60 },
//         width = 940 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;
//     var x = d3.scaleBand()
//         .domain(data.map(function (d) { return d.competitorname; }))
//         .range([0, width])
//         .padding(0.1);
//
//     var y = d3.scaleLinear()
//         .domain([0, d3.max(ds, function (d) { return d.winpercent; })])
//         .range([height, 0]);
//
//
//     bar.transition()
//       .duration(500)
//       // .append("rect")
//       // .attr("class", "bar")
//       // .style("mix-blend-mode", "multiply")
//       // .attr("fill", "#5b717c")
//       .attr("width", x.bandwidth())
//       // .attr("opacity", "0.7")
//       .attr("y", height)
//       .attr("x", function (d) { return x(d.competitorname); })
//       .attr("y", function (d) { return y(d.winpercent); })
//       .attr("height", function (d) { return height - y(d.winpercent); })
//       .delay((d, i) => i * 20)
//     bar.exit()
//       .transition(t)
//       .attr("width", 0)
//       .remove()
// }
//
// function visualizeBarChart(ds) {
//     console.log("input is " + ds);
//     var margin = { top: 20, right: 20, bottom: 100, left: 60 },
//         width = 940 - margin.left - margin.right,
//         height = 500 - margin.top - margin.bottom;
//
//     var x = d3.scaleBand()
//         .domain(data.map(function (d) { return d.competitorname; }))
//         .range([0, width])
//         .padding(0.1);
//
//     var y = d3.scaleLinear()
//         .domain([0, d3.max(ds, function (d) { return d.winpercent; })])
//         .range([height, 0]);
//
//     var tooltip = d3.select("body").append("div").attr("class", "toolTip");
//     d3.selectAll("svg").remove();
//
//     var svg = d3.select("#chart1").append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");
//
//     const t = svg.transition()
//         .duration(750);
//
//     var bar = svg.selectAll(".bar")
//                 .data(ds)
//     bar.enter()
//       .append("rect")
//       .attr("class", "bar")
//       .style("mix-blend-mode", "multiply")
//       .attr("fill", "#5b717c")
//       .attr("width", x.bandwidth())
//       .attr("opacity", "0.7")
//       .attr("y", height)
//       .attr("x", function (d) { return x(d.competitorname); })
//       .transition(t)
//       .attr("y", function (d) { return y(d.winpercent); })
//       .attr("height", function (d) { return height - y(d.winpercent); })
//       .delay((d, i) => i * 20)
//
//     svg.selectAll(".bar")
//         .on("mousemove", function (d) {
//                     tooltip
//                         .style("left", d3.event.pageX + 50 + "px")
//                         .style("top", d3.event.pageY - 70 + "px")
//                         .style("display", "inline-block")
//                         .html("<b> #" + d.ranknum + "<br> Rank: "+ d.winpercent + "<br> Price: "+ d.pricepercent + "<br> Sugar: "+ d.sugarpercent);
//                 })
//                 .on("mouseout", function (d) {
//                     tooltip.style("display", "none");
//                 });
//
//     bar.exit()
//       .transition(t)
//       .attr("width", 0)
//       .remove()
//
//
//     bartext = svg.selectAll(".bartext")
//                 .data(data)
//                 .enter()
//                 .append("text")
//                 .attr("class", "bartext")
//                 .attr("text-anchor", "middle")
//                 .attr("fill", "#f7f7f7")
//                 .attr("x", function(d,i) {
//                     return x(d.competitorname)+x.bandwidth()/2;
//                 })
//                 .attr("y", function(d,i) {
//                     return  y(d.winpercent) + 20;
//                 })
//                 .text(function(d){
//                      return d.ranknum;
//                 });
//
//     var gx = svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .style("text-anchor", "end")
//         .style("font-size", "0.8em")
//         .attr("transform", "rotate(-45)");
//
//     var gy = svg.append("g")
//         .call(d3.axisLeft(y));
//
// };
