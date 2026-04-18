import { StudioClient } from "@/app/studio/[[...tool]]/StudioClient";
import { isSanityConfigured } from "@/lib/sanity/env";

export const dynamic = "force-static";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#111",
          color: "#f5f5f5",
          fontFamily: "sans-serif",
          padding: "2rem"
        }}
      >
        <div style={{ maxWidth: 700 }}>
          <h1 style={{ marginBottom: "0.5rem" }}>Sanity is not configured yet</h1>
          <p style={{ lineHeight: 1.6 }}>
            Add <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
            <code>NEXT_PUBLIC_SANITY_DATASET</code> in your environment, then reload.
          </p>
        </div>
      </main>
    );
  }

  return <StudioClient />;
}
