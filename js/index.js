var eduDataUrl =
"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json";
var countyDataUrl =
"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json";
var tooltipbox = d3.select("#tooltip");
var eduData = void 0,countyData = void 0;
var isDataHere = false;
var bringTheData = function bringTheData(url, num) {
  var asyncCall = new XMLHttpRequest();
  asyncCall.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var info = JSON.parse(this.responseText);
      if (num === 1) {
        eduData = info;
        if (isDataHere) {
          MakeMap();
        }
        isDataHere = true;
      }
      if (num === 2) {
        countyData = info;
        if (isDataHere) {
          MakeMap();
        }
        isDataHere = true;
      }
    }
  };
  asyncCall.open("GET", url, true);
  asyncCall.send();
};
bringTheData(eduDataUrl, 1);
bringTheData(countyDataUrl, 2);
function MakeMap() {
  //console.log(eduData);
  var svg = d3.select("svg");

  var path = d3.geoPath();

  d3.json(countyDataUrl, function (error, us) {
    if (error) throw error;
    svg.append("g").attr("id", "legend");
    //legend
    var leg = d3.select("#legend");
    leg.
    append("rect").
    attr("width", "80px").
    attr("height", "30px").
    attr("fill", "rgba(0, 106, 193, 1)").
    attr("transform", "translate(800, 20)");
    leg.
    append("text").
    text("over 50%").
    attr("font-size", "1em").
    attr("y", 20).
    attr("text-anchor", "middle").
    attr("fill", "white").
    attr("transform", "translate(840, 20)").
    attr("class", "whiteText");
    leg.
    append("rect").
    attr("width", "80px").
    attr("height", "30px").
    attr("fill", "rgba(0, 106, 193, 0.8)").
    attr("transform", "translate(720, 20)");
    leg.
    append("text").
    text("40 ~ 50%").
    attr("font-size", "1em").
    attr("y", 20).
    attr("text-anchor", "middle").
    attr("fill", "white").
    attr("transform", "translate(760, 20)").
    attr("class", "whiteText");
    leg.
    append("rect").
    attr("width", "80px").
    attr("height", "30px").
    attr("fill", "rgba(0, 106, 193, 0.6)").
    attr("transform", "translate(640, 20)");
    leg.
    append("text").
    text("30 ~ 40%").
    attr("font-size", "1em").
    attr("y", 20).
    attr("text-anchor", "middle").
    attr("style", "color:white").
    attr("transform", "translate(680, 20)");
    leg.
    append("rect").
    attr("width", "80px").
    attr("height", "30px").
    attr("fill", "rgba(0, 106, 193, 0.4)").
    attr("transform", "translate(560, 20)");
    leg.
    append("text").
    text("under 20%").
    attr("font-size", "1em").
    attr("y", 20).
    attr("text-anchor", "middle").
    attr("style", "color:white").
    attr("transform", "translate(520, 20)");
    leg.
    append("rect").
    attr("width", "80px").
    attr("height", "30px").
    attr("fill", "rgba(0, 106, 193, 0.2)").
    attr("transform", "translate(480, 20)");
    leg.
    append("text").
    text("20 ~ 30%").
    attr("font-size", "1em").
    attr("y", 20).
    attr("text-anchor", "middle").
    attr("style", "color:white").
    attr("transform", "translate(600, 20)");

    svg.
    append("g").
    attr("class", "counties tooltip").
    selectAll("path").
    data(topojson.feature(us, us.objects.counties).features).
    enter().
    append("path").
    attr("d", path).
    attr("class", "county").
    attr("data-fips", function (data) {
      return data.id;
    }).
    attr("data-education", function (data) {
      var result = eduData.find(function (nameo) {return nameo.fips === data.id;});
      return result.bachelorsOrHigher;
    }).
    attr("state-ab", function (data) {
      var result = eduData.find(function (fips) {return fips.fips === data.id;});
      return result.state;
    }).
    attr("name-of-county", function (data) {
      var result = eduData.find(function (nameo) {return nameo.fips === data.id;});
      return result.area_name;
    }).
    attr("fill", function (data) {
      var result = eduData.find(function (nameo) {return nameo.fips === data.id;});
      var num = result.bachelorsOrHigher;
      if (num > 50) {
        return "rgba(0, 106, 193, 1)";
      } else if (num > 40) {
        return "rgba(0, 106, 193, 0.8)";
      } else if (num > 30) {
        return "rgba(0, 106, 193, 0.6)";
      } else if (num > 20) {
        return "rgba(0, 106, 193, 0.4)";
      } else {
        return "rgba(0, 106, 193, 0.2)";
      }
    }).
    on("mouseover", function (data) {
      var result = eduData.find(function (nameo) {return nameo.fips === data.id;});
      var num = result.bachelorsOrHigher;
      var targ = document.getElementById("tooltip");

      targ.setAttribute("data-education", num);
      targ.innerHTML =
      result.area_name + ", " + result.state + " " + num + "%";
      //   targ.data-education = result;

      targ.hidden = false;
      tooltipbox.
      style("left", d3.event.pageX - 60 + "px").
      style("top", d3.event.pageY - 70 + "px");
    }).
    on("mouseleave", function () {
      var tt = document.getElementById("tooltip");

      tt.innerHTML = " ";
      tt.hidden = true;
    });

    svg.
    append("path").
    attr("class", "county-borders").
    attr(
    "d",
    path(
    topojson.mesh(us, us.objects.counties, function (a, b) {
      return a !== b;
    })));


  });
}