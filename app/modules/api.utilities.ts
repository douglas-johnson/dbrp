/**
 * API Get URL
 */
export function apiGetUrl(base: string, limit: number, page: number): string {
  const url = new URL(base);

  url.searchParams.set('limit', limit.toString());
  url.searchParams.set('page', page.toString());

  return url.toString();
}

/**
 * API Get Next Page From Content Range
 *
 * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Range
 * @param {string|null} contentRange `Content-Range: items <range-start>-<range-end>/<size>`
 */
export function apiGetNextPageFromContentRange(
  contentRange: string | null,
): number {
  if (null === contentRange) {
    return 0;
  }

  const regex = new RegExp(/items (\d+)-(\d+)\/(\d+)/);
  const result = regex.exec(contentRange);

  if (null === result) {
    return 0;
  }

  const start = parseInt(result[1]);
  const end = parseInt(result[2]);
  const total = parseInt(result[3]);

  const limit = end - start;
  const page = Math.floor(end / limit) + 1;

  if (end >= total) {
    return 0;
  } else {
    return page;
  }
}
