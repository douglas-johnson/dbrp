import { json, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, Link, useLoaderData, type MetaFunction } from '@remix-run/react';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import { Suspense } from 'react';
import Episode from '~/components/Episode';

export const meta: MetaFunction = () => {
	return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({context}: LoaderFunctionArgs) => {
	return json({
		data: await loadEpisodes( context )
	});
};

export default function Podcast() {
	const { data } = useLoaderData<typeof loader>();
	const { episodes } = data;
	return ( 
		<>
			<h1>Podcast</h1>
			{episodes.map( episode => <Episode key={episode.id} episode={episode} />)}
			
			<p><Link to={'/podcast/page/2/'}>More Episodes</Link></p>
		</>
	);
}
