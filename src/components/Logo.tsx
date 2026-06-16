import Link from "next/link";
import Image from "next/image";

export default function Logo({
  className = "",
  height = 34,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <Link
      href="/"
      aria-label="miyaabi home"
      className={`inline-flex items-center ${className}`}
    >
      <Image
        src="/logo.png"
        alt="mi-या-bi"
        width={Math.round((height * 1200) / 340)}
        height={height}
        priority
        className="h-auto w-auto"
        style={{ height, width: "auto" }}
      />
    </Link>
  );
}
