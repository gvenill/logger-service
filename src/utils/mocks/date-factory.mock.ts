export interface MockDate {}

export function mockDateFactory(date: string): MockDate {
  class MockDate extends Date implements MockDate {
    constructor() {
      super(date); // add whatever date you'll expect to get
    }
  }

  return MockDate;
}
