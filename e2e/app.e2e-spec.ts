import { RealTimeCubingPage } from './app.po';

describe('real-time-cubing App', () => {
  let page: RealTimeCubingPage;

  beforeEach(() => {
    page = new RealTimeCubingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
