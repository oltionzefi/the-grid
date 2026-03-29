/**
 * Custom SVG icons for burger category types.
 * Hand-crafted to be crisp at small sizes (8–20px) with no external dependencies.
 */

interface IconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

/** Beef icon — simplified cow head silhouette */
export function BeefIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Body / patty shape */}
      <ellipse cx="8" cy="9" rx="5.5" ry="3" />
      {/* Left horn */}
      <path d="M3 7.5 C2 5.5 1.5 4 2.5 3.5" />
      {/* Right horn */}
      <path d="M13 7.5 C14 5.5 14.5 4 13.5 3.5" />
      {/* Head bump */}
      <path d="M5 6.2 C5.5 4.8 10.5 4.8 11 6.2" />
      {/* Left ear */}
      <path d="M3.5 6 C2.8 5.2 2.5 4.5 3.5 4.5" />
      {/* Right ear */}
      <path d="M12.5 6 C13.2 5.2 13.5 4.5 12.5 4.5" />
    </svg>
  );
}

/** Chicken icon — stylised bird with wing */
export function ChickenIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Body */}
      <ellipse cx="8" cy="9" rx="4.5" ry="3.5" />
      {/* Head */}
      <circle cx="12" cy="4.5" r="1.8" />
      {/* Beak */}
      <path d="M13.4 4.2 L14.5 4.6 L13.4 5" />
      {/* Neck */}
      <path d="M10.8 5.5 C10.2 6.5 9 7 8 7" />
      {/* Wing line */}
      <path d="M5.5 8 C6.5 7 9.5 7 10.5 8" />
      {/* Tail */}
      <path d="M3.8 8 C3 7 2.5 6 3 5.5" />
      {/* Legs */}
      <path d="M6.5 12.5 L6 14.5" />
      <path d="M9.5 12.5 L10 14.5" />
    </svg>
  );
}

/** Veggie icon — carrot with leafy top */
export function VeggieIcon({ size = 16, className, strokeWidth = 1.8 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Carrot body */}
      <path d="M8 5 L5.5 13 Q8 14.5 10.5 13 Z" />
      {/* Centre line detail */}
      <line x1="8" y1="6" x2="8" y2="12" />
      {/* Left leaf */}
      <path d="M8 5 C6 4 4 2 5 1 C6 0 7.5 2.5 8 5" />
      {/* Right leaf */}
      <path d="M8 5 C10 4 12 2 11 1 C10 0 8.5 2.5 8 5" />
      {/* Middle leaf */}
      <path d="M8 4.5 C8 3 8 1.5 8 1" />
    </svg>
  );
}
