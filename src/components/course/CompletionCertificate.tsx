import { KNMark } from "@/components/brand/KNMark";
import { BRAND } from "@/lib/brand";

export type CertificateView = {
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  certificateCode: string;
};

interface CompletionCertificateProps {
  certificate: CertificateView;
  className?: string;
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/** Printable certificate matching the KN Agentic AI Engineering design. */
export default function CompletionCertificate({ certificate, className }: CompletionCertificateProps) {
  return (
    <article
      className={`certificate-print-root ${className || ""}`.trim()}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 900,
        aspectRatio: "1.414 / 1",
        background: "#ffffff",
        color: "#0f172a",
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      {/* Soft blue swooshes */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 45% at 0% 0%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(ellipse 55% 40% at 100% 100%, rgba(37,99,235,0.16), transparent 55%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", height: "100%", padding: "6% 7%", display: "flex", flexDirection: "column" }}>
        <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <KNMark size="lg" />
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 18, fontFamily: "system-ui, sans-serif" }}>{BRAND.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b", fontFamily: "system-ui, sans-serif" }}>
                {BRAND.specialty}
              </p>
            </div>
          </div>
          <p
            style={{
              margin: 0,
              fontStyle: "italic",
              fontSize: 13,
              color: "#334155",
              borderBottom: "2px solid #3b82f6",
              paddingBottom: 2,
            }}
          >
            {BRAND.tagline}
          </p>
        </header>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", paddingTop: 12 }}>
          <h1
            style={{
              margin: "0 0 28px",
              fontSize: "clamp(22px, 3.2vw, 34px)",
              letterSpacing: "0.18em",
              fontWeight: 800,
              fontFamily: "system-ui, sans-serif",
              textTransform: "uppercase",
            }}
          >
            Certificate of Completion
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "clamp(28px, 4.5vw, 44px)",
              fontWeight: 800,
              color: "#1e3a8a",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {certificate.studentName || "Student"}
          </p>
          <p style={{ margin: "14px 0 10px", fontSize: 15, color: "#475569", fontFamily: "system-ui, sans-serif" }}>
            has successfully completed the course
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "clamp(22px, 3.4vw, 36px)",
              fontWeight: 800,
              color: "#2563eb",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            {certificate.courseTitle}
          </p>
          <p style={{ margin: "12px auto 0", maxWidth: 520, fontSize: 13, lineHeight: 1.5, color: "#64748b", fontFamily: "system-ui, sans-serif" }}>
            A practical, end-to-end program to design and build reliable AI agents and automation systems.
          </p>
        </div>

        <footer style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "flex-end", gap: 16, marginTop: 8 }}>
          <div>
            <p
              style={{
                margin: 0,
                fontFamily: "'Segoe Script', 'Brush Script MT', cursive",
                fontSize: 28,
                color: "#1e3a8a",
                lineHeight: 1,
              }}
            >
              {BRAND.name}
            </p>
            <p
              style={{
                margin: "6px 0 0",
                fontSize: 11,
                letterSpacing: "0.14em",
                color: "#64748b",
                fontFamily: "system-ui, sans-serif",
                fontWeight: 700,
              }}
            >
              COURSE INSTRUCTOR
            </p>
          </div>
          <p
            style={{
              margin: 0,
              justifySelf: "center",
              textAlign: "center",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "#64748b",
              fontFamily: "system-ui, sans-serif",
              paddingBottom: 2,
            }}
          >
            kariim-nabiil.com
          </p>
          <div style={{ textAlign: "right", fontFamily: "system-ui, sans-serif" }}>
            <p style={{ margin: 0, fontSize: 13, color: "#334155", fontWeight: 600 }}>
              Completed on {formatDate(certificate.issuedAt)}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#94a3b8" }}>Code: {certificate.certificateCode}</p>
          </div>
        </footer>
      </div>
    </article>
  );
}
