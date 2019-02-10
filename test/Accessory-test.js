require('should');
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));

const expect = chai.expect;

const dummyConfig = require('./dummyConfig.js');
const dummyHomebridge = require('./dummyHomebridge.js');

const Accessory = require('../src/Accessory.js');


describe('Accessory.js', () => {
  let accessory;
  let Service;
  let Characteristic;

  describe('constructor', () => {
    it('should assign parameter values to member variables', () => {
      const homebridge = dummyHomebridge(dummyConfig);
      const device = dummyConfig.devices[0];
      const dummyURL = 'https://some.random.url.com/';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';

      Service = homebridge.hap.Service;
      Characteristic = homebridge.hap.Characteristic;
      accessory = new Accessory(
        () => {}, dummyURL, dummyAccessToken, device, homebridge, Service.Lightbulb, Characteristic.On
      );
      accessory.url.should.be.equal('https://some.random.url.com/');
      accessory.accessToken.should.be.equal('MY_top_SECRET_access_TOKEN');
      accessory.deviceId.should.be.equal('abcdef1234567890');
      accessory.ServiceType.should.be.equal(Service.Lightbulb);
      accessory.CharacteristicType.should.be.equal(Characteristic.On);
      accessory.eventName.should.be.equal(device.event_name)
      accessory.services.should.have.length(1);
      accessory.services[0].should.be.an.instanceOf(Service.AccessoryInformation);
      accessory.eventName.should.be.equal(device.event_name);
      accessory.splitCharacter.should.be.equal(device.split_character);
    });
  });

  describe('member functions', () => {
    let accessory;
    let Service;
    let Characteristic;
    const device = dummyConfig.devices[3];

    before(() => {
      const homebridge = dummyHomebridge(dummyConfig);
      const dummyURL = 'https://some.random.url.com/';
      const dummyAccessToken = 'MY_top_SECRET_access_TOKEN';
      Service = homebridge.hap.Service;
      Characteristic = homebridge.hap.Characteristic;
      accessory = new Accessory(
        () => {},
        dummyURL,
        dummyAccessToken,
        device,
        homebridge,
        Service.HumiditySensor,
        Characteristic.CurrentRelativeHumidity
      );
    });

    it('getServices() should return all services', () => {
      const services = accessory.getServices();
      services.should.have.length(1);
      services[0].should.be.an.instanceOf(Service.AccessoryInformation);
    });

    it('setParticleEventListener() should conditionally assign an event callback', () => {
      accessory.eventUrl.should.be.equal(
          'https://some.random.url.com/1234567890abcdef/events/humidity?access_token=MY_top_SECRET_access_TOKEN'
      );
    });

    it('setCurrentValue() should set value', () => {
      accessory.setCurrentValue(88.8);
      accessory.value.should.be.equal(88.8);
    });

    it('getCurrentValue() should call callback with value', () => {
      const spy = sinon.spy();
      accessory.value = 77.7;
      accessory.getCurrentValue(spy);
      expect(spy).to.have.been.calledOnce;
      expect(spy).to.have.been.calledWith(null, 77.7);
    });

    it.skip('processEventData()', () => {

    });

    it.skip('processEventError()', () => {

    });
  });
});
