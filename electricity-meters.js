// this is our
module.exports = function (pool) {
  // list all the streets the we have on records
  async function streets() {
    const streets = await pool.query(`select * from street`);
    return streets.rows;
  }

  // for a given street show all the meters and their balances
  async function streetMeters(streetId) {
    let results = await pool.query(
      `select street_number, balance  from electricity_meter where id = $1`,
      [streetId]
    );
    // console.log(results);
    return results.rows;
  }

  // return all the appliances
  async function appliances() {
    let results = await pool.query(`select name, rate from appliance`);
    //console.log(results);
    return results.rows;
  }

  async function meterData(meterId) {
    let results = await pool.query(
      `select * from electricity_meter join street on street.id =electricity.street_id where street_id = $1`,
      [meterId]
    );
    console.log(results);
    return results.rows;
  }

  async function useElectricity(units, meterId) {
    let results = await pool.query(
      `update electricity_meter set balance = balance - $1 where street_id = $2`,
      [units, meterId]
    );
    console.log(results);
    return results.rows;
  }

  // increase the meter balance for the meterId supplied
  async function topupElectricity(units, meterId) {
    let results = await pool.query(
      `update electricity_meter set balance = balance + $1 where street_number = $2`,
      [units, meterId]
    );
    //console.log(results);
    return results.rows;
  }

  // return the data for a given balance
  function meterData(meterId) {}

  // decrease the meter balance for the meterId supplied
  function useElectricity(meterId, units) {}

  return {
    streets,
    streetMeters,
    appliances,
    topupElectricity,
    meterData,
    useElectricity,
  };
};
