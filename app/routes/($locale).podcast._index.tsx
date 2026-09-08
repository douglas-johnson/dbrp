import {Await, Link, useLoaderData} from 'react-router';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import {Suspense} from 'react';
import Episode from '~/components/Episode';
import type {Route} from './+types/($locale).podcast._index';
import Heading from '~/components/heading/Heading';

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
      <header className="has-wide-width">
        <Heading headingLevel={1} className="dbrp-page-title">
          Podcast
        </Heading>
      </header>
      {episodes.map((episode) => (
        <Episode key={episode.id} episode={episode} />
      ))}
      <p>
        <Link to={'/podcast/page/2/'}>More Episodes</Link>
      </p>
    </>
  );
}
