import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';

interface Episode {
	id: string;
	title: string;
	status: string;
}

export const meta: MetaFunction = () => {
	return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

const MEGAPHONE_API_EPISODES_URL = 'https://cms.megaphone.fm/api/networks/e9377628-5863-11ec-9c52-1fcb48d39b06/podcasts/faf889fe-5e84-11ea-9926-cbaa5546c1d7/episodes';

export const loader = async ({request, context}: LoaderFunctionArgs) => {

	const {storefront, withCache, env} = context;
	const cacheKey = [MEGAPHONE_API_EPISODES_URL];

	// The second parameter accepts custom cache options
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
