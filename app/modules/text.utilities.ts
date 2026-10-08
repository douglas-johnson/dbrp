import sanitizeHtml from 'sanitize-html';
import anchorme from 'anchorme';
import {convert} from 'html-to-text';

const EXCERPT_STRING_LENGTH = 145;
const HTML_TO_TEXT_OPTIONS = {
  selectors: [{selector: 'a', options: {ignoreHref: true}}],
};

/**
 * Clean Post HTML
 * Sanitize HTML, create links from URLs, remove line breaks inside paragraphs.
 */
export function cleanPostHTML(html: string): string {
  return [
    (html: string) => sanitizeHtml(html),
    (html: string) => anchorme({input: html, options: {protocol: 'https://'}}),
    (html: string) => html.replaceAll(/<p><br\s?\/?><\/p>/g, ''),
  ].reduce((x, f) => f(x), html);
}

/**
 * Truncate Text
 * Truncate to the nearest word, append ellipsis when truncated.
 */
export function truncateText(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  if (str.lastIndexOf(' ') === -1) {
    return str.substring(0, maxLength) + '...';
  }

  if (str.lastIndexOf(' ', maxLength) === -1) {
    return str.substring(0, maxLength) + '...';
  }

  return str.substring(0, str.lastIndexOf(' ', maxLength)) + '...';
}

/**
 * Get Excerpt
 * Convert HTML to text, then truncate it to the nearest word.
 */
export function getExcerpt(content: string): string {
  return truncateText(
    convert(content, HTML_TO_TEXT_OPTIONS),
    EXCERPT_STRING_LENGTH,
  );
}
