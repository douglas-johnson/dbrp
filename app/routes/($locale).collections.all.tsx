import {useLoaderData, Link} from 'react-router';
import {
  Pagination,
  getPaginationVariables,
  Image,
  Money,
} from '@shopify/hydrogen';
import type {ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import type {Route} from './+types/($locale).collections.all';

import Heading from '~/components/heading/Heading';

export const meta: Route.MetaFunction = () => {
  return [{title: `Dad Bod Rap Pod | Products`}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const {products} = await storefront.query(CATALOG_QUERY, {
    variables: {...paginationVariables},
  });

  return {products};
}

export default function Collection() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <div className="collection rhythm">
      <Heading>Products</Heading>
      <Pagination connection={products}>
        {({
          nodes,
          isLoading,
          PreviousLink,
          NextLink,
          hasPreviousPage,
          hasNextPage,
        }) => (
          <>
            {hasPreviousPage && (
              <div style={{textAlign: 'center'}}>
                <PreviousLink>
                  {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
                </PreviousLink>
              </div>
            )}
            <ProductsGrid products={nodes} />
            {hasNextPage && (
              <div style={{textAlign: 'center'}}>
                <NextLink>
                  {isLoading ? 'Loading...' : <span>Load more ↓</span>}
                </NextLink>
              </div>
            )}
          </>
        )}
      </Pagination>
    </div>
  );
}

function ProductsGrid({products}: {products: ProductItemFragment[]}) {
  return (
    <div className="products-grid">
      {products.map((product, index) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        );
      })}
    </div>
  );
}

function ProductItem({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);
  return (
    <article className="products-grid-item">
      {product.featuredImage && (
        <Link prefetch="intent" to={variantUrl}>
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/1"
            data={product.featuredImage}
            loading={loading}
            sizes="(max-width: 32em) 92.5vw, 32em"
          />
        </Link>
      )}
      <Heading level={2} style={{fontSize: 'var(--font-size-step-3)'}}>
        <Link prefetch="intent" to={variantUrl}>
          {product.title}
        </Link>
      </Heading>
      <p>
        <Money data={product.priceRange.minVariantPrice} />
      </p>
    </article>
  );
}

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    priceRange {
      minVariantPrice {
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
` as const;

// NOTE: https://shopify.dev/docs/api/storefront/2024-01/objects/product
const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor, sortKey: CREATED_AT, reverse: true) {
      nodes {
        ...ProductItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${PRODUCT_ITEM_FRAGMENT}
` as const;
