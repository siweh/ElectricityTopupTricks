// this is our
module.exports = function (pool) {
  // list all the streets the we have on records
  async function streets() {
    try {
      const streets = await pool.query(`select * from street`);
      return streets.rows;
    } catch (error) {
      console.log(error);
    }
  }

  // for a given street show all the meters and their balances
  async function streetMeters(streetId) {
    try {
      let results = await pool.query(
        `select street_number, balance  from electricity_meter where id = $1`,
        [streetId]
      );
      // console.log(results);
      return results.rows;
    } catch (error) {
      console.log(error);
    }
  }

  // return all the appliances
  async function appliances() {
    try {
      let results = await pool.query(`select name, rate from appliance`);
      //console.log(results);
      return results.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async function meterData(meterId) {
    try {
      let results = await pool.query(
        `select * from electricity_meter join street on street.id =electricity.street_id where street_id = $1`,
        [meterId]
      );
      //console.log(results);
      return results.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async function useElectricity(units, meterId) {
    try {
      let results = await pool.query(
        `update electricity_meter set balance = balance - $1 where street_id = $2`,
        [units, meterId]
      );
      //console.log(results);
      return results.rows;
    } catch (error) {
      //console.log(error);
    }
  }

  // increase the meter balance for the meterId supplied
  async function topupElectricity(units, meterId) {
    try {
      let results = await pool.query(
        `update electricity_meter set balance = balance + $1 where street_number = $2`,
        [units, meterId]
      );

      console.log(results.rows);
      return results.rows;
    } catch (error) {
      console.log(error);
    }
  }

  async function getUpdatedUnits(meterId) {
    let results = await pool.query(
      `select balance, street_id from electricity_meter where street_id = $1`,
      [meterId]
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
    getUpdatedUnits,
  };
};
