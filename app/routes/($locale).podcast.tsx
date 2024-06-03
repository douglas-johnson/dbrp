import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';

export const meta: MetaFunction = () => {
	return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({request, context}: LoaderFunctionArgs) => {

	const {storefront, waitUntil} = context;

	const cacheKey = 'https://cms.megaphone.fm/api/networks/e9377628-5863-11ec-9c52-1fcb48d39b06/podcasts/faf889fe-5e84-11ea-9926-cbaa5546c1d7/episodes';

	// Check if there's a match for this key.
	let response = await storefront.cache.match(cacheKey);

	if (!response) {

		console.log( 'did not hit cache' );

	  // Since there's no match, fetch a fresh response.
	  response = await fetch(cacheKey,
		{
			headers: {
				'Authorization': `Token token="${context.env['megaphone-api-token']}"`
			}
		});
	  // Make the response mutable.
	  response = new Response(response.body, response);
	  // Add caching headers to the response.
	  response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=82800')
	  // Store the response in cache to be re-used the next time.
	  waitUntil(storefront.cache.put(cacheKey, response.clone()));
	}

	if ( ! response.ok ) {
		return json( [] );
	}

	const episodes = await response.json();

	const publishedEpisodes = episodes.filter(e => 'published' === e.status );

	return json( publishedEpisodes.slice(0, 10) );
};

export default function Podcast() {
	const episodes = useLoaderData<typeof loader>();

	return ( 
		<div className="blogs">
			<h1>Podcast</h1>
			{
				episodes.map( episode => {
					return ( <h2 key={episode.id}>{episode.title}</h2> )
				})
			}
		</div>
	)
	
}
