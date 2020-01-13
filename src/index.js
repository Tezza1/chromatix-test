var http = require('http');
let fs = require('fs');

//create a server object:
http
  .createServer(async function(req, res) {
    let xml_data = fs.readFileSync(__dirname + '/../data.xml', 'utf8');

    /*let results = {
      Wimmera:
        "Partly cloudy. The chance of a thunderstorm with little or no rainfall in the morning and afternoon. Winds southwesterly 15 to 25 km/h turning southerly 20 to 25 km/h during the day. Overnight temperatures falling to between 14 and 19 with daytime temperatures reaching 25 to 31.",
      "South West":
        "Partly cloudy. Slight (20%) chance of a shower near the Otways in the morning. Near zero chance of rain elsewhere. The chance of a thunderstorm with little or no rainfall in the morning and afternoon. Winds south to southwesterly 15 to 25 km/h. Overnight temperatures falling to around 14 with daytime temperatures reaching between 18 and 24."
    };*/

    const getWeatherForecast = (data, region_scope) => {
      if (!data.length) {
        return 'There was an error. Provide data';
      }

      let obj = {};
      let results = data.split('<');
      let regex = new RegExp(region_scope);

      for (let i in results) {
        if (regex.test(results[i])) {
          let row = results[i].split('description="');
          let key = row[1].substr(0, row[1].indexOf('"'));

          let forecast = '';
          for (let j = i; j < results.length; j++) {
            if (/index="3"/.test(results[j])) {
              forecast = results[j + 1].substr(results[j + 1].indexOf('>') + 1);
              break;
            }
          }
          obj[key] = forecast;
        }
      }
      return obj;
    };

    // For each region
    // let results = getWeatherForecast(xml_data, 'public-district');
    // For each location
    let results = getWeatherForecast(xml_data, 'location');

    res.write(JSON.stringify(results));
    res.end();
  })
  .listen(8080); //the server object listens on port 8080
