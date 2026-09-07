import {type Episode as EpisodeType} from '~/modules/episodes/types';
import Imgix from './Imgix';
import sanitizeHtml from 'sanitize-html';
import anchorme from 'anchorme';
import {Link} from 'react-router';
import Heading, {HeadingLevel} from './heading/Heading';

function cleanEpisodeSummaryHTML(html: string): string {
  return [
    (html: string) => sanitizeHtml(html),
    (html: string) => anchorme({input: html, options: {protocol: 'https://'}}),
    (html: string) => html.replaceAll(/<p><br\s?\/?><\/p>/g, ''),
  ].reduce((x, f) => f(x), html);
}

export default function Episode({
  episode,
  headingLevel = 2,
}: {
  episode: EpisodeType;
  headingLevel?: HeadingLevel;
}) {
  return (
    <article className="rhythm">
      <Heading headingLevel={headingLevel}>{episode.title}</Heading>
      {episode.imageFile ? (
        <figure>
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
        </figure>
      ) : null}
      <p>{episode.subtitle}</p>
      <p>
        <Link
          to={`https://open.spotify.com/episode/${episode.spotifyIdentifier}`}
        >
          Listen on Spotify
        </Link>
      </p>
      <div
        className="rhythm"
        dangerouslySetInnerHTML={{
          __html: cleanEpisodeSummaryHTML(episode.summary),
        }}
      ></div>
    </article>
  );
}
