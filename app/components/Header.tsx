import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import type {HeaderQuery} from 'storefrontapi.generated';
import type {LayoutProps} from './Layout';
import {useRootLoaderData} from '~/lib/root-data';

type HeaderProps = Pick<LayoutProps, 'header' | 'cart' | 'isLoggedIn' | 'cartRef' | 'searchRef' | 'menuRef'>;

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart, cartRef, searchRef, menuRef}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="header">
		<NavLink prefetch="intent" to="/" end>
			<strong>{shop.name}</strong>
		</NavLink>
		<HeaderCtas
			isLoggedIn={isLoggedIn}
			cart={cart}
			cartRef={cartRef}
			searchRef={searchRef}
			menuRef={menuRef}
		/>
    </header>
  );
}

const FALLBACK_HEADER_MENU = {
	id: 'gid://shopify/Menu/199655587896',
	items: [
	  {
		id: 'gid://shopify/MenuItem/461609500728',
		resourceId: null,
		tags: [],
		title: 'Collections',
		type: 'HTTP',
		url: '/collections',
		items: [],
	  },
	  {
		id: 'gid://shopify/MenuItem/461609533496',
		resourceId: null,
		tags: [],
		title: 'Blog',
		type: 'HTTP',
		url: '/blogs/journal',
		items: [],
	  },
	  {
		id: 'gid://shopify/MenuItem/461609566264',
		resourceId: null,
		tags: [],
		title: 'Policies',
		type: 'HTTP',
		url: '/policies',
		items: [],
	  },
	  {
		id: 'gid://shopify/MenuItem/461609599032',
		resourceId: 'gid://shopify/Page/92591030328',
		tags: [],
		title: 'About',
		type: 'PAGE',
		url: '/pages/about',
		items: [],
	  },
	],
  };

export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  menuRef
}: {
  menu: HeaderProps['header']['menu'];
  primaryDomainUrl: HeaderQuery['shop']['primaryDomain']['url'];
  viewport: Viewport;
  menuRef: React.MutableRefObject<HTMLDialogElement|null>;
}) {
  const {publicStoreDomain} = useRootLoaderData();
  const className = `header-menu-${viewport}`;

  return (
    <nav className={className} role="navigation">
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className="header-menu-item"
            end
            key={item.id}
            prefetch="intent"
            to={url}
			onClick={() => menuRef.current?.close()}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

function HeaderCtas({
  isLoggedIn,
  cart,
  cartRef,
  searchRef,
  menuRef
}: Pick<HeaderProps, 'isLoggedIn' | 'cart' | 'cartRef' | 'searchRef' | 'menuRef'>) {
  return (
    <nav className="header-ctas" role="navigation">
      <HeaderMenuMobileToggle menuRef={menuRef} />
      <NavLink prefetch="intent" to="/account">
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense>
      </NavLink>
      <SearchToggle searchRef={searchRef} />
      <CartToggle cart={cart} cartRef={cartRef} />
    </nav>
  );
}

function HeaderMenuMobileToggle({menuRef}: {menuRef: React.MutableRefObject<HTMLDialogElement|null>}) {
	return <button type="button" onClick={() => menuRef.current?.showModal()}>☰ Menu</button>
// replace shopify / hydrogen version
// 	return (
	
//     <a className="header-menu-mobile-toggle" href="#mobile-menu-aside">
//       <h3>☰</h3>
//     </a>
//   );
}

function SearchToggle({searchRef}: {searchRef: React.MutableRefObject<HTMLDialogElement|null>}) {
	return <button type="button" onClick={() => searchRef.current?.showModal()}>Search</button>
	// replaced shopify / hydrogen version
	// return <a href="#search-aside">Search</a>;
}

function CartBadge({count, cartRef}: {count: number, cartRef: React.MutableRefObject<HTMLDialogElement|null>}) {
  return <button type="button" onClick={() => cartRef.current?.showModal()}>Cart {count}</button>
  // replace shopify / hydrogen version
  // return <a href="#cart-aside">Cart {count}</a>;
}

function CartToggle({cart, cartRef}: Pick<HeaderProps, 'cart' | 'cartRef'>) {
  return (
    <Suspense fallback={<CartBadge cartRef={cartRef} count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge cartRef={cartRef} count={0} />;
          return <CartBadge cartRef={cartRef} count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}
