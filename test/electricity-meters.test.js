const assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;
const ElectricityMeters = require('../electricity-meters');

// let useSSL = false;
// let local = process.env.LOCAL || false;
// if (process.env.DATABASE_URL && !local) {
//   useSSL = true;
// }
const connectionString = 'postgresql://localhost:5432/topups_db';

const pool = new Pool({
  connectionString,
  //   ssl: {
  //     rejectUnauthorized: false,
  //   },
});

describe('The Electricity meter', function () {
  this.beforeAll(function () {
    pool.query(`update electricity_meter set balance = 50`);
  });

  it('should see all the streets', async function () {
    const electricityMeters = ElectricityMeters(pool);
    const streets = await electricityMeters.streets();

    const streetList = [
      {
        id: 1,
        name: 'Miller Street',
      },
      {
        id: 2,
        name: 'Mathaba Crescent',
      },
      {
        id: 3,
        name: 'Vilakazi Road',
      },
    ];

    assert.deepStrictEqual(streetList, streets);
  });

  it('should see all the appliances', async function () {
    const electricityMeters = ElectricityMeters(pool);
    const appliances = await electricityMeters.appliances();

    assert.deepStrictEqual(
      [
        {
          name: 'Stove',
          rate: '4.50',
        },
        {
          name: 'TV',
          rate: '1.80',
        },
        {
          name: 'Heater',
          rate: '3.50',
        },
        {
          name: 'Fridge',
          rate: '4.00',
        },
        {
          name: 'Kettle',
          rate: '2.70',
        },
      ],
      appliances
    );
  });

  it('should see all the appliances', async function () {
    const electricityMeters = ElectricityMeters(pool);
    const appliances = await electricityMeters.appliances();

    assert.deepStrictEqual(
      [
        {
          name: 'Stove',
          rate: '4.50',
        },
        {
          name: 'TV',
          rate: '1.80',
        },
        {
          name: 'Heater',
          rate: '3.50',
        },
        {
          name: 'Fridge',
          rate: '4.00',
        },
        {
          name: 'Kettle',
          rate: '2.70',
        },
      ],
      appliances
    );
  });

  it('show all the meters and their balances', async function () {
    const electricityMeters = ElectricityMeters(pool);
    const streetMeter = await electricityMeters.streetMeters(8);
    assert.deepStrictEqual(
      [{ street_number: '6', balance: '50.00' }],
      streetMeter
    );
  });

  it('should be able to use electricity', async function () {
    const electricityMeters = ElectricityMeters(pool);
    await electricityMeters.useElectricity(20.0, 1);
    assert.deepEqual(
      [
        { balance: 50.0, street_id: 1 },
        { balance: 50.0, street_id: 1 },
        { balance: 50.0, street_id: 1 },
      ],
      await electricityMeters.getUpdatedUnits(1)
    );
  });

  it('should be able to topup electricity', async function () {
    const electricityMeters = ElectricityMeters(pool);
    await electricityMeters.topupElectricity(20, 2);

    assert.deepEqual(
      [
        { balance: 50.0, street_id: 2 },
        { balance: 50.0, street_id: 2 },
        { balance: 50.0, street_id: 2 },
      ],
      await electricityMeters.getUpdatedUnits(2)
    );
  });

  this.afterAll(function () {
    pool.end();
  });
});
