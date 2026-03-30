import { describe, test, expect, vi, beforeEach } from 'vitest';
import { burgersApi, ingredientsApi, locationsApi, ordersApi, meApi } from '../api';

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

function mockResponse(body: unknown, status = 200) {
  fetchMock.mockResolvedValueOnce({
    ok: status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

describe('api — burgersApi', () => {
  beforeEach(() => fetchMock.mockClear());

  test('list calls GET /v1/burgers with auth header', async () => {
    mockResponse([{ id: 'b1', name: 'Classic' }]);
    const result = await burgersApi.list('test-token');
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/v1/burgers'),
      expect.objectContaining({ headers: expect.objectContaining({ Authorization: 'Bearer test-token' }) }),
    );
    expect(Array.isArray(result)).toBe(true);
  });

  test('get calls GET /v1/burgers/:id', async () => {
    mockResponse({ id: 'b1', name: 'Classic' });
    await burgersApi.get('tok', 'b1');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v1/burgers/b1'), expect.anything());
  });

  test('create calls POST /v1/burgers with body', async () => {
    mockResponse({ id: 'b2' });
    await burgersApi.create('tok', { name: 'X', description: 'Y', price_cents: 999, available: true });
    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body)).toMatchObject({ name: 'X' });
  });

  test('update calls PUT /v1/burgers/:id', async () => {
    mockResponse({ id: 'b1' });
    await burgersApi.update('tok', 'b1', { name: 'Updated' });
    const [url, opts] = fetchMock.mock.calls[0];
    expect(opts.method).toBe('PUT');
    expect(url).toContain('/v1/burgers/b1');
  });

  test('remove calls DELETE /v1/burgers/:id', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, status: 204, json: () => Promise.resolve(undefined) });
    await burgersApi.remove('tok', 'b1');
    const [url, opts] = fetchMock.mock.calls[0];
    expect(opts.method).toBe('DELETE');
    expect(url).toContain('/v1/burgers/b1');
  });

  test('throws ApiError on non-2xx response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'not_found' }),
    });
    await expect(burgersApi.get('tok', 'bad')).rejects.toThrow();
  });
});

describe('api — ingredientsApi', () => {
  beforeEach(() => fetchMock.mockClear());

  test('list calls GET /v1/ingredients', async () => {
    mockResponse([]);
    await ingredientsApi.list('tok');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v1/ingredients'), expect.anything());
  });
});

describe('api — locationsApi', () => {
  beforeEach(() => fetchMock.mockClear());

  test('list calls GET /v1/locations', async () => {
    mockResponse([]);
    await locationsApi.list('tok');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v1/locations'), expect.anything());
  });
});

describe('api — ordersApi', () => {
  beforeEach(() => fetchMock.mockClear());

  test('list calls GET /v1/orders', async () => {
    mockResponse([]);
    await ordersApi.list('tok');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v1/orders'), expect.anything());
  });

  test('create calls POST /v1/orders', async () => {
    mockResponse({ id: 'o1', total_cents: 999, status: 'pending' });
    await ordersApi.create('tok', { delivery_address: '1 Main', items: [] });
    const [, opts] = fetchMock.mock.calls[0];
    expect(opts.method).toBe('POST');
  });

  test('create returns client_secret if present', async () => {
    mockResponse({ id: 'o1', total_cents: 999, status: 'pending', client_secret: 'pi_secret' });
    const result = await ordersApi.create('tok', { delivery_address: '1 Main', items: [] });
    expect((result as any).client_secret).toBe('pi_secret');
  });
});

describe('api — meApi', () => {
  beforeEach(() => fetchMock.mockClear());

  test('get calls GET /v1/me', async () => {
    mockResponse({ id: 'u1', email: 'a@b.com', name: 'Alice', role: 'customer' });
    await meApi.get('tok');
    expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('/v1/me'), expect.anything());
  });
});
