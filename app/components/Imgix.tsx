interface ImgAttributes {
	sizes: string;
	src: string;
	width: number;
	height: number;
	alt: string;
}

export default function Imgix( { widths, attributes, shouldCrop } : {widths: number[], attributes: ImgAttributes, shouldCrop: boolean} ) {

	const {
		src,
		width,
		height
	} = attributes;

	const aspectRatio = shouldCrop ? ( width / height ) : 0;

	const srcset = widths.reduce(
		( acc: string[], w: number ) => {

			const nextSrc = new URL(src);	
			nextSrc.searchParams.set('w', w.toString())

			if ( shouldCrop ) {
				nextSrc.searchParams.set('h', ( Math.ceil( w / aspectRatio ) ).toString() )
			}

			return acc.concat([`${nextSrc} ${w}w`])
		},
		[]
	).join(', ');

	return (
		<img srcSet={srcset} {...attributes} />
	)
}
