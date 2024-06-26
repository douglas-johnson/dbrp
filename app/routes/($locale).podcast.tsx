import { defer, type LoaderFunctionArgs } from '@shopify/remix-oxygen';
import { Await, useLoaderData, type MetaFunction } from '@remix-run/react';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import { Suspense } from 'react';
import Episode from '~/components/Episode';

export const meta: MetaFunction = () => {
	return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({context}: LoaderFunctionArgs) => {
	return defer({
		episodes: loadEpisodes( context, 10 )
	});
};

export default function Podcast() {
	const { episodes } = useLoaderData<typeof loader>();
	return ( 
		<>
			<h1>Podcast</h1>
			<Suspense fallback={<div>Loading episodes</div>}>
				<Await resolve={episodes}>
					{(episodes) => episodes.map( episode => <Episode key={episode.id} episode={episode} />)}
				</Await>
			</Suspense>
		</>
	);
}
