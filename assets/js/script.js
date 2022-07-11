const APIKey = "1d19cda4c60cdb1c9b264ede49ac9a5e";
let ls = JSON.parse(localStorage.getItem("Recent Searches"));
let recentSearches = [];
if (ls === null) {
  recentSearches = [
    "Previous City",
    "Previous City",
    "Previous City",
    "Previous City",
    "Previous City",
    "Previous City",
    "Previous City"
  ];
} else {
  recentSearches = ls;
  for (i = 0; i < recentSearches.length; i++) {
    $("#prev" + i).text(recentSearches[i]);
  }
}
$(".btn-primary").click(function(event) {
  event.preventDefault();
  let input = $(".form-control").val();
  setWeather(input);
  for (i = recentSearches.length - 1; i > 0; i--) {
    recentSearches[i] = recentSearches[i - 1];
  }
  recentSearches[0] = input;
  localStorage.setItem("Recent Searches", JSON.stringify(recentSearches));
  for (i = 0; i < recentSearches.length; i++) {
    $("#prev" + i).text(recentSearches[i]);
  }
});
$(".btn-secondary").click(function(event) {
  event.preventDefault();
  setWeather($("#" + event.target.id).text());
});

function setWeather(city) {
  let queryURL =
    "http://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=" +
    APIKey +
    "&units=imperial";
  fetch(queryURL).then(response => response.json()).then(data => {
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let queryURL2 =
      "http://api.openweathermap.org/data/2.5/onecall?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=" +
      APIKey +
      "&units=imperial&exclude=hourly,minutely";
    fetch(queryURL2).then(response => response.json()).then(data => {
      for (i = 0; i <= 5; i++) {
        let date = new Date(data.daily[i].dt * 1000);
        let dateFormat = date.toLocaleDateString();
        let img = data.daily[i].weather[0].icon;
        $("#" + i).children("h3").text(dateFormat);
        $("#" + i)
          .children("img")
          .attr("src", "http://openweathermap.org/img/wn/" + img + "@2x.png");
        $("#" + i).children(".temp").text("Temp: " + data.daily[i].temp.day);
        $("#" + i).children(".wind").text("Wind: " + data.daily[i].wind_speed);
        $("#" + i)
          .children(".humidity")
          .text("Humidity: " + data.daily[i].humidity + "%");
        if (i === 0) {
          $("#0").children("h2").text(city + " " + dateFormat);
          $("#0").children(".UV").text("UV Index: " + data.daily[0].uvi);
        }
        if (data.daily[0].uvi <= 4) {
          $("#0").children(".UV").css("background-color", "green");
        } else if (data.daily[0].uvi <= 8) {
          $("#0").children(".UV").css("background-color", "yellow");
        } else if (data.daily[0].uvi > 8) {
          $("#0").children(".UV").css("background-color", "red");
        }
      }
    });
  });
}
setWeather("Minneapolis");
