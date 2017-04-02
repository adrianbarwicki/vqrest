describe("factory", () => {
  const app = require('../index');
  const instance = app('some-mongodb-connection');

  it("it returns an instance of vqrest", () => {
    expect(instance.utils).toBeDefined();
    expect(instance.factories).toBeDefined();
    expect(instance.create).toBeDefined();
    expect(instance.createModel).toBeDefined();
  });
});

describe("utils.updateObject", () => {
  const app = require('../index');
  const instance = app('some-mongodb-connection');

  it("works fine with arrays", () => {
    const obj = {};
    const data = { arr: [ { hello: 'world' } ]};

    instance.utils.updateObject(obj, data);

    expect(obj.arr).toBeDefined();
    expect(obj.arr.length).toBe(1);
    expect(obj.arr[0].hello).toBe('world');
  });
});
