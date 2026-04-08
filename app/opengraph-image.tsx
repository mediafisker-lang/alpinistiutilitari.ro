import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background:
            "linear-gradient(135deg, #051734 0%, #0a3c9e 55%, #0063f7 82%, #e31e24 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 40,
            display: "flex",
            borderRadius: 34,
            border: "1px solid rgba(255,255,255,0.18)",
            background: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 46,
            top: 46,
            width: 220,
            height: 220,
            borderRadius: 999,
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 68px",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: "auto",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                padding: "10px 20px",
                fontSize: 24,
                letterSpacing: 2.4,
                textTransform: "uppercase",
              }}
            >
              AlpinistiUtilitari.ro
            </div>
            <div style={{ display: "flex", fontSize: 66, fontWeight: 800, lineHeight: 1.06 }}>
              Firme locale pentru lucrări la înălțime, rapid și clar.
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 28,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.86)",
                maxWidth: 780,
              }}
            >
              Cauți executanți pentru fațade, geamuri, acoperișuri, bannere sau arbori? Trimiți o
              singură cerere și compari opțiuni relevante din zona ta.
            </div>
          </div>

          <div style={{ display: "flex", gap: 18 }}>
            {["Acoperire națională", "Lead unic", "Selecție manuală"].map((item) => (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 999,
                  background: "white",
                  color: "#0f172a",
                  padding: "12px 22px",
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
