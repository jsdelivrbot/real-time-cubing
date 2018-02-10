import { browser, by, element } from 'protractor';

export class RealTimeCubingPage {
  navigateTo() {
    return browser.get('/');
  }

  getToolbarTitleText() {
    return element(by.css('app-root mat-toolbar span')).getText();
  }
}
