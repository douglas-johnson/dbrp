import {Await, Link, useLoaderData} from 'react-router';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import {Suspense} from 'react';
import Episode from '~/components/Episode';
import type {Route} from './+types/($locale).podcast._index';

export const meta: Route.MetaFunction = () => {
  return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({context}: Route.LoaderArgs) => {
  return {
    data: await loadEpisodes(context),
  };
};

export default function Podcast() {
  const {data} = useLoaderData<typeof loader>();
  const {episodes} = data;
  return (
    <>
      <h1>Podcast</h1>
      {episodes.map((episode) => (
        <Episode key={episode.id} episode={episode} />
      ))}

      <p>
        <Link to={'/podcast/page/2/'}>More Episodes</Link>
      </p>
    </>
  );
}
