describe("factory", () => {
  const app = require('../index');

  it("it returns an instance of vqrest", () => {
    const instance = app('some-mongodb-connection');
    expect(instance.create).toBeDefined();
    expect(instance.createModel).toBeDefined();
    expect(instance.app).toBeDefined();
  });
});
    