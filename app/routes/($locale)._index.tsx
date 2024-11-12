import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link, type MetaFunction} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';

import loadEpisodes from '~/modules/episodes/loadEpisodes';
import Episode from '~/components/Episode';

export const meta: MetaFunction = () => {
  return [{title: 'Dad Bod Rap Pod'}];
};

export async function loader({context}: LoaderFunctionArgs) {
	const {storefront} = context;
	const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
	const featuredCollection = collections.nodes[0];

	const episodes = loadEpisodes( context, 1 );

	return defer({featuredCollection, episodes});
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <>
		{/* <FeaturedCollection collection={data.featuredCollection} /> */}
		{/* <RecommendedProducts products={data.recommendedProducts} /> */}
		<h2>Patreon</h2>
		<p><a href="https://www.patreon.com/dadbodrappod">Join The Patreon</a></p>
		<h2>Spotify</h2>
		<p><a href="https://open.spotify.com/show/6jSzuDY9ex0aNKBUENWUfE">Listen on Spotify</a></p>
		<h2>Latest</h2>
		<Suspense fallback={<div>Loading latest episode</div>}>
			<Await resolve={data.episodes}>
				{(episodes) => ( <Episode episode={episodes[0]} />)}
			</Await>
		</Suspense>
		<h3>Blog Post</h3>
		<h3>Patreon Post</h3>
		<p><a href="https://www.patreon.com/dadbodrappod">Join to read</a></p>
    </>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;
