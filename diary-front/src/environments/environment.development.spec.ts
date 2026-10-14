import { environment } from './environment.development';

describe('environment.development', () => {
  it('should expose the API URL used by the app', () => {
    expect(environment.apiUrl).toBe('http://localhost:3000/api');
  });
});
