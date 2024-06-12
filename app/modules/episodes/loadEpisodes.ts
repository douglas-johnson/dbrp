import { type Episode } from './types';
import { MEGAPHONE_API_EPISODES_URL } from './api';
import { type AppLoadContext } from '@shopify/remix-oxygen';

export default async function loadEpisodes( context: AppLoadContext, count: number ) {

	const {storefront, withCache, env} = context;
	const cacheKey = [MEGAPHONE_API_EPISODES_URL];

	const episodes: Episode[] = await withCache(cacheKey, storefront.CacheLong(), async () => {
		const response = await fetch(MEGAPHONE_API_EPISODES_URL, {
			headers: {
				'Authorization': `Token token="${env['megaphone-api-token']}"`
			}
		});
		if (!response.ok) {
			return [];
		}
		return await response.json<Episode[]>()
	});

	return episodes.filter(e => 'published' === e.status).slice( 0, count );
}

