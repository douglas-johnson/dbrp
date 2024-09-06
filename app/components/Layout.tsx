import {Await} from '@remix-run/react';
import React, {Suspense} from 'react';
import type {
  CartApiQueryFragment,
  FooterQuery,
  HeaderQuery,
} from 'storefrontapi.generated';
import {Aside} from '~/components/Aside';
import {Footer} from '~/components/Footer';
import {Header, HeaderMenu} from '~/components/Header';
import {CartMain} from '~/components/Cart';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';

import { useRef } from 'react';
import Dialog from '~/components/Dialog';

export type LayoutProps = {
  cart: Promise<CartApiQueryFragment | null>;
  children?: React.ReactNode;
  footer: Promise<FooterQuery>;
  header: HeaderQuery;
  isLoggedIn: Promise<boolean>;
  menuRef: React.MutableRefObject<null>;
  cartRef: React.MutableRefObject<null>;
  searchRef: React.MutableRefObject<null>;
};

export function Layout({
  cart,
  children = null,
  footer,
  header,
  isLoggedIn,
}: LayoutProps) {

	// const dialogRef = useRef(null);

	const menuRef = useRef(null);
	const cartRef = useRef(null);
	const searchRef = useRef(null);

  return (
    <>
      <CartAside cart={cart} cartRef={cartRef} />
      <SearchAside searchRef={searchRef} />
      <MobileMenuAside menu={header?.menu} shop={header?.shop} menuRef={menuRef} />
      {header && <Header header={header} menuRef={menuRef} cartRef={cartRef} cart={cart} searchRef={searchRef} isLoggedIn={isLoggedIn} />}
      <main>{children}</main>
      <Suspense>
        <Await resolve={footer}>
          {(footer) => <Footer menu={footer?.menu} shop={header?.shop} />}
        </Await>
      </Suspense>
    </>
  );
}

function CartAside({cart, cartRef}: {cart: LayoutProps['cart'], cartRef: React.MutableRefObject<null>}) {
  return (
    <Dialog ref={cartRef}>
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

function SearchAside( {searchRef}: {searchRef: React.MutableRefObject<null>}) {
  return (
    <Dialog ref={searchRef}>
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
  shop,
  menuRef
}: {
  menu: HeaderQuery['menu'];
  shop: HeaderQuery['shop'];
  menuRef: React.MutableRefObject<null>;
}) {
  return (
    menu &&
    shop?.primaryDomain?.url && (
      <Dialog ref={menuRef}>
        <HeaderMenu
          menu={menu}
          viewport="mobile"
          primaryDomainUrl={shop.primaryDomain.url}
		  menuRef={menuRef}
        />
      </Dialog>
    )
  );
}
