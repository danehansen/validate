# validate ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@danehansen/validate.svg) ![npm](https://img.shields.io/npm/dt/@danehansen/validate.svg)

The validate library contains a collection of validating methods either written or collected to make my life easier. These methods are not formatters, they only validate.

## Installation

`npm install --save @danehansen/validate`

## Usage

As a module:

    import * as validate from '@danehansen/validate';

    var isValid = validate.zipCode('902101234');

In your browser:

    <script src='danehansen-validate.min.js'></script>
    <script>
      var validate = window.danehansen.validate;

      var isValid = validate.zipCode('902101234');
    </script>

## Methods

- **creditCard**(str:String):\*  
  Validates American Express, Discover, MasterCard and VISA numbers. Returns a string stating the name of the credit card type if valid, and false if invalid.
- **email**(str:String):Boolean  
  Validates email address.
- **expiration**(mmyy:String):\*  
  Validates a month/year expiration date. Checks that a valid month and year in formats MYY, MMYY, MYYYY, or MMYYYY exists and that it is in the future or equal to the current date. If valid, returns an object containing the month and year as numbers. If invalid, returns false.
- **phoneNumber**(str:String):Boolean  
  Validates a North American phone number, with or without the country code.
- **zipCode**(str:String, country:String = 'us'):Boolean  
  Validates a zip code for US or CA.
