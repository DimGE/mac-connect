import {Component, OnInit} from '@angular/core';
import {BleClient} from '@capacitor-community/bluetooth-le';
import { BluetoothLe } from '@capacitor-community/bluetooth-le';

import {Platform} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  client: any
  status:any = false
  bleClient = BleClient;

  readonly goProControlAndQueryServiceUUID =
    '0000fea6-0000-1000-8000-00805f9b34fb'.toUpperCase();

  readonly goProWifiAccessPointServiceUUID =
    `b5f90001-aa8d-11e3-9046-0002a5d5c51b`.toUpperCase();

  readonly goProCommandReqCharacteristicsUUID =
    'b5f90072-aa8d-11e3-9046-0002a5d5c51b'.toUpperCase();

  readonly goProWifiSSIDCharacteristicUUID =
    `b5f90002-aa8d-11e3-9046-0002a5d5c51b`.toUpperCase();

  readonly goProWifiPASSCharacteristicUUID =
    `b5f90003-aa8d-11e3-9046-0002a5d5c51b`.toUpperCase();
  constructor(
    private platform: Platform
  ) {
  }

  ngOnInit() {
    this.initialize()
  }

  async initialize() {
    // Check if location is enabled
    if (this.platform.is('android')) {
      const isLocationEnabled = await this.bleClient.isLocationEnabled();
      this.status =  isLocationEnabled
      console.log(isLocationEnabled)
      if (!isLocationEnabled) {
        await this.bleClient.openLocationSettings();
      }
      this.status =  isLocationEnabled
    }
    await this.bleClient.initialize({androidNeverForLocation: true});

  }

  // async connect():void {
  //   //   address: '98:35:14:32:12'
  //   // }
  //   // await BleClient.connect('sa')
  //   //   .then(res=>{
  //   //     console.log(res)
  //   //   })
  // }

   async connect() {
    try {
      // Инициализация Bluetooth LE клиента

      // Сканирование устройств
      await this.bleClient.requestLEScan({ services:['0000180d-0000-1000-8000-00805f9b34fb',this.goProControlAndQueryServiceUUID, this.goProWifiAccessPointServiceUUID]},this.onBluetoothDeviceFound.bind(this))


      // Поиск устройства по MAC-адресу
      // const device = scanResult.devices.find(device => device.address === macAddress);

      // if (device) {
      //   // Подключение к устройству
      //   await bleClient.connect(device.deviceId);
      //
      //   console.log('Успешно подключено к устройству по MAC-адресу:', macAddress);
      //
      //   // Здесь вы можете выполнять другие операции с подключенным устройством, такие как чтение и запись характеристик и т.д.
      //
      // } else {
      //   console.log('Устройство с MAC-адресом', macAddress, 'не найдено.');
      // }
    //
    } catch (error) {
      console.error('Ошибка подключения к устройству:', error);
    }
  }

  onBluetoothDeviceFound(result:any) {
    console.log('received new scan result', result);
    // this.bluetoothScanResults.push(result);
  }
}
