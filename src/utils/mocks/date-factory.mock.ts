export interface IMockDate {}

export function mockDateFactory(date: string): IMockDate {
  class MockDate extends Date implements IMockDate {
    constructor() {
      super(date); // add whatever date you'll expect to get
    }
  }

  return MockDate;
}
