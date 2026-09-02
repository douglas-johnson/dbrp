import {CartForm, Image, Money} from '@shopify/hydrogen';
import type {
  CartLineUpdateInput,
  CartWarning,
} from '@shopify/hydrogen/storefront-api-types';
import {FetcherWithComponents, Link, useFetcher} from 'react-router';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useContext} from 'react';

import {useVariantUrl} from '~/lib/variants';
import Button from './button/Button';
import NavContext from '~/modules/nav-context';

type CartLine = CartApiQueryFragment['lines']['nodes'][0];

type CartMainProps = {
  cart: CartApiQueryFragment | null;
  layout: 'page' | 'aside';
};

export function CartMain({layout, cart}: CartMainProps) {
  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main ${withDiscount ? 'with-discount' : ''}`;

  return (
    <div className={className}>
      <CartEmpty hidden={linesCount} layout={layout} />
      <CartDetails cart={cart} layout={layout} />
    </div>
  );
}

function CartDetails({layout, cart}: CartMainProps) {
  const cartHasItems = !!cart && cart.totalQuantity > 0;

  return (
    <div className="cart-details rhythm">
      <CartLines lines={cart?.lines} layout={layout} />
      {cartHasItems && (
        <CartSummary cost={cart.cost} layout={layout}>
          <CartDiscounts discountCodes={cart.discountCodes} />
          <CartCheckoutActions checkoutUrl={cart.checkoutUrl} />
        </CartSummary>
      )}
    </div>
  );
}

function CartLines({
  lines,
  layout,
}: {
  layout: CartMainProps['layout'];
  lines: CartApiQueryFragment['lines'] | undefined;
}) {
  if (!lines) return null;

  return (
    <div aria-labelledby="cart-lines">
      <menu>
        {lines.nodes.map((line) => (
          <CartLineItem key={line.id} line={line} layout={layout} />
        ))}
      </menu>
    </div>
  );
}

function CartLineItem({
  layout,
  line,
}: {
  layout: CartMainProps['layout'];
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const useableNavContext = useContext(NavContext);
  return (
    <li key={id} className="cart-line">
      {image && (
        <div>
          <figure>
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={100}
              loading="lazy"
              width={100}
            />
          </figure>
        </div>
      )}

      <div>
        <p>
          <strong>
            <Link
              prefetch="intent"
              to={lineItemUrl}
              onClick={() => {
                // close the dialog.
                useableNavContext?.cart?.current?.close();
              }}
            >
              {product.title}{' '}
            </Link>
          </strong>
        </p>

        <CartLinePrice line={line} as="span" />
        {!onlyOptionIsDefault(selectedOptions) && (
          <ul>
            {selectedOptions.map((option) => (
              <li key={option.name}>
                <small>
                  {option.name}: {option.value}
                </small>
              </li>
            ))}
          </ul>
        )}

        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
    </div>
  );
}

function onlyOptionIsDefault(
  selectedOptions: CartLine['merchandise']['selectedOptions'],
): boolean {
  if (0 === selectedOptions.length) {
    return false;
  }

  // more than one option
  if (1 < selectedOptions.length) {
    return false;
  }

  return (
    'Title' === selectedOptions[0].name &&
    'Default Title' === selectedOptions[0].value
  );
}

export function CartSummary({
  cost,
  layout,
  children = null,
}: {
  children?: React.ReactNode;
  cost: CartApiQueryFragment['cost'];
  layout: CartMainProps['layout'];
}) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside rhythm';

  return (
    <div aria-labelledby="cart-summary" className={className}>
      <h4>Totals</h4>
      <dl className="cart-subtotal">
        <dt>Subtotal</dt>
        <dd>
          {cost?.subtotalAmount?.amount ? (
            <Money data={cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      {children}
    </div>
  );
}

function CartLineRemoveButton({lineIds}: {lineIds: string[]}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      {(fetcher: FetcherWithComponents<any>) => (
        <Button disabled={fetcher.state !== 'idle'} type="submit">
          Remove
        </Button>
      )}
    </CartForm>
  );
}

function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));
  const maxQuantity = line.merchandise.quantityAvailable;

  const increaseFetcher = useFetcher<{warnings?: CartWarning[]}>({
    key: `line-increase-${lineId}`,
  });
  const warning = increaseFetcher.data?.warnings?.[0];

  return (
    <>
      <div className="cart-line-quantity">
        <small>Quantity: {quantity} </small>
        <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
          {(fetcher: FetcherWithComponents<any>) => (
            <Button
              aria-label="Decrease quantity"
              disabled={quantity <= 1 || fetcher.state !== 'idle'}
              name="decrease-quantity"
              value={prevQuantity}
            >
              <span>&#8722; </span>
            </Button>
          )}
        </CartLineUpdateButton>

        <CartLineUpdateButton
          fetcherKey={`line-increase-${lineId}`}
          lines={[{id: lineId, quantity: nextQuantity}]}
        >
          {(fetcher: FetcherWithComponents<any>) => (
            <Button
              aria-label="Increase quantity"
              disabled={
                fetcher.state !== 'idle' ||
                (typeof maxQuantity === 'number' && nextQuantity > maxQuantity)
              }
              name="increase-quantity"
              value={nextQuantity}
            >
              <span>&#43;</span>
            </Button>
          )}
        </CartLineUpdateButton>

        <CartLineRemoveButton lineIds={[lineId]} />
      </div>
      {warning && (
        <small className="cart-line-warning" role="alert">
          {warning.message}
        </small>
      )}
    </>
  );
}

function CartLinePrice({
  line,
  priceType = 'regular',
  ...passthroughProps
}: {
  line: CartLine;
  priceType?: 'regular' | 'compareAt';
  [key: string]: any;
}) {
  if (!line?.cost?.amountPerQuantity || !line?.cost?.totalAmount) return null;

  const moneyV2 =
    priceType === 'regular'
      ? line.cost.totalAmount
      : line.cost.compareAtAmountPerQuantity;

  if (moneyV2 == null) {
    return null;
  }

  return (
    <div>
      <Money withoutTrailingZeros {...passthroughProps} data={moneyV2} />
    </div>
  );
}

export function CartEmpty({
  hidden = false,
  layout = 'aside',
}: {
  hidden: boolean;
  layout?: CartMainProps['layout'];
}) {
  return (
    <div hidden={hidden}>
      <br />
      <p>
        Looks like you haven&rsquo;t added anything yet, let&rsquo;s get you
        started!
      </p>
      <br />
      <Link
        to="/collections"
        onClick={() => {
          if (layout === 'aside') {
            window.location.href = '/collections';
          }
        }}
      >
        Continue shopping →
      </Link>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div>
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <Button>Remove</Button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div>
          <input type="text" name="discountCode" placeholder="Discount code" />
          &nbsp;
          <Button type="submit">Apply</Button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
  fetcherKey,
}: {
  children:
    | React.ReactNode
    | ((fetcher: FetcherWithComponents<any>) => React.ReactNode);
  lines: CartLineUpdateInput[];
  fetcherKey?: string;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
      fetcherKey={fetcherKey}
    >
      {children}
    </CartForm>
  );
}
