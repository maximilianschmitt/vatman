"use strict";

var _ = require("lodash");
var moment = require("moment");
var data = require("./vat-rates.json").data.rates;

var jsonvat = {
  data: data,
  ratesFor: function (countryCode, when) {
    if (!this.data) {
      throw new Error("No data set");
    }

    var vatInfo = _.find(this.data, function (country) {
      return country.code.toLowerCase() === countryCode.toLowerCase();
    });

    when = when || moment();

    const sortedPeriods = vatInfo.periods
      .slice()
      .sort(
        (a, b) =>
          moment(a.effective_from).valueOf() -
          moment(b.effective_from).valueOf()
      );

    var currentPeriod = sortedPeriods.reverse().find((period) => {
      var effectiveFrom = moment(period.effective_from);

      if (effectiveFrom.isSameOrBefore(when, "day")) {
        return period;
      }
    });
    if (!currentPeriod) {
      currentPeriod = sortedPeriods[0];
    }

    return currentPeriod.rates;
  },
  countries: function () {
    return _.map(this.data, function (country) {
      return { code: country.country_code, name: country.name };
    });
  },
};

module.exports = jsonvat;
