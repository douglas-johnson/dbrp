import {useRootLoaderData} from '~/lib/root-data';
import type {Maybe} from '@shopify/hydrogen/storefront-api-types';

export const DEFAULT_LOW_STOCK_THRESHOLD = 4;

/**
 * Low Stock Message
 * Uses shop-level meta data low_stock_threshold.
 */
export default function LowStockMessage({
  quantityAvailable,
}: {
  quantityAvailable: Maybe<number> | undefined;
}) {
  const {header} = useRootLoaderData();
  const lowStockThreshold = Number(
    header.shop.lowStockThreshold?.value ?? DEFAULT_LOW_STOCK_THRESHOLD,
  );
  if ('number' !== typeof quantityAvailable || 0 >= quantityAvailable) {
    return null;
  }
  if (lowStockThreshold < quantityAvailable) {
    return null;
  }
  return (
    <p className="low-stock-message">Only {quantityAvailable} left in stock.</p>
  );
}
