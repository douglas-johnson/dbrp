import {Await, NavLink} from '@remix-run/react';
import {Suspense} from 'react';
import {useRootLoaderData} from '~/lib/root-data';
import type {
	CartApiQueryFragment,
	HeaderQuery,
  } from 'storefrontapi.generated';

type HeaderProps =  {
	cart: Promise<CartApiQueryFragment | null>;
	header: HeaderQuery;
	isLoggedIn: Promise<boolean>;
	menuRef: React.MutableRefObject<HTMLDialogElement|null>;
	cartRef: React.MutableRefObject<HTMLDialogElement|null>;
	searchRef: React.MutableRefObject<HTMLDialogElement|null>;
};

type Viewport = 'desktop' | 'mobile';

export function Header({header, isLoggedIn, cart, cartRef, searchRef, menuRef}: HeaderProps) {
  const {shop, menu} = header;
  return (
    <header className="dbrp-header">
		<nav className="dbrp-nav">
			<div>
				<HeaderMenuMobileToggle menuRef={menuRef} />
			</div>
			<div className="dbrp-logo-container">
				<p className="dbrp-logo">
					<NavLink className="text-decoration-line-none" prefetch="intent" to="/" end>
						{shop.name}
					</NavLink>
				</p>
			</div>
			<div>
			<HeaderCtas
				isLoggedIn={isLoggedIn}
				cart={cart}
				cartRef={cartRef}
				searchRef={searchRef}
				menuRef={menuRef}
			/>
			</div>
		</nav>
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
	<menu className="dbrp-nav-menu">
		<li><SearchToggle searchRef={searchRef} /></li>
		<li> <NavLink prefetch="intent" to="/account">
	  	<svg className="size-square-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
			<path d="M5.85,17.1c.85-.65,1.8-1.16,2.85-1.54s2.15-.56,3.3-.56,2.25.19,3.3.56,2,.89,2.85,1.54c.58-.68,1.04-1.46,1.36-2.33s.49-1.79.49-2.78c0-2.22-.78-4.1-2.34-5.66s-3.45-2.34-5.66-2.34-4.1.78-5.66,2.34c-1.56,1.56-2.34,3.45-2.34,5.66,0,.98.16,1.91.49,2.78s.78,1.64,1.36,2.33ZM12,13c-.98,0-1.81-.34-2.49-1.01s-1.01-1.5-1.01-2.49.34-1.81,1.01-2.49,1.5-1.01,2.49-1.01,1.81.34,2.49,1.01,1.01,1.5,1.01,2.49-.34,1.81-1.01,2.49-1.5,1.01-2.49,1.01ZM12,22c-1.38,0-2.68-.26-3.9-.79s-2.28-1.24-3.18-2.14-1.61-1.96-2.14-3.18-.79-2.52-.79-3.9.26-2.68.79-3.9,1.24-2.28,2.14-3.18,1.96-1.61,3.18-2.14,2.52-.79,3.9-.79,2.68.26,3.9.79,2.28,1.24,3.18,2.14,1.61,1.96,2.14,3.18.79,2.52.79,3.9-.26,2.68-.79,3.9-1.24,2.28-2.14,3.18-1.96,1.61-3.18,2.14-2.52.79-3.9.79ZM12,20c.88,0,1.72-.13,2.5-.39s1.5-.63,2.15-1.11c-.65-.48-1.37-.85-2.15-1.11-.78-.26-1.62-.39-2.5-.39s-1.72.13-2.5.39c-.78.26-1.5.63-2.15,1.11.65.48,1.37.85,2.15,1.11s1.62.39,2.5.39ZM12,11c.43,0,.79-.14,1.08-.43.28-.28.43-.64.43-1.08s-.14-.79-.43-1.08c-.28-.28-.64-.43-1.08-.43s-.79.14-1.08.43-.43.64-.43,1.08.14.79.43,1.08.64.43,1.08.43Z"/>
		</svg>
        {/* <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')}
          </Await>
        </Suspense> */}
      </NavLink></li>
		<li><CartToggle cart={cart} cartRef={cartRef} /></li>
	</menu>
  );
}

function HeaderMenuMobileToggle({menuRef}: {menuRef: React.MutableRefObject<HTMLDialogElement|null>}) {
	return <button type="button" className="button is-transparent" onClick={() => menuRef.current?.showModal()}>
		<svg className="size-square-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
			<path d="M3,18v-2h18v2H3ZM3,13v-2h18v2H3ZM3,8v-2h18v2H3Z"/>
		</svg>
	</button>
}

function SearchToggle({searchRef}: {searchRef: React.MutableRefObject<HTMLDialogElement|null>}) {
	return <button type="button" className="button is-transparent" onClick={() => searchRef.current?.showModal()}>
		<svg className="size-square-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M19.6,21l-6.3-6.3c-.5.4-1.08.72-1.73.95s-1.34.35-2.08.35c-1.82,0-3.35-.63-4.61-1.89s-1.89-2.8-1.89-4.61.63-3.35,1.89-4.61,2.8-1.89,4.61-1.89,3.35.63,4.61,1.89,1.89,2.8,1.89,4.61c0,.73-.12,1.43-.35,2.08s-.55,1.23-.95,1.73l6.3,6.3-1.4,1.4ZM9.5,14c1.25,0,2.31-.44,3.19-1.31s1.31-1.94,1.31-3.19-.44-2.31-1.31-3.19-1.94-1.31-3.19-1.31-2.31.44-3.19,1.31-1.31,1.94-1.31,3.19.44,2.31,1.31,3.19,1.94,1.31,3.19,1.31Z"/></svg>
	</button>
}

function CartBadge({count, cartRef}: {count: number, cartRef: React.MutableRefObject<HTMLDialogElement|null>}) {
 // {count} 
 
 return <button type="button" className="button is-transparent" onClick={() => cartRef.current?.showModal()}>
	<svg className="size-square-1" xmlns="http://www.w3.org/2000/svg" viewBox="1 0 24 24" width="24" height="24"><path d="M8.01,22c-.55,0-1.02-.2-1.41-.59s-.59-.86-.59-1.41.2-1.02.59-1.41.86-.59,1.41-.59,1.02.2,1.41.59.59.86.59,1.41-.2,1.02-.59,1.41-.86.59-1.41.59ZM18.01,22c-.55,0-1.02-.2-1.41-.59s-.59-.86-.59-1.41.2-1.02.59-1.41.86-.59,1.41-.59,1.02.2,1.41.59.59.86.59,1.41-.2,1.02-.59,1.41-.86.59-1.41.59ZM7.16,6l2.4,5h7l2.75-5H7.16ZM6.21,4h14.75c.38,0,.68.17.88.51s.21.69.03,1.04l-3.55,6.4c-.18.33-.43.59-.74.78s-.65.28-1.01.28h-7.45l-1.1,2h12v2h-12c-.75,0-1.32-.33-1.7-.99s-.4-1.31-.05-1.96l1.35-2.45-3.6-7.6h-2V2h3.25l.95,2ZM9.56,11h7-7Z"/></svg></button>
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
