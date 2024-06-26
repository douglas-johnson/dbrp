import { type Episode as EpisodeType } from "~/modules/episodes/types"
import Imgix from "./Imgix"
import sanitizeHtml from 'sanitize-html';

function cleanEpisodeSummaryHTML( html: string ): string {
	return [
		(html: string) => sanitizeHtml( html ),
		(html: string) => html.replaceAll( /<p><br\s?\/?><\/p>/g, '' )
	].reduce(
		(x, f) => f(x),
		html
	)
}

export default function Episode( { episode }: { episode: EpisodeType } ) {
	return (
		<article>
			<h2>{episode.title}</h2>
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
			<div dangerouslySetInnerHTML={{__html: cleanEpisodeSummaryHTML( episode.summary )}}></div>
		</article>
	);
}
