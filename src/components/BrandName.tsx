/**
 * Text wordmark for "mi-या-bi" — used where a logo image would be overkill
 * (footer copyright, headings, etc.). Styled to echo the logo: italic,
 * black "mi" / red "या-bi" with a Devanagari-capable font.
 */
export default function BrandName({
  className = "",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span className={`wordmark ${className}`}>
      <span className={invert ? "text-white" : "text-ink"}>mi-</span>
      <span className="text-brand">या</span>
      <span className="text-brand">-bi</span>
    </span>
  );
}
