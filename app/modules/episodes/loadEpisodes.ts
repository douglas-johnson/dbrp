import { type Episode } from './types';
import { type AppLoadContext } from '@shopify/remix-oxygen';

export default async function loadEpisodes( context: AppLoadContext, limit: number = 10, page: number = 1 ) {

	const {storefront, withCache, env} = context;

	const url = getUrl( env['DBRP_API_URL_BASE'],  limit, page );

	const cacheKey = [url];

	return await withCache(cacheKey, storefront.CacheLong(), async () => {
		const response = await fetch(url);
		if (!response.ok) {
			return [];
		}

		const episodes = await response.json<Episode[]>();
		const nextPage = getNextPageFromContentRange( response.headers.get('content-range') );

		return {
			nextPage,
			episodes
		}
	});
}

function getUrl( base: string, limit: number, page: number ) : string {

	const url = new URL( base );

	url.searchParams.set( 'limit', limit.toString() );
	url.searchParams.set( 'page', page.toString() );
	
	return url.toString();
}

function getNextPageFromContentRange( contentRange: string|null ) : number {

	if ( null === contentRange ) {
		return 0;
	}

	const regex = new RegExp( /items (\d+)-(\d+)\/(\d+)/ );
	const result = regex.exec( contentRange );

	if ( null === result ) {
		return 0;
	}

	const start = parseInt( result[1] );
	const end = parseInt( result[2] );
	const total = parseInt( result[3] );

	const limit = end - start;
	const page = Math.floor( end / limit ) + 1;

	if ( end >= total ) {
		return 0;
	} else {
		return page;
	}
}
