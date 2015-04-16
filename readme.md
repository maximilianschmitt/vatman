# vatman

A small CLI to help with reporting quarterly VAT stuff. Usage is documented for my personal use as this little module will probably not be of much help to anyone else.

## Installation

```
$ npm i vatman -g
```

## Usage

If you have a file called `paypal-payments.json`:

```json
{
  "source": "paypal",
  "quarter": 1,
  "year": 2015,
  "records": [
    {
      "countryCode": "DE",
      "payedAmount": 2970,
      "createdAt": "2015-01-20T12:03:00.000Z"
    },
    {
      "countryCode": "DE",
      "payedAmount": 2970,
      "createdAt": "2015-01-25T16:41:08.000Z"
    }
  ]
}
```

Type this into your console:

```
$ cat paypal-payments.json | vatman > paypal-payments.txt
```

This will generate a file `paypal-payments.txt` with the following contents:

```
2 PayPal-Bestellungen im 1. Quartal 2015

Monat     Land   Umsatzsteuer     Umsatz
Januar    DE     19% (EUR 4,74)   EUR 29,70
Januar    DE     19% (EUR 4,74)   EUR 29,70

Die angegebene Umsatzsteuer ist im Verkaufspreis immer enhalten. Bsp.: EUR 29,70 für Käufe aus Deutschland enthält 19% (EUR 4,74) Umsatzsteuer.

PayPal-Gebühren und Rückzahlungen können dem beiliegenden PayPal-Kontobericht entnommen werden.
```