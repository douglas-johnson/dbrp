export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  headingLevel?: HeadingLevel;
};

/**
 * Heading
 *
 * Component allowing heading level to be passed down through props.
 */
export default function Heading({
  headingLevel = 1,
  ...props
}: HeadingProps): React.ReactNode {
  const HeadingElement = `h${headingLevel}`;
  return <HeadingElement {...props} />;
}
