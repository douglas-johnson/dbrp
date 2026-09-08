import {Await, Link, useLoaderData} from 'react-router';
import loadEpisodes from '~/modules/episodes/loadEpisodes';
import {Suspense} from 'react';
import Episode from '~/components/Episode';

import type {Route} from './+types/($locale).podcast.page.$page';
import Heading from '~/components/heading/Heading';

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
      <header className="has-wide-width">
        <Heading headingLevel={1} className="dbrp-page-title">
          Podcast
        </Heading>
      </header>
      {episodes.map((episode) => (
        <Episode key={episode.id} episode={episode} />
      ))}
      {0 < nextPage && (
        <p>
          <Link to={`/podcast/page/${nextPage}/`}>
            <strong>More Episodes</strong>
          </Link>
        </p>
      )}
    </>
  );
}
