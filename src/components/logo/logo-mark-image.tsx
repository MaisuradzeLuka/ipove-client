/** Shared wordmark layout for favicon / app icon ImageResponse */

const DUSK = "#1e1b4b";
const STARLIGHT = "#f8fafc";
const PERIWINKLE = "#818cf8";

type LogoMarkImageProps = {
  fontSize: number;
};

export function LogoMarkImage({ fontSize }: LogoMarkImageProps) {
  const dotSize = Math.round(fontSize * 0.32);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: STARLIGHT,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
        fontWeight: 600,
        color: DUSK,
        letterSpacing: "-0.02em",
      }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontSize,
          lineHeight: 1,
        }}>
        <div
          style={{
            display: "flex",
            position: "relative",
            paddingRight: fontSize * 0.08,
          }}>
          <span>I</span>
          <div
            style={{
              position: "absolute",
              top: -dotSize * 0.45,
              left: "50%",
              transform: "translateX(-50%)",
              width: dotSize,
              height: dotSize,
              borderRadius: "50%",
              background: PERIWINKLE,
            }}
          />
        </div>
        <span>pove</span>
      </div>
    </div>
  );
}
