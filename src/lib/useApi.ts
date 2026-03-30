/**
 * useApi — provides API helpers pre-populated with the current Auth0 access token.
 *
 * Example:
 *   const { burgers } = useApi();
 *   const list = await burgers.list();
 */
import { useAuth0 } from '@auth0/auth0-react';
import { burgersApi, ingredientsApi, locationsApi, meApi, ordersApi } from './api';
import type { CreateOrderInput } from './api';

const AUDIENCE = import.meta.env.VITE_AUTH0_AUDIENCE ?? 'https://api.thegrid.io';

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const token = () => getAccessTokenSilently({ authorizationParams: { audience: AUDIENCE } });

  return {
    burgers: {
      list: async () => burgersApi.list(await token()),
      get: async (id: string) => burgersApi.get(await token(), id),
      create: async (burger: Parameters<typeof burgersApi.create>[1]) =>
        burgersApi.create(await token(), burger),
      update: async (id: string, changes: Parameters<typeof burgersApi.update>[2]) =>
        burgersApi.update(await token(), id, changes),
      remove: async (id: string) => burgersApi.remove(await token(), id),
    },
    ingredients: {
      list: async () => ingredientsApi.list(await token()),
    },
    locations: {
      list: async () => locationsApi.list(await token()),
    },
    orders: {
      list: async () => ordersApi.list(await token()),
      get: async (id: string) => ordersApi.get(await token(), id),
      create: async (input: CreateOrderInput) => ordersApi.create(await token(), input),
    },
    me: {
      get: async () => meApi.get(await token()),
    },
  };
}
