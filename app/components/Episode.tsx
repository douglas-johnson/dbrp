import { type Episode as EpisodeType } from "~/modules/episodes/types"
import Imgix from "./Imgix"
import sanitizeHtml from 'sanitize-html';
import anchorme from "anchorme";
import { Link } from "@remix-run/react";

function cleanEpisodeSummaryHTML( html: string ): string {
	return [
		(html: string) => sanitizeHtml( html ),
		(html: string) => anchorme({ input: html, options: {protocol: 'https://'} }),
		(html: string) => html.replaceAll( /<p><br\s?\/?><\/p>/g, '' )
	].reduce(
		(x, f) => f(x),
		html
	)
}

export default function Episode( { episode }: { episode: EpisodeType } ) {
	return (
		<article className="rhythm">
			<h3>{episode.title}</h3>
			{episode.imageFile ? (
				<figure>
					<Imgix
						attributes={{
							src: episode.imageFile,
							width: 224,
							height: 224,
							sizes: '14em',
							alt: `Dad Bod Rap Pod episode art: ${episode.title}`
						}}
						widths={[224, 448, 672, 896]}
						shouldCrop={true}
					/>
				</figure>
			) : null}
			<p>{episode.subtitle}</p>
			<p><Link to={`https://open.spotify.com/episode/${episode.spotifyIdentifier}`}>Listen on Spotify</Link></p>
			<div className="rhythm" dangerouslySetInnerHTML={{__html: cleanEpisodeSummaryHTML( episode.summary )}}></div>
		</article>
	);
}
