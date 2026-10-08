import {type Post} from './types';
import type {RouterContextProvider} from 'react-router';
import {apiGetUrl, apiGetNextPageFromContentRange} from '../api.utilities';

/**
 * Load Posts
 */
export default async function loadPosts(
  context: Pick<RouterContextProvider, 'storefront' | 'withCache' | 'env'>,
  limit: number = 10,
  page: number = 1,
) {
  const {storefront, withCache, env} = context;

  const url = apiGetUrl(env['DBRP_API_GET_POSTS_URL'], limit, page);

  const cacheKey = [url];

  const {data, response} = await withCache.fetch<Post[]>(
    url,
    {},
    {
      cacheKey,
      cacheStrategy: storefront.CacheLong(),
      shouldCacheResponse: () => true,
    },
  );

  if (!response.ok) {
    return {
      nextPage: 0,
      posts: [],
    };
  }

  return {
    nextPage: apiGetNextPageFromContentRange(
      response.headers.get('content-range'),
    ),
    posts: data ?? [],
  };
}
