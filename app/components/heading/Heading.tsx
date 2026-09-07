export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> & {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

/**
 * Heading
 *
 * Component allowing heading level to be passed down through props.
 */
export default function Heading({
  level = 1,
  ...props
}: HeadingProps): React.ReactNode {
  const HeadingElement = `h${level}`;
  return <HeadingElement {...props} />;
}
