const Accessory = require('./Accessory.js');

class SensorAccessory extends Accessory {
  constructor(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType) {
    super(log, url, accessToken, device, homebridge, ServiceType, CharacteristicType);

    const sensorService = new ServiceType(this.name);
    sensorService
    .getCharacteristic(CharacteristicType)
    .on('get', this.getCurrentValue.bind(this));

    this.services.push(sensorService);
  }

}

module.exports = SensorAccessory;
