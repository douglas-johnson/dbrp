import {Await, Link} from '@remix-run/react';
import React, {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

import {Image, Money} from '@shopify/hydrogen';

import type {
	// FeaturedCollectionFragment,
	RecommendedProductsQuery,
  } from 'storefrontapi.generated';

import { useRef, useContext } from 'react';
import Dialog from '~/components/Dialog';

import NavContext from '~/modules/nav-context';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  products: Promise<RecommendedProductsQuery>;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
  products
}: LayoutProps) {

	const menuRef = useRef<HTMLDialogElement | null>(null);
	const cartRef = useRef<HTMLDialogElement | null>(null);
	const searchRef = useRef<HTMLDialogElement | null>(null);

	const navContextValue = {
		menu: menuRef,
		cart: cartRef,
		search: searchRef
	}

  return (
	<NavContext.Provider value={navContextValue}>
    <div className="dbrp">
		<div className="dbrp-start">
			<main className="dbrp-main color-scheme color-scheme-light">
				<article className="has-root-padding rhythm">
					{children}
				</article>
			</main>
			{header && <Header header={header} cart={cart} isLoggedIn={isLoggedIn} />}
		</div>
		<div className="dbrp-end color-scheme color-scheme-dark">
			<RecommendedProducts products={products} />
			<Suspense>
				<Await resolve={footer}>
					{(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}
				</Await>
			</Suspense>
		</div>
		<CartAside cart={cart} />
		<SearchAside />
		<MobileMenuAside menu={header?.menu} shop={header?.shop} />
    </div>
	</NavContext.Provider>
  );
}

function RecommendedProducts({
	products,
  }: {
	products: Promise<RecommendedProductsQuery>;
  }) {
	return (
	  <div className="recommended-products">
		<Suspense fallback={<div>Loading...</div>}>
		  <Await resolve={products}>
			{({products}) => (
			  <div className="recommended-products-grid">
				{products.nodes.map((product) => (
					<article className="recommended-product" key={product.id}>
						<div className="recommended-product-start">
							<Link to={`/products/${product.handle}`}>
								<Image data={product.images.nodes[0]} sizes="(min-width: 45em) 20vw, 50vw" />
							</Link>
						</div>
						<div className="recommended-product-end">
							<h4><Link to={`/products/${product.handle}`}>{product.title}</Link></h4>
							<small><Money data={product.priceRange.minVariantPrice} /></small>
						</div>
					</article>
				))}
			  </div>
			)}
		  </Await>
		</Suspense>
	  </div>
	);
  }

function CartAside({cart}: {cart: LayoutProps['cart'] }) {
  
	const useableNavContext = useContext( NavContext );
	
	return (
    <Dialog ref={useableNavContext?.cart}>
      <Suspense fallback={<p>Loading cart ...</p>}>
        <Await resolve={cart}>
          {(cart) => {
            return <CartMain cart={cart} layout="aside" />;
          }}
        </Await>
      </Suspense>
    </Dialog>
  );
}

function SearchAside() {
	const useableNavContext = useContext( NavContext );
  return (
    <Dialog ref={useableNavContext?.search}>
      <div className="predictive-search">
        <PredictiveSearchForm>
          {({fetchResults, inputRef}) => (
            <div>
              <input
                name="q"
                onChange={fetchResults}
                onFocus={fetchResults}
                placeholder="Search"
                ref={inputRef}
                type="search"
              />
              &nbsp;
              <button
                onClick={() => {
                  window.location.href = inputRef?.current?.value
                    ? `/search?q=${inputRef.current.value}`
                    : `/search`;
                }}
              >
                Search
              </button>
            </div>
          )}
        </PredictiveSearchForm>
        <PredictiveSearchResults />
      </div>
    </Dialog>
  );
}

function MobileMenuAside({
  menu,
  shop
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
}) {
	const useableNavContext = useContext( NavContext );
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Dialog ref={useableNavContext?.menu}>
        <HeaderMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
        />
      </Dialog>
    )
  );
}
