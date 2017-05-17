import { RealTimeCubingPage } from './app.po';

describe('real-time-cubing App', () => {
  let page: RealTimeCubingPage;

  beforeEach(() => {
    page = new RealTimeCubingPage();
  });

  it('displays the application title within the toolbar', () => {
    page.navigateTo();
    expect(page.getToolbarTitleText()).toEqual('Real Time Cubing');
  });
});
