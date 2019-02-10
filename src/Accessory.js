const EventSource = require('eventsource');

class Accessory {

  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    this.log = log;
    this.url = url;
    this.accessToken = accessToken;
    this.ServiceType = ServiceType;
    this.CharacteristicType = CharacteristicType;

    this.name = device.name;
    this.args = device.args;
    this.deviceId = device.device_id;
    this.fakeSerial = device.device_id.slice(-8).toUpperCase();
    this.type = device.type.toLowerCase();
    this.value = null;

    this.eventName = device.event_name;
    this.eventUrl = null;
    this.key = device.key;
    this.unit = null;
    this.splitCharacter = !device.split_character ? '=' : device.split_character;
    this.setParticleEventListener();

    const Service = homebridge.hap.Service;
    const Characteristic = homebridge.hap.Characteristic;
    this.informationService = new Service.AccessoryInformation();
    this.informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Particle')
    .setCharacteristic(Characteristic.Model, 'Photon')
    .setCharacteristic(Characteristic.SerialNumber, this.fakeSerial);

    this.services = [];
    this.services.push(this.informationService);
  }

  getServices() {
    return this.services;
  }

  setParticleEventListener() {
    if (this.eventName) {
      this.eventUrl = `${this.url}${this.deviceId}/events/${this.eventName}?access_token=${this.accessToken}`;
      this.log('Listening for events from:', this.eventUrl);
      const events = new EventSource(this.eventUrl);
      events.addEventListener(this.eventName, this.processEventData.bind(this));
      events.onerror = this.processEventError.bind(this);
    }
  }

  processEventError(error) {
    this.log('ERROR!', error);
  }

  processEventData(e) {
    const data = JSON.parse(e.data);
    const result = this.key ? data.data.split(this.splitCharacter)[1] : data.data;

    if (this.services.length < 2) {
      return;
    }

    const service = this.services[1];

    this.log(
      result, '-',
      service.displayName, '-',
      this.type
    );

    this.setCurrentValue(parseFloat(result));
    service
    .getCharacteristic(this.CharacteristicType)
    .setValue(this.value);
  }

  setCurrentValue(value) {
    this.value = value;
  }

  getCurrentValue(callback) {
    callback(null, this.value);
  }
}

module.exports = Accessory;
