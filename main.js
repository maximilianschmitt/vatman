"use strict";

const spaceAlign = require("space-align");
const through = require("through2");
const pad = require("pad");
const JSONStream = require("JSONStream");
const BigNumber = require("bignumber.js");
const moment = require("moment");
const vatRates = require("./vat-rates");

const months = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

process.stdin.pipe(JSONStream.parse()).pipe(vatman()).pipe(process.stdout);

function vatman() {
  return through.obj(function (chunk, enc, cb) {
    const dataHeadings = ["Monat", "Land", "Umsatzsteuer", "Umsatz"];

    const records = chunk.records.map(function (record, i) {
      const countryCode = record.countryCode;
      const rates = vatRates.ratesFor(
        countryCode !== "N/A" ? countryCode : "DE",
        moment(record.createdAt)
      );
      const payedAmount = new BigNumber(record.payedAmount).div(100);
      const vatRate = new BigNumber(rates.standard).div(100);
      const vatAmount = payedAmount.minus(payedAmount.div(vatRate.plus(1)));

      return [
        months[new Date(record.createdAt).getMonth()],
        countryCode,
        vatRate * 100 + "% (EUR " + formatPrice(vatAmount) + ")",
        "EUR " + formatPrice(payedAmount),
      ];
    });

    this.push(
      `${records.length} PayPal-Bestellungen im ${chunk.quarter}. Quartal ${chunk.year}\n\n`
    );

    spaceAlign([dataHeadings].concat(records), { spacing: 3 }).forEach(
      function (row) {
        this.push(row + "\n");
      }.bind(this)
    );

    this.push(
      "\nDie angegebene Umsatzsteuer ist im Verkaufspreis immer enhalten. Bsp.: EUR 29,70 für Käufe aus Deutschland enthält 19% (EUR 4,74) Umsatzsteuer.\n"
    );
    this.push(
      "\nPayPal-Gebühren und Rückzahlungen können dem beiliegenden PayPal-Kontobericht entnommen werden.\n"
    );

    cb();
  });
}

function formatPrice(bn) {
  return bn.toFormat(2).replace(".", ",");
}
