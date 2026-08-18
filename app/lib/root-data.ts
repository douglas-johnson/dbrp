import {useRouteLoaderData} from 'react-router';
import type {RootLoader} from '~/root';

/**
 * Access the result of the root loader from a React component.
 * The root loader always runs for rendered routes, so missing data is a bug.
 */
export function useRootLoaderData() {
  const data = useRouteLoaderData<RootLoader>('root');
  if (!data) {
    throw new Error('Root loader data is not available');
  }
  return data;
}
