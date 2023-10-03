import {Component, OnInit} from '@angular/core';
import {BleClient, numberToUUID} from '@capacitor-community/bluetooth-le';

import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  client: any
  status: any = false
  bleClient = BleClient;

  service = numberToUUID(0x1800)
  read = '00002A00-0000-1000-8000-00805F9B34FB'

  testUUID = '00001101-0000-1000-8000-00805F9B34FB'

  goProControlAndQueryServiceUUID =
    '0000fea6-0000-1000-8000-00805f9b34fb'.toUpperCase();
  readUUID =
    '00009AFD-0000-1000-8000-00805f9b34fb'.toUpperCase();
  goProWifiAccessPointServiceUUID =
    'b5f90001-aa8d-11e3-9046-0002a5d5c51b'.toUpperCase();

  constructor(
    private platform: Platform,
    // private bleClient: BleClient
  ) {
  }

  ngOnInit() {
    this.initialize()
  }

  async initialize() {
    if (this.platform.is('android')) {
      const isLocationEnabled = await this.bleClient.isLocationEnabled();
      this.status = isLocationEnabled
      console.log(isLocationEnabled)
      if (!isLocationEnabled) {
        await this.bleClient.openLocationSettings();
      }
      this.status = isLocationEnabled
    }
    await this.bleClient.initialize({androidNeverForLocation: true});
  }


  async connect() {
    // try {
    //
    //   await this.bleClient.requestLEScan(
    //     {
    //     },
    //     (result) => {
    //       console.log('New scan result');
    //       console.log('name - ',result.device.name)
    //       console.log('deviceId - ',result.device.deviceId)
    //       console.log('uuids - ',result.device.uuids)
    //     }
    //   );
    //
    //   setTimeout(async () => {
    //     await this.bleClient.stopLEScan();
    //     console.log('BLUE stopped scanning');
    //   }, 20000);
    // } catch (error) {
    //   console.error(error);
    // }

    try {

      const result = await this.bleClient.requestDevice();
      console.log('start')
      console.log(result.name)
      console.log(result.deviceId)
      console.log(result.uuids)

    } catch (error) {
      console.error('Bluetooth error:', error);
    }
  }

  onBluetoothDeviceFound(result: any) {
    console.log('received new scan result', result);
    // this.bluetoothScanResults.push(result);
  }


  async connectToDevice() {
    try {
      const macAddress: string = 'FC:29:99:B8:78:0E';

      await this.bleClient.connect(macAddress);

      console.log('Подключено к устройству:', macAddress);

      const res = await this.bleClient.read(macAddress, this.service, this.read)

      console.log('res 1 - ', res.getUint8(0))
      console.log('res 2 - ', JSON.stringify(res))
      // Подписываемся на изменения и получаем данные по J1939
      await this.bleClient.startNotifications(macAddress,this.service,this.read,(res)=>{
        console.log('current heart rate', this.parseData(res));
      });
      //
      // this.bleClient.addListener('notifications', (notification) => {
      //   const value = notification.value;
      //   console.log('Получены данные J1939:', value);
      //   // Обработка полученных данных J1939
      // });
      //
      // // Подписываемся на изменения и получаем данные по J1708
      // await this.bleClient.startNotifications({ serviceUUID: j1708ServiceUUID, characteristicUUID: j1708CharacteristicUUID });
      //
      // this.bleClient.addListener('notifications', (notification) => {
      //   const value = notification.value;
      //   console.log('Получены данные J1708:', value);
      //   // Обработка полученных данных J1708
      // });

    } catch (error) {
      console.error('Ошибка Bluetooth:', error);
    }
  }
  parseData(value: DataView): number {
    const flags = value.getUint8(0);
    const rate16Bits = flags & 0x1;
    let heartRate: number;
    if (rate16Bits > 0) {
      heartRate = value.getUint16(1, true);
    } else {
      heartRate = value.getUint8(1);
    }
    return heartRate;
  }
}
