import type {EntryContext} from '@shopify/remix-oxygen';
import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy(
	{
		// allow images served by megaphone via imgix.
		imgSrc: [
			"'self'",
			'megaphone.imgix.net',
			'cdn.shopify.com',
			'data:'
		],

		scriptSrc: [
			"'self'",
			"https://cdn.shopify.com",
			"https://shopify.com",
			"http://localhost:*",
			"https://api.preproduct.io",
		],
		connectSrc: [
			"'self'",
			"https://monorail-edge.shopifysvc.com",
			"http://localhost:*",
			"ws://localhost:*",
			"ws://127.0.0.1:*",
			"ws://*.tryhydrogen.dev:*",
			"https://api.preproduct.io",
			"https://d5f805-67.myshopify.com"
		],
		scriptSrcAttr: [
			"'unsafe-inline'"
		]


	}
  );

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', header);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
