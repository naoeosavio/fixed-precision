import { describe, expect, test } from "vitest";
import FixedPrecision, { fixedconfig } from "../src/FixedPrecision.js";

const FPTEST = FixedPrecision.create({ places: 20 , roundingMode: 4 }); // 13

const PI = FPTEST("3.14159265358979323846");


const RAD000 = FPTEST("0.0")
const RAD015 = FPTEST("0.26179938779914943653")
const RAD030 = FPTEST("0.52359877559829887307")
const RAD045 = FPTEST("0.78539816339744830961")
const RAD060 = FPTEST("1.04719755119659774615")
const RAD075 = FPTEST("1.30899693899574718269")
const RAD090 = FPTEST("1.57079632679489661923")
const RAD105 = FPTEST("1.83259571459404605576")
const RAD120 = FPTEST("2.09439510239319549230")
const RAD135 = FPTEST("2.35619449019234492884")
const RAD150 = FPTEST("2.61799387799149436538")
const RAD165 = FPTEST("2.87979326579064380192")
const RAD180 = FPTEST("3.14159265358979323846")
const RAD195 = FPTEST("3.40339204138894267499")
const RAD210 = FPTEST("3.66519142918809211153")
const RAD225 = FPTEST("3.92699081698724154807")
const RAD240 = FPTEST("4.18879020478639098461")
const RAD255 = FPTEST("4.45058959258554042115")
const RAD270 = FPTEST("4.71238898038468985769")
const RAD285 = FPTEST("4.97418836818383929422")
const RAD300 = FPTEST("5.23598775598298873076")
const RAD315 = FPTEST("5.49778714378213816730")
const RAD330 = FPTEST("5.75958653158128760384")
const RAD345 = FPTEST("6.02138591938043704038")
const RAD360 = FPTEST("6.28318530717958647692")

const SIN15 = FPTEST("0.25881904510252076234")
const SIN30 = FPTEST("0.50000000000000000000")
const SIN45 = FPTEST("0.70710678118654752440")
const SIN60 = FPTEST("0.86602540378443864676")
const SIN75 = FPTEST("0.96592582628906828674")

const TAN15 = FPTEST("0.26794919243112270647")
const TAN30 = FPTEST("0.57735026918962576450")
const TAN45 = FPTEST("1")
const TAN60 = FPTEST("1.73205080756887729352")
const TAN75 = FPTEST("3.73205080756887729352")
         
const SEC15 = FPTEST("1.03527618041008304939")
const SEC30 = FPTEST("1.15470053837925152901")
const SEC45 = FPTEST("1.41421356237309504880");
const SEC60 = FPTEST("2");
const SEC75 = FPTEST("3.86370330515627314699");

describe("Trigonometry", () => {
  test("sin 0°", () => { expect(RAD000.sin().toString()).toBe("0"); });
  test("sin 015°", () => { expect(RAD015.sin().toString()).toBe(SIN15.toString()); });
  test("sin 030°", () => { expect(RAD030.sin().toString()).toBe(SIN30.toString()); });
  test("sin 045°", () => { expect(RAD045.sin().toString()).toBe(SIN45.toString()); });
  test("sin 060°", () => { expect(RAD060.sin().toString()).toBe(SIN60.toString()); });
  test("sin 075°", () => { expect(RAD075.sin().toString()).toBe(SIN75.toString()); });
  test("sin 090°", () => { expect(RAD090.sin().toString()).toBe(TAN45.toString()); });
  test("sin 105°", () => { expect(RAD105.sin().toString()).toBe(SIN75.toString()); });
  test("sin 120°", () => { expect(RAD120.sin().toString()).toBe(SIN60.toString()); });
  test("sin 135°", () => { expect(RAD135.sin().toString()).toBe(SIN45.toString()); });
  test("sin 150°", () => { expect(RAD150.sin().toString()).toBe(SIN30.toString()); });
  test("sin 165°", () => { expect(RAD165.sin().toString()).toBe(SIN15.toString()); });
  test("sin 180°", () => { expect(RAD180.sin().toString()).toBe("0"); });
  test("sin 195°", () => { expect(RAD195.sin().toString()).toBe(SIN15.neg().toString()); });
  test("sin 210°", () => { expect(RAD210.sin().toString()).toBe(SIN30.neg().toString()); });
  test("sin 225°", () => { expect(RAD225.sin().toString()).toBe(SIN45.neg().toString()); });
  test("sin 240°", () => { expect(RAD240.sin().toString()).toBe(SIN60.neg().toString()); });
  test("sin 255°", () => { expect(RAD255.sin().toString()).toBe(SIN75.neg().toString()); });
  test("sin 270°", () => { expect(RAD270.sin().toString()).toBe(TAN45.neg().toString()); });
  test("sin 285°", () => { expect(RAD285.sin().toString()).toBe(SIN75.neg().toString()); });
  test("sin 300°", () => { expect(RAD300.sin().toString()).toBe(SIN60.neg().toString()); });
  test("sin 315°", () => { expect(RAD315.sin().toString()).toBe(SIN45.neg().toString()); });
  test("sin 330°", () => { expect(RAD330.sin().toString()).toBe(SIN30.neg().toString()); });
  test("sin 345°", () => { expect(RAD345.sin().toString()).toBe(SIN15.neg().toString()); });
  test("sin 360°", () => { expect(RAD360.sin().toString()).toBe("0"); });

  test("cos 0°", () => { expect(RAD000.cos().toString()).toBe(TAN45.toString()); });
  test("cos 015°", () => { expect(RAD015.cos().toString()).toBe(SIN75.toString()); });
  test("cos 030°", () => { expect(RAD030.cos().toString()).toBe(SIN60.toString()); });
  test("cos 045°", () => { expect(RAD045.cos().toString()).toBe(SIN45.toString()); });
  test("cos 060°", () => { expect(RAD060.cos().toString()).toBe(SIN30.toString()); });
  test("cos 075°", () => { expect(RAD075.cos().toString()).toBe(SIN15.toString()); });
  test("cos 090°", () => { expect(RAD090.cos().toString()).toBe("0"); });
  test("cos 105°", () => { expect(RAD105.cos().toString()).toBe(SIN15.neg().toString()); });
  test("cos 120°", () => { expect(RAD120.cos().toString()).toBe(SIN30.neg().toString()); });
  test("cos 135°", () => { expect(RAD135.cos().toString()).toBe(SIN45.neg().toString()); });
  test("cos 150°", () => { expect(RAD150.cos().toString()).toBe(SIN60.neg().toString()); });
  test("cos 165°", () => { expect(RAD165.cos().toString()).toBe(SIN75.neg().toString()); });
  test("cos 180°", () => { expect(RAD180.cos().toString()).toBe(TAN45.neg().toString()); });
  test("cos 195°", () => { expect(RAD195.cos().toString()).toBe(SIN75.neg().toString()); });
  test("cos 210°", () => { expect(RAD210.cos().toString()).toBe(SIN60.neg().toString()); });
  test("cos 225°", () => { expect(RAD225.cos().toString()).toBe(SIN45.neg().toString()); });
  test("cos 240°", () => { expect(RAD240.cos().toString()).toBe(SIN30.neg().toString()); });
  test("cos 255°", () => { expect(RAD255.cos().toString()).toBe(SIN15.neg().toString()); });
  test("cos 270°", () => { expect(RAD270.cos().toString()).toBe("0"); });
  test("cos 285°", () => { expect(RAD285.cos().toString()).toBe(SIN15.toString()); });
  test("cos 300°", () => { expect(RAD300.cos().toString()).toBe(SIN30.toString()); });
  test("cos 315°", () => { expect(RAD315.cos().toString()).toBe(SIN45.toString()); });
  test("cos 330°", () => { expect(RAD330.cos().toString()).toBe(SIN60.toString()); });
  test("cos 345°", () => { expect(RAD345.cos().toString()).toBe(SIN75.toString()); });
  test("cos 360°", () => { expect(RAD360.cos().toString()).toBe(TAN45.toString()); });

  test("tan 0°", () => { expect(RAD000.tan().toString()).toBe("0"); });
  test("tan 015°", () => { expect(RAD015.tan().toString()).toBe(TAN15.toString()); });
  test("tan 030°", () => { expect(RAD030.tan().toString()).toBe(TAN30.toString()); });
  test("tan 045°", () => { expect(RAD045.tan().toString()).toBe(TAN45.toString()); });
  test("tan 060°", () => { expect(RAD060.tan().toString()).toBe(TAN60.toString()); });
  test("tan 075°", () => { expect(RAD075.tan().toString()).toBe(TAN75.toString()); });
  test("tan 090° is large", () => { expect(() => RAD090.tan()).toThrow(); });
  test("tan 105°", () => { expect(RAD105.tan().toString()).toBe(TAN75.neg().toString()); });
  test("tan 120°", () => { expect(RAD120.tan().toString()).toBe(TAN60.neg().toString()); });
  test("tan 135°", () => { expect(RAD135.tan().toString()).toBe(TAN45.neg().toString()); });
  test("tan 150°", () => { expect(RAD150.tan().toString()).toBe(TAN30.neg().toString()); });
  test("tan 165°", () => { expect(RAD165.tan().toString()).toBe(TAN15.neg().toString()); });
  test("tan 180°", () => { expect(RAD180.tan().toString()).toBe("0"); });
  test("tan 195°", () => { expect(RAD195.tan().toString()).toBe(TAN15.toString()); });
  test("tan 210°", () => { expect(RAD210.tan().toString()).toBe(TAN30.toString()); });
  test("tan 225°", () => { expect(RAD225.tan().toString()).toBe(TAN45.toString()); });
  test("tan 240°", () => { expect(RAD240.tan().toString()).toBe(TAN60.toString()); });
  test("tan 255°", () => { expect(RAD255.tan().toString()).toBe(TAN75.toString()); });
  test("tan 270° is large", () => { expect(() => RAD270.tan()).toThrow(); });
  test("tan 285°", () => { expect(RAD285.tan().toString()).toBe(TAN75.neg().toString()); });
  test("tan 300°", () => { expect(RAD300.tan().toString()).toBe(TAN60.neg().toString()); });
  test("tan 315°", () => { expect(RAD315.tan().toString()).toBe(TAN45.neg().toString()); });
  test("tan 330°", () => { expect(RAD330.tan().toString()).toBe(TAN30.neg().toString()); });
  test("tan 345°", () => { expect(RAD345.tan().toString()).toBe(TAN15.neg().toString()); });
  test("tan 360°", () => { expect(RAD360.tan().toString()).toBe("0"); });

  test("sin equals cos at 045°", () => {
    expect(RAD045.sin().toString()).toBe(RAD045.cos().toString());
  });
  test("sin equals cos at 225°", () => {
    expect(RAD225.sin().toString()).toBe(RAD225.cos().toString());
  });
  test("sin equals tan at 0°", () => { expect(RAD000.sin().toString()).toBe(RAD000.tan().toString()); });
  test("sin equals tan at 180°", () => { expect(RAD180.sin().toString()).toBe(RAD180.tan().toString()); });
  test("sin equals tan at 360°", () => { expect(RAD360.sin().toString()).toBe(RAD360.tan().toString()); });

  test("complementary: sin(15°) = cos(75°)", () => {
    expect(RAD015.sin().toString()).toBe(RAD075.cos().toString());
  });
  test("complementary: sin(30°) = cos(60°)", () => {
    expect(RAD030.sin().toString()).toBe(RAD060.cos().toString());
  });
  test("complementary: sin(45°) = cos(45°)", () => {
    expect(RAD045.sin().toString()).toBe(RAD045.cos().toString());
  });
  test("complementary: sin(60°) = cos(30°)", () => {
    expect(RAD060.sin().toString()).toBe(RAD030.cos().toString());
  });
  test("complementary: sin(75°) = cos(15°)", () => {
    expect(RAD075.sin().toString()).toBe(RAD015.cos().toString());
  });

  test("sec 0°", () => { expect(RAD000.sec().toString()).toBe(TAN45.toString()); });
  test("sec 015°", () => { expect(RAD015.sec().toString()).toBe(SEC15.toString()); });
  test("sec 030°", () => { expect(RAD030.sec().toString()).toBe(SEC30.toString()); });
  test("sec 045°", () => { expect(RAD045.sec().toString()).toBe(SEC45.toString()); });
  test("sec 060°", () => { expect(RAD060.sec().toString()).toBe(SEC60.toString()); });
  test("sec 075°", () => { expect(RAD075.sec().toString()).toBe(SEC75.toString()); });
  test("sec 090° is large", () => { expect(() => RAD090.sec()).toThrow(); });
  test("sec 105°", () => { expect(RAD105.sec().toString()).toBe(SEC75.neg().toString()); });
  test("sec 120°", () => { expect(RAD120.sec().toString()).toBe(SEC60.neg().toString()); });
  test("sec 135°", () => { expect(RAD135.sec().toString()).toBe(SEC45.neg().toString()); });
  test("sec 150°", () => { expect(RAD150.sec().toString()).toBe(SEC30.neg().toString()); });
  test("sec 165°", () => { expect(RAD165.sec().toString()).toBe(SEC15.neg().toString()); });
  test("sec 180°", () => { expect(RAD180.sec().toString()).toBe(TAN45.neg().toString()); });
  test("sec 195°", () => { expect(RAD195.sec().toString()).toBe(SEC15.neg().toString()); });
  test("sec 210°", () => { expect(RAD210.sec().toString()).toBe(SEC30.neg().toString()); });
  test("sec 225°", () => { expect(RAD225.sec().toString()).toBe(SEC45.neg().toString()); });
  test("sec 240°", () => { expect(RAD240.sec().toString()).toBe(SEC60.neg().toString()); });
  test("sec 255°", () => { expect(RAD255.sec().toString()).toBe(SEC75.neg().toString()); });
  test("sec 270° is large", () => { expect((() => RAD270.sec())).toThrow(); });
  test("sec 285°", () => { expect(RAD285.sec().toString()).toBe(SEC75.toString()); });
  test("sec 300°", () => { expect(RAD300.sec().toString()).toBe(SEC60.toString()); });
  test("sec 315°", () => { expect(RAD315.sec().toString()).toBe(SEC45.toString()); });
  test("sec 330°", () => { expect(RAD330.sec().toString()).toBe(SEC30.toString()); });
  test("sec 345°", () => { expect(RAD345.sec().toString()).toBe(SEC15.toString()); });
  test("sec 360°", () => { expect(RAD360.sec().toString()).toBe(TAN45.toString()); });


  test("csc 0° throws", () => { expect(() => RAD000.csc()).toThrow(); });
  test("csc 015°", () => { expect(RAD015.csc().toString()).toBe(SEC75.toString()); });
  test("csc 030°", () => { expect(RAD030.csc().toString()).toBe(SEC60.toString()); });
  test("csc 045°", () => { expect(RAD045.csc().toString()).toBe(SEC45.toString()); });
  test("csc 060°", () => { expect(RAD060.csc().toString()).toBe(SEC30.toString()); });
  test("csc 075°", () => { expect(RAD075.csc().toString()).toBe(SEC15.toString()); });
  test("csc 090°", () => { expect(RAD090.csc().toString()).toBe(TAN45.toString()); });
  test("csc 105°", () => { expect(RAD105.csc().toString()).toBe(SEC15.toString()); });
  test("csc 120°", () => { expect(RAD120.csc().toString()).toBe(SEC30.toString()); });
  test("csc 135°", () => { expect(RAD135.csc().toString()).toBe(SEC45.toString()); });
  test("csc 150°", () => { expect(RAD150.csc().toString()).toBe(SEC60.toString()); });
  test("csc 165°", () => { expect(RAD165.csc().toString()).toBe(SEC75.toString()); });
  test("csc 180° is large", () => { expect(() => RAD180.csc()).toThrow(); });
  test("csc 195°", () => { expect(RAD195.csc().toString()).toBe(SEC75.neg().toString()); });
  test("csc 210°", () => { expect(RAD210.csc().toString()).toBe(SEC60.neg().toString()); });
  test("csc 225°", () => { expect(RAD225.csc().toString()).toBe(SEC45.neg().toString()); });
  test("csc 240°", () => { expect(RAD240.csc().toString()).toBe(SEC30.neg().toString()); });
  test("csc 255°", () => { expect(RAD255.csc().toString()).toBe(SEC15.neg().toString()); });
  test("csc 270°", () => { expect(RAD270.csc().toString()).toBe(TAN45.neg().toString()); });
  test("csc 285°", () => { expect(RAD285.csc().toString()).toBe(SEC15.neg().toString()); });
  test("csc 300°", () => { expect(RAD300.csc().toString()).toBe(SEC30.neg().toString()); });
  test("csc 315°", () => { expect(RAD315.csc().toString()).toBe(SEC45.neg().toString()); });
  test("csc 330°", () => { expect(RAD330.csc().toString()).toBe(SEC60.neg().toString()); });
  test("csc 345°", () => { expect(RAD345.csc().toString()).toBe(SEC75.neg().toString()); });
  test("csc 360° is large", () => { expect(() => RAD360.csc()).toThrow(); });

  test("cot 0° throws", () => { expect(() => RAD000.cot()).toThrow(); });
  test("cot 015°", () => { expect(RAD015.cot().toString()).toBe(TAN75.toString()); });
  test("cot 030°", () => { expect(RAD030.cot().toString()).toBe(TAN60.toString()); });
  test("cot 045°", () => { expect(RAD045.cot().toString()).toBe(TAN45.toString()); });
  test("cot 060°", () => { expect(RAD060.cot().toString()).toBe(TAN30.toString()); });
  test("cot 075°", () => { expect(RAD075.cot().toString()).toBe(TAN15.toString()); });
  test("cot 090°", () => { expect(RAD090.cot().toString()).toBe(RAD000.toString()); });
  test("cot 105°", () => { expect(RAD105.cot().toString()).toBe(TAN15.neg().toString()); });
  test("cot 120°", () => { expect(RAD120.cot().toString()).toBe(TAN30.neg().toString()); });
  test("cot 135°", () => { expect(RAD135.cot().toString()).toBe(TAN45.neg().toString()); });
  test("cot 150°", () => { expect(RAD150.cot().toString()).toBe(TAN60.neg().toString()); });
  test("cot 165°", () => { expect(RAD165.cot().toString()).toBe(TAN75.neg().toString()); });
  test("cot 180° is large", () => { expect(() => RAD180.cot()).toThrow(); });
  test("cot 195°", () => { expect(RAD195.cot().toString()).toBe(TAN75.toString()); });
  test("cot 210°", () => { expect(RAD210.cot().toString()).toBe(TAN60.toString()); });
  test("cot 225°", () => { expect(RAD225.cot().toString()).toBe(TAN45.toString()); });
  test("cot 240°", () => { expect(RAD240.cot().toString()).toBe(TAN30.toString()); });
  test("cot 255°", () => { expect(RAD255.cot().toString()).toBe(TAN15.toString()); });
  test("cot 270°", () => { expect(RAD270.cot().toString()).toBe(RAD000.toString()); });
  test("cot 285°", () => { expect(RAD285.cot().toString()).toBe(TAN15.neg().toString()); });
  test("cot 300°", () => { expect(RAD300.cot().toString()).toBe(TAN30.neg().toString()); });
  test("cot 315°", () => { expect(RAD315.cot().toString()).toBe(TAN45.neg().toString()); });
  test("cot 330°", () => { expect(RAD330.cot().toString()).toBe(TAN60.neg().toString()); });
  test("cot 345°", () => { expect(RAD345.cot().toString()).toBe(TAN75.neg().toString()); });
  test("cot 360° is large", () => { expect(() => RAD360.cot()).toThrow(); });

  // test("asin 0°", () => { expect(RAD000.asin().toString()).toBe(RAD000.toString()); });
  // test("asin 015°", () => { expect(SIN15.asin().toString()).toBe(RAD015.toString()); });
  // test("asin 030°", () => { expect(SIN30.asin().toString()).toBe(RAD030.toString()); });
  // test("asin 045°", () => { expect(SIN45.asin().toString()).toBe(RAD045.toString()); });
  // test("asin 060°", () => { expect(SIN60.asin().toString()).toBe(RAD060.toString()); });
  // test("asin 075°", () => { expect(SIN75.asin().toString()).toBe(RAD075.toString()); });
  // test("asin 090°", () => { expect(TAN45.asin().toString()).toBe(RAD090.toString()); });
  // test("asin 105°", () => { expect(SIN75.asin().toString()).toBe(RAD015.toString()); });
  // test("asin 120°", () => { expect(SIN60.asin().toString()).toBe(RAD030.toString()); });
  // test("asin 135°", () => { expect(SIN45.asin().toString()).toBe(RAD045.toString()); });
  // test("asin 150°", () => { expect(SIN30.asin().toString()).toBe(RAD060.toString()); });
  // test("asin 165°", () => { expect(SIN15.asin().toString()).toBe(RAD075.toString()); });
  // test("asin 180°", () => { expect(RAD000.asin().toString()).toBe(RAD000.toString()); });
  // test("asin 195°", () => { expect(SIN15.neg().asin().toString()).toBe(RAD015.neg().toString()); });
  // test("asin 210°", () => { expect(SIN30.neg().asin().toString()).toBe(RAD030.neg().toString()); });
  // test("asin 225°", () => { expect(SIN45.neg().asin().toString()).toBe(RAD045.neg().toString()); });
  // test("asin 240°", () => { expect(SIN60.neg().asin().toString()).toBe(RAD060.neg().toString()); });
  // test("asin 255°", () => { expect(SIN75.neg().asin().toString()).toBe(RAD075.neg().toString()); });
  // test("asin 270°", () => { expect(TAN45.neg().asin().toString()).toBe(RAD090.neg().toString()); });
  // test("asin 285°", () => { expect(SIN75.neg().asin().toString()).toBe(RAD075.neg().toString()); });
  // test("asin 300°", () => { expect(SIN60.neg().asin().toString()).toBe(RAD060.neg().toString()); });
  // test("asin 315°", () => { expect(SIN45.neg().asin().toString()).toBe(RAD045.neg().toString()); });
  // test("asin 330°", () => { expect(SIN30.neg().asin().toString()).toBe(RAD030.neg().toString()); });
  // test("asin 345°", () => { expect(SIN15.neg().asin().toString()).toBe(RAD015.neg().toString()); });
  // test("asin 360°", () => { expect(RAD000.asin().toString()).toBe(RAD000.toString()); });

  // test("acos 0°", () => { expect(TAN45.acos().toString()).toBe(RAD000.toString()); });
  // test("acos 015°", () => { expect(SIN75.acos().toString()).toBe(RAD015.toString()); });
  // test("acos 030°", () => { expect(SIN60.acos().toString()).toBe(RAD030.toString()); });
  // test("acos 045°", () => { expect(SIN45.acos().toString()).toBe(RAD045.toString()); });
  // test("acos 060°", () => { expect(SIN30.acos().toString()).toBe(RAD060.toString()); });
  // test("acos 075°", () => { expect(SIN15.acos().toString()).toBe(RAD075.toString()); });
  // test("acos 090°", () => { expect(RAD000.acos().toString()).toBe(RAD090.toString()); });
  // test("acos 105°", () => { expect(SIN15.neg().acos().toString()).toBe(RAD105.toString()); });
  // test("acos 120°", () => { expect(SIN30.neg().acos().toString()).toBe(RAD120.toString()); });
  // test("acos 135°", () => { expect(SIN45.neg().acos().toString()).toBe(RAD135.toString()); });
  // test("acos 150°", () => { expect(SIN60.neg().acos().toString()).toBe(RAD150.toString()); });
  // test("acos 165°", () => { expect(SIN75.neg().acos().toString()).toBe(RAD165.toString()); });
  // test("acos 180°", () => { expect(TAN45.neg().acos().toString()).toBe(RAD180.toString()); });
  // test("acos 195°", () => { expect(SIN75.neg().acos().toString()).toBe(RAD165.toString()); });
  // test("acos 210°", () => { expect(SIN60.neg().acos().toString()).toBe(RAD150.toString()); });
  // test("acos 225°", () => { expect(SIN45.neg().acos().toString()).toBe(RAD135.toString()); });
  // test("acos 240°", () => { expect(SIN30.neg().acos().toString()).toBe(RAD120.toString()); });
  // test("acos 255°", () => { expect(SIN15.neg().acos().toString()).toBe(RAD105.toString()); });
  // test("acos 270°", () => { expect(RAD000.acos().toString()).toBe(RAD090.toString()); });
  // test("acos 285°", () => { expect(SIN15.acos().toString()).toBe(RAD075.toString()); });
  // test("acos 300°", () => { expect(SIN30.acos().toString()).toBe(RAD060.toString()); });
  // test("acos 315°", () => { expect(SIN45.acos().toString()).toBe(RAD045.toString()); });
  // test("acos 330°", () => { expect(SIN60.acos().toString()).toBe(RAD030.toString()); });
  // test("acos 345°", () => { expect(SIN75.acos().toString()).toBe(RAD015.toString()); });
  // test("acos 360°", () => { expect(TAN45.acos().toString()).toBe(RAD000.toString()); });

  // test("atan 0°",   () => { expect(RAD000.atan().toString()).toBe(RAD000.toString()); });
  // test("atan 015°", () => { expect(TAN15.atan().toString()).toBe(RAD015.toString()); });
  // test("atan 030°", () => { expect(TAN30.atan().toString()).toBe(RAD030.toString()); });
  // test("atan 045°", () => { expect(TAN45.atan().toString()).toBe(RAD045.toString()); });
  // test("atan 060°", () => { expect(TAN60.atan().toString()).toBe(RAD060.toString()); });
  // test("atan 075°", () => { expect(TAN75.atan().toString()).toBe(RAD075.toString()); });
  // test("atan 090°", () => { expect(RAD090.toString()).toBe(RAD090.toString()); });
  // test("atan 105°", () => { expect(TAN75.neg().atan().toString()).toBe(RAD075.neg().toString()); });
  // test("atan 120°", () => { expect(TAN60.neg().atan().toString()).toBe(RAD060.neg().toString()); }); 
  // test("atan 135°", () => { expect(TAN45.neg().atan().toString()).toBe(RAD045.neg().toString()); });
  // test("atan 150°", () => { expect(TAN30.neg().atan().toString()).toBe(RAD030.neg().toString()); });
  // test("atan 165°", () => { expect(TAN15.neg().atan().toString()).toBe(RAD015.neg().toString()); });
  // test("atan 180°", () => { expect(RAD000.atan().toString()).toBe(RAD000.toString()); });
  // test("atan 195°", () => { expect(TAN15.atan().toString()).toBe(RAD015.toString()); });
  // test("atan 210°", () => { expect(TAN30.atan().toString()).toBe(RAD030.toString()); });
  // test("atan 225°", () => { expect(TAN45.atan().toString()).toBe(RAD045.toString()); });
  // test("atan 240°", () => { expect(TAN60.atan().toString()).toBe(RAD060.toString()); });
  // test("atan 255°", () => { expect(TAN75.atan().toString()).toBe(RAD075.toString()); });
  // test("atan 270°", () => { expect(RAD090.toString()).toBe(RAD090.toString()); });
  // test("atan 285°", () => { expect(TAN75.neg().atan().toString()).toBe(RAD075.neg().toString()); });
  // test("atan 300°", () => { expect(TAN60.neg().atan().toString()).toBe(RAD060.neg().toString()); });
  // test("atan 315°", () => { expect(TAN45.neg().atan().toString()).toBe(RAD045.neg().toString()); });
  // test("atan 330°", () => { expect(TAN30.neg().atan().toString()).toBe(RAD030.neg().toString()); });
  // test("atan 345°", () => { expect(TAN15.neg().atan().toString()).toBe(RAD015.neg().toString()); });
  // test("atan 360°", () => { expect(RAD000.atan().toString()).toBe(RAD000.toString()); });

//   // test("asin acos roundtrip", () => {
//   //   expect(FPTEST(SIN45.toString()).asin().sin().toString()).toBe(SIN45.toString());
//   //   expect(FPTEST(SIN45.toString()).acos().cos().toString()).toBe(SIN45.toString());
//   // });

  // test("inverse domain validation", () => {
  //   expect(() => FPTEST("1.5").asin()).toThrow();
  //   expect(() => FPTEST("1.5").acos()).toThrow();
  //   expect(() => FPTEST("-1.5").asin()).toThrow();
  //   expect(() => FPTEST("0.5").asec()).toThrow();
  //   expect(() => FPTEST("0.5").acsc()).toThrow();
  // });

  // test("domain validation", () => {
  //   expect(() => FPTEST("0").csc()).toThrow();
  //   expect(() => FPTEST("0").cot()).toThrow();
  //   expect(() => FPTEST("2").asin()).toThrow();
  //   expect(() => FPTEST("2").acos()).toThrow();
  //   expect(() => FPTEST("0.5").asec()).toThrow();
  //   expect(() => FPTEST("0.5").acsc()).toThrow();
  //   expect(() => FPTEST("0.5").acosh()).toThrow();
  //   expect(() => FPTEST("1").atanh()).toThrow();
  //   expect(() => FPTEST("2").asech()).toThrow();
  //   expect(() => FPTEST("0").acsch()).toThrow();
  //   expect(() => FPTEST("1").acoth()).toThrow();
  //   expect(() => FPTEST("0").csch()).toThrow();
  //   expect(() => FPTEST("0").coth()).toThrow();
  // });

  // test("sinh 0.5", () => { expect(FPTEST("0.5").sinh().toString()).toBe(FPTEST("0.52109530549374736162").toString()); });
  // test("cosh 0.5", () => { expect(FPTEST("0.5").cosh().toString()).toBe(FPTEST("1.12762596520638078522").toString()); });
  // test("tanh 0.5", () => { expect(FPTEST("0.5").tanh().toString()).toBe(FPTEST("0.46211715726000975850").toString()); });
  // test("sech 0.5", () => { expect(FPTEST("0.5").sech().toString()).toBe(FPTEST("0.88681888397007390866").toString()); });
  // test("csch 0.5", () => { expect(FPTEST("0.5").csch().toString()).toBe(FPTEST("1.91903475133494371950").toString()); });
  // test("coth 0.5", () => { expect(FPTEST("0.5").coth().toString()).toBe(FPTEST("2.16395341373865284878").toString()); });

  // test("asinh 1.5", () => { expect(FPTEST("1.5").asinh().toString()).toBe(FPTEST("1.19476321728710930410").toString()); });
  // test("acosh 1.5", () => { expect(FPTEST("1.5").acosh().toString()).toBe(FPTEST("0.96242365011920689499").toString()); });
  // test("atanh 0.5", () => { expect(FPTEST("0.5").atanh().toString()).toBe(FPTEST("0.54930614433405484569").toString()); });
  // test("asech 0.5", () => { expect(FPTEST("0.5").asech().toString()).toBe(FPTEST("1.31695789692481670862").toString()); });
  // test("acsch 2", () => { expect(FPTEST("2").acsch().toString()).toBe(FPTEST("0.48121182505960344749").toString()); });
  // test("acoth 2", () => { expect(FPTEST("2").acoth().toString()).toBe(FPTEST("0.54930614433405484569").toString()); });

  // test("static wrappers", () => {
  //   fixedconfig.configure({ places: 20, roundingMode: 4 });
  //   try {
  //     expect(FixedPrecision.sin("0.5").toString()).toBe(new FixedPrecision("0.5").sin().toString());
  //     expect(FixedPrecision.cos("0.5").toString()).toBe(new FixedPrecision("0.5").cos().toString());
  //     expect(FixedPrecision.tan("0.5").toString()).toBe(new FixedPrecision("0.5").tan().toString());
  //     expect(FixedPrecision.atan2("1", "-1").toString()).toBe(new FixedPrecision("1").atan2(new FixedPrecision("-1")).toString());
  //     expect(FixedPrecision.acosh("1.5").toString()).toBe(new FixedPrecision("1.5").acosh().toString());
  //   } finally {
  //     fixedconfig.configure({ places: 8, roundingMode: 4 });
  //   }
  // });
});


