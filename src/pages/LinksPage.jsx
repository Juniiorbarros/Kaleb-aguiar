import React from "react";
import { clientConfig } from "../config/client.config.js";
import { usePageMetadata } from "../utils/usePageMetadata.js";
import "../styles/links-page.css";

const ASSET_ROOT = "/assets/kaleb-aguiar/links-figma";
const FIGMA_ADDRESS = "Rua Rio Purus, 1078, Vieiralves — Manaus, AM";
const HERO_SLIDE_INTERVAL = 3000;
const HERO_SLIDES = [
  {
    src: "/assets/kaleb-aguiar/link-hero-editorial-poster.png",
    width: 1155,
    height: 1362,
    objectPosition: "center 12%",
    alt: "Modelo usando vestido vermelho de gala no Atelier Kaleb Aguiar",
  },
  {
    src: "/assets/kaleb-aguiar/mobile-bg-boi-final.png",
    width: 1068,
    height: 1472,
    objectPosition: "center 24%",
    alt: "",
  },
  {
    src: "/assets/kaleb-aguiar/mobile-bg-nicole-red-final.png",
    width: 1154,
    height: 1363,
    objectPosition: "center 12%",
    alt: "",
  },
];

function ExternalLink({ href, children, className = "", ...props }) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    >
      {children}
    </a>
  );
}

function LinkCard({ href, icon, label, onClick, pending = false }) {
  const content = (
    <>
      <span className="links-v2-card-label">
        <img src={`${ASSET_ROOT}/${icon}`} alt="" aria-hidden="true" />
        <span>{label}</span>
      </span>
      <img
        className="links-v2-card-arrow"
        src={`${ASSET_ROOT}/link-arrow.svg`}
        alt=""
        aria-hidden="true"
      />
    </>
  );

  if (href) {
    return (
      <ExternalLink className="links-v2-card" href={href}>
        {content}
      </ExternalLink>
    );
  }

  return (
    <button
      className="links-v2-card"
      type="button"
      onClick={onClick}
      data-placeholder={pending ? "true" : undefined}
      aria-label={`${label}. Link pendente de configuração.`}
      title="Link pendente de configuração"
    >
      {content}
    </button>
  );
}

function StaticMap() {
  return (
    <div
      className="links-v2-map"
      role="img"
      aria-label={`Mapa da região do atelier: ${FIGMA_ADDRESS}`}
    >
      <div className="links-v2-map-viewport" aria-hidden="true">
        <div className="links-v2-map-tiles">
          <img className="is-west-north" src={`${ASSET_ROOT}/map-tile-west-north.jpg`} alt="" />
          <img className="is-east-north" src={`${ASSET_ROOT}/map-tile-east-north.jpg`} alt="" />
          <img className="is-west-south" src={`${ASSET_ROOT}/map-tile-west-south.jpg`} alt="" />
          <img className="is-east-south" src={`${ASSET_ROOT}/map-tile-east-south.jpg`} alt="" />
        </div>

        <span className="links-v2-map-camera">
          <img src={`${ASSET_ROOT}/map-camera-control.svg`} alt="" />
        </span>

        <span className="links-v2-map-satellite">
          <span>
            <img src={`${ASSET_ROOT}/map-satellite-thumbnail.jpg`} alt="" />
          </span>
        </span>
      </div>

      <ExternalLink
        className="links-v2-open-map"
        href={clientConfig.links.maps}
        aria-label="Abrir localização do Atelier Kaleb Aguiar no Google Maps"
      >
        <span>Open in Maps</span>
        <img src={`${ASSET_ROOT}/external-link.svg`} alt="" aria-hidden="true" />
      </ExternalLink>
    </div>
  );
}

function FooterSocial({ href, icon, label, onClick }) {
  const content = <img src={`${ASSET_ROOT}/${icon}`} alt="" aria-hidden="true" />;

  if (href) {
    return (
      <ExternalLink className="links-v2-footer-social" href={href} aria-label={label}>
        {content}
      </ExternalLink>
    );
  }

  return (
    <button
      className="links-v2-footer-social"
      type="button"
      onClick={onClick}
      aria-label={`${label}. Link pendente de configuração.`}
      title="Link pendente de configuração"
    >
      {content}
    </button>
  );
}

export function LinksPage() {
  const noticeRef = React.useRef(null);
  const noticeTimer = React.useRef(null);
  const [activeHeroSlide, setActiveHeroSlide] = React.useState(0);
  const [heroMotionReady, setHeroMotionReady] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  usePageMetadata({
    title: "Kaleb Aguiar | Links",
    description: "Links oficiais, WhatsApp e localização do Atelier Kaleb Aguiar em Manaus.",
    robots: "index, follow",
    canonicalPath: "/links",
  });

  React.useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => window.clearTimeout(noticeTimer.current);
  }, []);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  React.useEffect(() => {
    const preloaders = HERO_SLIDES.slice(1).map(({ src }) => {
      const image = new Image();
      image.decoding = "async";
      image.src = src;
      return image;
    });

    return () => {
      preloaders.forEach((image) => {
        image.onload = null;
        image.onerror = null;
      });
    };
  }, []);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setActiveHeroSlide(0);
      setHeroMotionReady(false);
      return undefined;
    }

    const motionFrame = window.requestAnimationFrame(() => setHeroMotionReady(true));
    const slideTimer = window.setInterval(() => {
      setActiveHeroSlide((currentSlide) => (currentSlide + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_INTERVAL);

    return () => {
      window.cancelAnimationFrame(motionFrame);
      window.clearInterval(slideTimer);
    };
  }, [prefersReducedMotion]);

  const showNotice = React.useCallback((message) => {
    window.clearTimeout(noticeTimer.current);
    if (!noticeRef.current) return;
    noticeRef.current.textContent = message;
    noticeRef.current.classList.add("is-visible");
    noticeTimer.current = window.setTimeout(() => {
      if (!noticeRef.current) return;
      noticeRef.current.classList.remove("is-visible");
      noticeRef.current.textContent = "";
    }, 5000);
  }, []);

  const showTikTokPlaceholder = React.useCallback(() => {
    showNotice("Link do TikTok pendente de configuração.");
  }, [showNotice]);

  const copyAddress = React.useCallback(async () => {
    const fallbackCopy = () => {
      const textarea = document.createElement("textarea");
      textarea.value = FIGMA_ADDRESS;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(FIGMA_ADDRESS);
      } else if (!fallbackCopy()) {
        throw new Error("Clipboard indisponível");
      }
      showNotice("Endereço copiado.");
    } catch {
      showNotice(fallbackCopy() ? "Endereço copiado." : "Não foi possível copiar o endereço.");
    }
  }, [showNotice]);

  return (
    <main className="links-v2-page">
      <div className="links-v2-atmosphere" aria-hidden="true" />

      <article className="links-v2-shell" aria-label="Links do Atelier Kaleb Aguiar">
        <section className="links-v2-hero" aria-label="Apresentação">
          <div className="links-v2-hero-slides">
            {HERO_SLIDES.map((slide, index) => (
              <img
                key={slide.src}
                className={[
                  "links-v2-hero-slide",
                  index === activeHeroSlide ? "is-active" : "",
                  heroMotionReady ? "is-motion-ready" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                src={slide.src}
                alt={slide.alt}
                aria-hidden={index === 0 ? undefined : "true"}
                width={slide.width}
                height={slide.height}
                loading="eager"
                fetchpriority={index === 0 ? "high" : "low"}
                decoding="async"
                style={{ "--links-hero-object-position": slide.objectPosition }}
                data-hero-slide={index + 1}
              />
            ))}
          </div>
          <span className="links-v2-hero-gradient" aria-hidden="true" />
        </section>

        <section className="links-v2-profile" aria-labelledby="links-v2-title">
          <h1 id="links-v2-title">KALEB AGUIAR</h1>
          <p className="links-v2-role">Designer de Moda</p>
          <p className="links-v2-city">Atelier de cena em Manaus</p>
          <p className="links-v2-quote">
            “Vestidos que transformam ocasiões em memória.”
          </p>

          <ExternalLink
            href={clientConfig.whatsappUrl}
            className="links-v2-whatsapp"
            aria-label="Falar com o Atelier Kaleb Aguiar no WhatsApp"
          >
            <img src={`${ASSET_ROOT}/whatsapp-chat.svg`} alt="" aria-hidden="true" />
            <span>FALAR NO WHATSAPP</span>
            <img src={`${ASSET_ROOT}/cta-arrow.svg`} alt="" aria-hidden="true" />
          </ExternalLink>

          <span className="links-v2-divider" aria-hidden="true" />
        </section>

        <nav className="links-v2-cards" aria-label="Links principais">
          <LinkCard
            href={clientConfig.instagramUrl}
            icon="instagram.svg"
            label="INSTAGRAM"
          />
          <LinkCard
            href={clientConfig.tiktokUrl}
            icon="tiktok.svg"
            label="TIKTOK"
            onClick={showTikTokPlaceholder}
            pending={!clientConfig.tiktokUrl}
          />
          <LinkCard
            href={clientConfig.links.maps}
            icon="location-pin.svg"
            label="COMO CHEGAR AO ATELIER"
          />
        </nav>

        <section className="links-v2-location" aria-labelledby="links-v2-location-title">
          <header>
            <h2 id="links-v2-location-title">LOCALIZAÇÃO DO ATELIER</h2>
            <p>{FIGMA_ADDRESS}</p>
          </header>

          <StaticMap />

          <div className="links-v2-location-actions">
            <ExternalLink href={clientConfig.links.maps} className="links-v2-route">
              TRAÇAR ROTA NO GOOGLE MAPS
            </ExternalLink>
            <button className="links-v2-copy" type="button" onClick={copyAddress}>
              <img src={`${ASSET_ROOT}/copy.svg`} alt="" aria-hidden="true" />
              <span>COPIAR ENDEREÇO</span>
            </button>
          </div>
        </section>

        <footer className="links-v2-footer">
          <strong>KALEB AGUIAR</strong>
          <p>Designer de Moda — Manaus, AM</p>
          <p>© 2024 KALEB AGUIAR ATELIER</p>
          <nav aria-label="Redes sociais">
            <FooterSocial
              href={clientConfig.instagramUrl}
              icon="footer-instagram.svg"
              label="Abrir Instagram do Atelier Kaleb Aguiar"
            />
            <FooterSocial
              href={clientConfig.tiktokUrl}
              icon="footer-tiktok.svg"
              label="Abrir TikTok do Atelier Kaleb Aguiar"
              onClick={showTikTokPlaceholder}
            />
            <FooterSocial
              href={clientConfig.whatsappUrl}
              icon="footer-whatsapp.svg"
              label="Abrir WhatsApp do Atelier Kaleb Aguiar"
            />
          </nav>
        </footer>

        <div className="links-v2-bottom-space" aria-hidden="true" />
      </article>

      <div ref={noticeRef} className="links-v2-notice" role="status" aria-live="polite" />
    </main>
  );
}
