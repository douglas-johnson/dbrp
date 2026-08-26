export type buttonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button(props: buttonProps) {
  return <button {...props} />;
}
