import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import type {Route} from './+types/($locale)._index';

import loadPosts from '~/modules/posts/loadPosts';
import PostPreview from '~/modules/posts/PostPreview.component';

import loadEpisodes from '~/modules/episodes/loadEpisodes';
import EpisodePreview from '~/modules/episodes/EpisodePreview.component';
import EpisodeFeature from '~/modules/episodes/EpisodeFeature.component';

import Heading from '~/components/heading/Heading';
// import '~/modules/episodes/reel.css';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Dad Bod Rap Pod'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const episodeData = loadEpisodes(context, 6);
  const postsData = loadPosts(context, 6);
  return {
    episodeData,
    postsData,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
      <header className="has-wide-width">
        <Heading headingLevel={1} className="dbrp-page-title">
          DBRP
        </Heading>
      </header>
      <menu>
        <li>
          <a href="https://www.patreon.com/dadbodrappod">Join The Patreon</a>
        </li>
        <li>
          <a href="https://open.spotify.com/show/6jSzuDY9ex0aNKBUENWUfE">
            Listen on Spotify
          </a>
        </li>
        <li>
          <a href="https://feeds.megaphone.fm/dadbodrappod">RSS Feed</a>
        </li>
      </menu>
      <h2>Latest Episode</h2>
      <Suspense fallback={<div>Loading episodes</div>}>
        <Await resolve={data.episodeData}>
          {({episodes}) => {
            const episode = episodes[0];
            return <EpisodeFeature episode={episode} headingLevel={3} />;
          }}
        </Await>
      </Suspense>
      <h2>News</h2>
      <Suspense fallback={<div>Loading latest posts</div>}>
        <Await resolve={data.postsData}>
          {({posts}) => (
            <div className="dbrp-reel-outer has-full-width">
              <ul
                className="dbrp-reel"
                style={
                  {'--dbrp-reel-item-width': '15em'} as React.CSSProperties
                }
              >
                {posts.map((post) => {
                  return (
                    <li className="dbrp-reel-item" key={post.id}>
                      <PostPreview
                        TagName="article"
                        headingLevel={3}
                        post={post}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </Await>
      </Suspense>
      <h2>More Episodes</h2>
      <Suspense fallback={<div>Loading episodes</div>}>
        <Await resolve={data.episodeData}>
          {({episodes}) => (
            <>
              <div className="dbrp-reel-outer has-full-width">
                <ul className="dbrp-reel">
                  {episodes.slice(1).map((episode) => (
                    <li className="dbrp-reel-item" key={episode.id}>
                      <EpisodePreview episode={episode} headingLevel={3} />
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <Link to={'/podcast/'}>
                  <strong>All Episodes</strong>
                </Link>
              </p>
            </>
          )}
        </Await>
      </Suspense>
    </>
  );
}
