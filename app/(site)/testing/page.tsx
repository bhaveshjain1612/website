const SHARE_ID = "563b21b9372a42bab8ff9756892cbb9d";
const LIGHTROOM_SHARE_URL = `https://lightroom.adobe.com/shares/${SHARE_ID}`;
const LIGHTROOM_GRID_EMBED_URL = `https://lightroom.adobe.com/embed/shares/${SHARE_ID}/grid?background_color=%232D2D2D&color=%23999999`;
const LIGHTROOM_SLIDESHOW_EMBED_URL = `https://lightroom.adobe.com/embed/shares/${SHARE_ID}/slideshow?background_color=%232D2D2D&color=%23999999`;

export default function Page() {
  return (
    <div className="page-fade page-padded">
      <section className="section shell testing-page">
        <div className="section-kicker">Testing</div>
        <h1 className="page-title">Lightroom Embed Test</h1>
        <p className="testing-caption">
          This page is for validating direct Lightroom album embedding before production rollout.
        </p>
        <p className="testing-caption">
          <a href={LIGHTROOM_SHARE_URL} target="_blank" rel="noreferrer">
            Open full Lightroom gallery page
          </a>{" "}
          -{" "}
          <a href={LIGHTROOM_GRID_EMBED_URL} target="_blank" rel="noreferrer">
            Open grid in new tab
          </a>{" "}
          -{" "}
          <a href={LIGHTROOM_SLIDESHOW_EMBED_URL} target="_blank" rel="noreferrer">
            Open slideshow in new tab
          </a>
        </p>
        <div
          className="lr_embed"
          style={{ position: "relative", paddingBottom: "62%", height: 0, overflow: "hidden" }}
        >
          <iframe
            id="iframe"
            title="Lightroom Slideshow Embed"
            src={LIGHTROOM_GRID_EMBED_URL}
            frameBorder="0"
            loading="lazy"
            allowFullScreen
            style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
          />
        </div>
      </section>
    </div>
  );
}
