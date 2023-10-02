import { Component, OnInit } from '@angular/core';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
    private platform: Platform
  ) {}

  ngOnInit() {
    this.initialize()
  }

  async initialize() {
    // Check if location is enabled
    if (this.platform.is('android')) {
      const isLocationEnabled = await BleClient.isLocationEnabled();
      console.log(isLocationEnabled)
      if (!isLocationEnabled) {
        await BleClient.openLocationSettings();
      }
    }
    await BleClient.initialize({androidNeverForLocation: true});
  }

}
