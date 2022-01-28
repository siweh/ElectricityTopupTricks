const express = require('express');
const exphbs = require('express-handlebars');
const pg = require('pg');
const Pool = pg.Pool;

const app = express();
const PORT = process.env.PORT || 3017;

const ElectricityMeters = require('./electricity-meters');

// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local) {
//   useSSL = true;
// }

const connectionString =
  process.env.DATABASE_URL || 'postgresql://localhost:5432/topups_db';

const pool = new Pool({
  connectionString,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

const electricityMeters = ElectricityMeters(pool);

app.get('/', function (req, res) {
  res.redirect('/streets');
});

app.get('/streets', async function (req, res) {
  const streets = await electricityMeters.streets();
  //console.log(streets);
  res.render('streets', {
    streets,
  });
});

app.get('/appliances', async function (req, res) {
  const appliances = await electricityMeters.appliances();
  //console.log(appliances);
  res.render('appliances', {
    appliances,
  });
});

app.get('/meter/:street_id', async function (req, res) {
  // use the streetMeters method in the factory function...
  // send the street id in as sent in by the URL parameter street_id - req.params.street_id

  // create  template called street_meters.handlebars
  // in there loop over all the meters and show them on the screen.
  // show the street number and name and the meter balance

  const streetMeter = await electricityMeters.streetMeters(
    req.params.street_id
  );
  //console.log(req.params.street_id);
  //console.log(streetMeter);
  res.render('street_meters', {
    streetMeter,
  });
});

app.get('/meter/use/:meter_id', async function (req, res) {
  //console.log(req);
  // show the current meter balance and select the appliance you are using electricity for
  let meters = await electricityMeters.getUpdatedUnits(req.params.meter_id);
  await electricityMeters.appliances();
  //console.log(meters);
  res.render('use_electricity', {
    meters,
  });
});

app.post('/meter/use/:meter_id', async function (req, res) {
  //console.log(req);
  // update the meter balance with the usage of the appliance selected.
  await electricityMeters.appliances();
  let useElectricity = await electricityMeters.useElectricity(
    req.params.balance,
    req.params.street_id
  );
  console.log(useElectricity);
  res.render(`/meter/use/${req.params.meter_id}`, { useElectricity });
});

// start  the server and start listening for HTTP request on the PORT number specified...
app.listen(PORT, function () {
  console.log(`App started on port ${PORT}`);
});
