/* jshint expr: true */
'use strict';

var should = require('should');
var formWidgetEditor = require('./../../formWidgetEditor');

describe('formWidgetEditor.js', function () {

  describe('isTitleValid(value)', function () {

    it('should return true for a valid string', function(){
       var value = "Hello Widget";
       formWidgetEditor.isTitleValid(value).should.be.true;
    });
        
    it('should return false for a zero-based length string', function(){
      var value = "";
      formWidgetEditor.isTitleValid(value).should.be.false;      
    });

    it('should return false for null value', function(){
      var value = null;
      formWidgetEditor.isTitleValid(value).should.be.false;
    });

    it('should return false for undefined value', function(){
      var value = undefined;
      formWidgetEditor.isTitleValid(value).should.be.false;
    });
            
  });

  describe('areUnitsValid(value)', function() {
    it('should return true for a valid unit of type metric', function () {
      var units = "metric";
      formWidgetEditor.areUnitsValid(units).should.be.true;
    });

    it('should return true for a valid unit of type imperial', function () {
      var units = "imperial";
      formWidgetEditor.areUnitsValid(units).should.be.true;
    });

    it('should return false for null value ', function () {
      var units = null;
      formWidgetEditor.areUnitsValid(units).should.be.false;

    });

    it('should return true for undefined value ', function () {
      var units = undefined;
      formWidgetEditor.areUnitsValid(units).should.be.false;
    });

  });

  describe('isShowWindValid(value)', function () {

    it('should return true for valid boolean true value', function () {
      var showWind = 'true';
      formWidgetEditor.isShowWindValid(showWind).should.be.true;
    });

    it('should return true for valid boolean false value', function () {
      var showWind = 'false';
      formWidgetEditor.isShowWindValid(showWind).should.be.true;
    });

    it('should return false for null value', function () {
      var showWind = null;
      formWidgetEditor.isShowWindValid(showWind).should.be.false;
    });

    it('should return false for undefined value', function () {
      var showWind = undefined;
      formWidgetEditor.isShowWindValid(showWind).should.be.false;
    });

  });


});