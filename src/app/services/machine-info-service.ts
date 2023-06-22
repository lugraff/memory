import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MachineInfoService {
  private readonly regex_mobile = new RegExp(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/, 'i');
  public readonly isMobile = this.regex_mobile.test(window.navigator.userAgent);
  public readonly browser = this.getBrowserName();

  private getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
}
