import {type Episode as EpisodeType} from '~/modules/episodes/types';
import Imgix from '../../components/Imgix';
import {Link} from 'react-router';
import Heading, {HeadingLevel} from '../../components/heading/Heading';
import {useRootLoaderData} from '~/lib/root-data';
import {Image} from '@shopify/hydrogen';
import {cleanPostHTML} from '../text.utilities';

export default function EpisodeFeature({
  episode,
  headingLevel = 3,
}: {
  episode: EpisodeType;
  headingLevel?: HeadingLevel;
}) {
  const {header} = useRootLoaderData();
  const defaultPodcastCoverImage =
    header.shop.defaultPodcastCoverImage?.reference?.image;
  const spotifyUrl = `https://open.spotify.com/episode/${episode.spotifyIdentifier}`;

  return (
    <article className="rhythm">
      <header className="dbrp-episode-feature-header">
        <div className="dbrp-episode-feature-header-start">
          <figure>
            <Link to={spotifyUrl}>
              {episode.imageFile ? (
                <Imgix
                  attributes={{
                    src: episode.imageFile,
                    width: 448,
                    height: 448,
                    sizes: '28em',
                    alt: `Dad Bod Rap Pod episode art: ${episode.title}`,
                  }}
                  widths={[224, 448, 672, 896]}
                  shouldCrop={true}
                />
              ) : defaultPodcastCoverImage ? (
                <Image
                  data={defaultPodcastCoverImage}
                  width={448}
                  height={448}
                />
              ) : null}
            </Link>
          </figure>
        </div>
        <div className="dbrp-episode-feature-header-end rhythm">
          <Heading
            headingLevel={headingLevel}
            style={{fontSize: 'var(--font-size-step-3)'}}
          >
            <Link to={spotifyUrl}>{episode.title}</Link>
          </Heading>
          <p style={{fontSize: 'var(--font-size-step-n-1)'}}>
            <time>{new Date(episode.pubdate).toLocaleDateString()}</time>
          </p>
          <p>
            <Link
              to={spotifyUrl}
              className="dbrp-spotify-button"
              aria-label="Listen on Spotify"
            >
              <svg width="48" height="48" viewBox="0 0 48 48" role="img">
                <polygon points="44,24 9.359,4 9.359,44"></polygon>
              </svg>
            </Link>
          </p>
        </div>
      </header>
      <div
        className="rhythm"
        dangerouslySetInnerHTML={{
          __html: cleanPostHTML(episode.summary),
        }}
      ></div>
      <p>
        <Link to={spotifyUrl}>Listen on Spotify</Link>
      </p>
    </article>
  );
}
