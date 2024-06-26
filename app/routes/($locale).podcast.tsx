import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, type MetaFunction } from '@remix-run/react';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import { Suspense } from 'react';
import Episode from '~/components/Episode';

export const meta: MetaFunction = () => {
	return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({context}: LoaderFunctionArgs) => {
	return json({
		episodes: await loadEpisodes( context, 10 )
	});
};

export default function Podcast() {
	const { episodes } = useLoaderData<typeof loader>();
	return ( 
		<>
			<h1>Podcast</h1>
			{episodes.map( episode => <Episode key={episode.id} episode={episode} />)}
		</>
	);
}
