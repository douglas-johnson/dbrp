import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useLoaderData, type MetaFunction} from '@remix-run/react';
import loadEpisodes from '~/modules/episodes/loadEpisodes';


export const meta: MetaFunction = () => {
	return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({context}: LoaderFunctionArgs) => {

	const episodes = await loadEpisodes( context, 10 );

	return json( episodes );
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
