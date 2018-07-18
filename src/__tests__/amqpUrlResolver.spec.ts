import { resolveAmqpUrl } from './../amqp';

describe('Amqp Url resolver', () => {
  it('Must return valid url with host key', () => {
    const url = resolveAmqpUrl({
      host: 'amqp://localhost:5672',
    });

    expect(url).toBe('amqp://localhost:5672');
  });

  //TODO complete this feature
  // it('Must return valid url without amqp protocol', () => {
  //     const url = resolveAmqpUrl({
  //         host: 'localhost:5672',
  //     });

  //     expect(url).toBe('amqp://localhost:5672');
  // });

  it('Must return valid amqp url with amqp connection options', () => {
    const url = resolveAmqpUrl({
      host: 'localhost',
      port: 5672,
      ssl: true,
      username: 'guest',
      password: 'guest',
    });

    expect(url).toBe('amqps://guest:guest@localhost:5672');
  });

  it('Must return valid amqp url without password', () => {
    const url = resolveAmqpUrl({
      host: 'localhost',
      port: 5672,
      username: 'test',
    });

    expect(url).toBe('amqp://test@localhost:5672');
  });

  it('Must return null with invalid config', () => {
    const url = resolveAmqpUrl({
      host: undefined,
      username: undefined,
      password: undefined,
    });
    
    expect(url).toBe(null);
  });
});
