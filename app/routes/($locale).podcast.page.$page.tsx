import {Await, Link, useLoaderData} from 'react-router';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import {Suspense} from 'react';
import Episode from '~/components/Episode';

import type {Route} from './+types/($locale).podcast.page.$page';

export const meta: Route.MetaFunction = () => {
  return [{title: `Latest Podcast Episodes | Dad Bod Rap Pod`}];
};

export const loader = async ({params, context}: Route.LoaderArgs) => {
  const page = parseInt(params?.page ?? '1');

  return {
    data: await loadEpisodes(context, 10, page),
  };
};

export default function Podcast() {
  const {
    data: {episodes, nextPage},
  } = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Podcast</h1>
      {episodes.map((episode) => (
        <Episode key={episode.id} episode={episode} />
      ))}
      {0 < nextPage && (
        <p>
          <Link to={`/podcast/page/${nextPage}/`}>More Episodes</Link>
        </p>
      )}
    </>
  );
}
