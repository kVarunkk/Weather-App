const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//when you open webpage
app.get("/", function (req, res) {
  res.render("index", { weather: null, error: null });
});

//when you submit query
app.post("/", function (req, res) {
  let apiKey = "670bb672bb72dcfb6488f919c720423a";
  let city = req.body.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  //request to fetch info from API
  request(url, function (err, response, body) {
    if (err) {
      res.render("index", { weather: null, error: "Error, please try again" });
    } else {
      //convert JSON strings to JS objects
      let weather = JSON.parse(body);

      if (weather.main == undefined) {
        res.render("index", {
          weather: null,
          error: "Error, please try again/ Enter City Name",
        });
      } else {
        place = `${weather.name}, ${weather.sys.country}`;
        weatherTimezone = new Date(weather.dt * 1000 - weather.timezone * 1000);
        temp = weather.main.temp;
        weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
        weatherId = weather.weather[0].id;
        tempMin = weather.main.temp_min;
        tempMax = weather.main.temp_max;
        humidity = weather.main.humidity;
        feelsLike = weather.main.feels_like;
        main = weather.weather[0].main;

        //render index.ejs and supply all variables
        res.render("index", {
          place: place,
          weather: weather,
          temp: temp,
          timezone: weatherTimezone,
          icon: weatherIcon,
          main: main,
          id: weatherId,
          minTemp: tempMin,
          maxTemp: tempMax,
          humid: humidity,
          feels: feelsLike,
          error: null,
        });
      }
    }
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Weather app listening on port 3000!");
});

module.exports = app;
