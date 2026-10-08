import {type Episode as EpisodeType} from '~/modules/episodes/types';
import Imgix from '../../components/Imgix';
import {Link} from 'react-router';
import Heading, {HeadingLevel} from '../../components/heading/Heading';
import {useMemo} from 'react';
import {getExcerpt} from '../text.utilities';
import {useRootLoaderData} from '~/lib/root-data';
import {Image} from '@shopify/hydrogen';

export default function EpisodePreview({
  episode,
  headingLevel = 3,
}: {
  episode: EpisodeType;
  headingLevel?: HeadingLevel;
}) {
  const excerpt = useMemo(() => getExcerpt(episode.summary), [episode.summary]);
  const {header} = useRootLoaderData();
  const defaultPodcastCoverImage =
    header.shop.defaultPodcastCoverImage?.reference?.image;
  const spotifyUrl = `https://open.spotify.com/episode/${episode.spotifyIdentifier}`;
  return (
    <article className="rhythm">
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
            <Image data={defaultPodcastCoverImage} width={448} height={448} />
          ) : null}
        </Link>
      </figure>
      <Heading
        headingLevel={headingLevel}
        style={{fontSize: 'var(--font-size-step-1)'}}
      >
        <Link to={spotifyUrl}>{episode.title}</Link>
      </Heading>
      <p style={{fontSize: 'var(--font-size-step-n-2)'}}>
        <time>{new Date(episode.pubdate).toLocaleDateString()}</time>
      </p>
      <p style={{fontSize: 'var(--font-size-step-n-1)'}}>{excerpt}</p>
    </article>
  );
}
