import * as validate from "../src/validate";
import * as math from "@danehansen/math";
import { expect } from "chai";
import fs from "fs";
import path from "path";

const REPEAT = 1000;

const FALSIES = ["", undefined, null, 0];
function testFalseys(func) {
  for (let falsy of FALSIES) {
    expect(func(falsy)).to.be.false;
  }
}

describe("validate", function() {
  describe("danehansen-validate.min.js", function() {
    it("is minified", function() {
      const min = fs.readFileSync(
        path.join(__dirname, "../danehansen-validate.min.js"),
        "utf8"
      );
      expect(min.match(/\n/g)).to.be.null;
    });
  });

  describe("creditCard", function() {
    it("invalidates no number", function() {
      testFalseys(validate.creditCard);
    });

    it("invalidates no card match", function() {
      expect(validate.creditCard("4820044246186")).to.be.false;
    });

    it("determines if number fits the luhn algorithm", function() {
      expect(validate.creditCard("4111111111111111")).to.equal("VISA");
      expect(validate.creditCard("4111111111111112")).to.be.false;
    });

    it("determines if number is VISA", function() {
      expect(validate.creditCard("4111111111111111")).to.equal("VISA");
    });

    it("determines if number is American Express", function() {
      expect(validate.creditCard("346306480441074")).to.equal(
        "American Express"
      );
      expect(validate.creditCard("378282246310005")).to.equal(
        "American Express"
      );
    });

    it("determines if number is MasterCard", function() {
      expect(validate.creditCard("5105105105105100")).to.equal("MasterCard");
      expect(validate.creditCard("5297738625606773")).to.equal("MasterCard");
      expect(validate.creditCard("5314174648354994")).to.equal("MasterCard");
      expect(validate.creditCard("5461173101406730")).to.equal("MasterCard");
      expect(validate.creditCard("5555555555554444")).to.equal("MasterCard");
    });

    it("determines if number is Discover", function() {
      expect(validate.creditCard("6011419503800480")).to.equal("Discover");
      expect(validate.creditCard("6516441415657527")).to.equal("Discover");
      expect(validate.creditCard("6442320382585334")).to.equal("Discover");
      expect(validate.creditCard("6455561703781581")).to.equal("Discover");
      expect(validate.creditCard("6464811888744212")).to.equal("Discover");
      expect(validate.creditCard("6470467775104176")).to.equal("Discover");
      expect(validate.creditCard("6482833426713804")).to.equal("Discover");
      expect(validate.creditCard("6496568537151288")).to.equal("Discover");
      expect(validate.creditCard("6221263851505135")).to.equal("Discover");
      expect(validate.creditCard("6229258632001240")).to.equal("Discover");
    });
  });

  describe("email", function() {
    it("invalidates no email", function() {
      testFalseys(validate.email);
    });

    it("validates good email", function() {
      expect(validate.email("ilikebigbutts@geocities.com")).to.be.true;
    });
  });

  describe("expiration", function() {
    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

    it("invalidates no number", function() {
      testFalseys(validate.expiration);
    });

    it("in validates less than 3 digits", function() {
      for (let i = 0; i <= 99; i++) {
        expect(validate.expiration(String(i))).to.be.false;
      }
    });

    it("validates 3 digits", function() {
      for (let year = 2000; year < 2100; year++) {
        const yearStr = String(year).slice(2, 4);
        for (let month = 0; month <= 9; month++) {
          const str = `${month}${yearStr}`;
          if (
            !month ||
            year < currentYear ||
            (year == currentYear && month < currentMonth)
          ) {
            expect(validate.expiration(str)).to.be.false;
          } else {
            expect(validate.expiration(str)).to.deep.equal({
              month,
              year
            });
          }
        }
      }
    });

    it("validates 4 digits", function() {
      for (let year = 2000; year < 2100; year++) {
        const yearStr = String(year).slice(2, 4);
        for (let month = 10; month <= 13; month++) {
          const str = `${month}${yearStr}`;
          if (
            month > 12 ||
            year < currentYear ||
            (year == currentYear && month < currentMonth)
          ) {
            expect(validate.expiration(str)).to.be.false;
          } else {
            expect(validate.expiration(str)).to.deep.equal({
              month,
              year
            });
          }
        }
      }
    });

    it("validates 5 digits", function() {
      for (let year = 2000; year < 2100; year++) {
        for (let month = 0; month <= 9; month++) {
          const str = `${month}${year}`;
          if (
            !month ||
            year < currentYear ||
            (year == currentYear && month < currentMonth)
          ) {
            expect(validate.expiration(str)).to.be.false;
          } else {
            expect(validate.expiration(str)).to.deep.equal({
              month,
              year
            });
          }
        }
      }
    });

    it("validates 6 digits", function() {
      for (let year = 1900; year < 2200; year++) {
        for (let month = 10; month <= 13; month++) {
          const str = `${month}${year}`;
          if (
            month > 12 ||
            year < currentYear ||
            (year == currentYear && month < currentMonth)
          ) {
            expect(validate.expiration(str)).to.be.false;
          } else {
            expect(validate.expiration(str)).to.deep.equal({
              month,
              year
            });
          }
        }
      }
    });

    it("in validates more than 6 digits", function() {
      for (let i = 0; i < REPEAT; i++) {
        let str = "";
        for (let j = math.random(7, 10, true); j > 0; j--) {
          str += math.random(0, 9, true);
        }
        expect(validate.expiration(str)).to.be.false;
      }
    });
  });

  describe("phoneNumber", function() {
    it("invalidates no number", function() {
      testFalseys(validate.phoneNumber);
    });

    it("invalidates less than 10 digit numbers", function() {
      for (let i = 0; i < REPEAT; i++) {
        const num = math.random(0, 999999999, true);
        expect(validate.phoneNumber(String(num))).to.be.false;
      }
    });

    it("validates 10 digit numbers", function() {
      for (let i = 0; i < REPEAT; i++) {
        const num = math.random(1000000000, 9999999999, true);
        const str = String(num);
        if (num >= 9110000000 && num <= 9119999999) {
          expect(validate.phoneNumber(str)).to.be.false;
        } else if (num >= 2000000000 && num <= 9999999999) {
          expect(validate.phoneNumber(str)).to.be.true;
        } else {
          expect(validate.phoneNumber(str)).to.be.false;
        }
      }
    });

    it("validates 11 digit numbers", function() {
      for (let i = 0; i < REPEAT; i++) {
        const num = math.random(10000000000, 99999999999, true);
        const str = String(num);
        let t = num >= 12000000000 && num <= 19999999999;
        if (num >= 19110000000 && num <= 19119999999) {
          expect(validate.phoneNumber(str)).to.be.false;
        } else if (num >= 12000000000 && num <= 19999999999) {
          expect(validate.phoneNumber(str)).to.be.true;
        } else {
          expect(validate.phoneNumber(str)).to.be.false;
        }
      }
    });

    it("invalidates more than 11 digit numbers", function() {
      for (let i = 0; i < REPEAT; i++) {
        const num = math.random(100000000000, 1000000000000, true);
        expect(validate.phoneNumber(String(num))).to.be.false;
      }
    });

    it("invalidates 911 numbers", function() {
      for (let i = 0; i < REPEAT; i++) {
        const num = math.random(9110000000, 9119999999, true);
        expect(validate.phoneNumber(String(num))).to.be.false;
      }
    });
  });

  describe("zipCode", function() {
    it("invalidates no number", function() {
      testFalseys(validate.zipCode);
    });

    it("validates 5 digit US zip codes", function() {
      expect(validate.zipCode("90210")).to.be.true;
      expect(validate.zipCode("1.23 4a")).to.be.false;
      expect(validate.zipCode("1.23 45a")).to.be.true;
      expect(validate.zipCode("1.23 45a6")).to.be.false;
    });

    it("validates 9 digit US zip codes", function() {
      expect(validate.zipCode("90210-1234")).to.be.true;
      expect(validate.zipCode("1.23 45a678")).to.be.false;
      expect(validate.zipCode("1.23 45a678-9")).to.be.true;
      expect(validate.zipCode("1.23 45a678-91")).to.be.false;
    });

    it("validates canadian zip codes", function() {
      expect(validate.zipCode("a1a1a1a", "ca")).to.be.false;
      expect(validate.zipCode("1a1a1a1", "ca")).to.be.false;
      expect(validate.zipCode("A 1a 1A-1", "ca")).to.be.true;
      expect(validate.zipCode("1a.1a?1a", "ca")).to.be.false;
      expect(validate.zipCode("w1a1a1", "ca")).to.be.false;
      expect(validate.zipCode("W1a1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1w1a1", "ca")).to.be.true;
      expect(validate.zipCode("Z1A1a1", "ca")).to.be.false;
      expect(validate.zipCode("Z1a1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1z1a1", "ca")).to.be.true;
      expect(validate.zipCode("a1d1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1f1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1i1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1o1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1q1a1", "ca")).to.be.false;
      expect(validate.zipCode("a1u1a1", "ca")).to.be.false;
    });
  });
});
