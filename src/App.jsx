import React from "react";
import { clientConfig, buildReservationUrl } from "./config/client.config.js";
import { ArrowIcon, CopyIcon, CrownIcon, PinIcon } from "./components/Icons.jsx";

function usePathname() {
  const [pathname, setPathname] = React.useState(() => window.location.pathname || "/");

  React.useEffect(() => {
    const onChange = () => setPathname(window.location.pathname || "/");
    window.addEventListener("popstate", onChange);
    return () => window.removeEventListener("popstate", onChange);
  }, []);

  return pathname;
}

function navigateTo(path) {
  window.history.pushState(null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

function SmartLink({ href, children, className = "", ...props }) {
  const isInternal = href?.startsWith("/");
  if (!isInternal) {
    return <a href={href} className={className} target="_blank" rel="noreferrer" {...props}>{children}</a>;
  }
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        event.preventDefault();
        navigateTo(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}

function BrandMark({ compact = false }) {
  return (
    <SmartLink href="/" className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="Kaleb Aguiar">
      <img src={clientConfig.assets.logo} alt="" />
      <span>
        <strong>Kaleb Aguiar</strong>
        {!compact && <em>Designer de moda</em>}
      </span>
    </SmartLink>
  );
}

function CtaButton({ context = "agendar prova", children = "Agendar minha prova", variant = "primary" }) {
  return (
    <SmartLink href={buildReservationUrl(context)} className={`btn btn--${variant}`} aria-label={`${children} pelo Instagram`}>
      <CrownIcon />
      <span>{children}</span>
    </SmartLink>
  );
}

function LocationActions({ compact = false }) {
  const [copied, setCopied] = React.useState(false);
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(clientConfig.address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`location-actions ${compact ? "location-actions--compact" : ""}`}>
      <div className="location-address">
        <PinIcon />
        <span>{clientConfig.address}</span>
      </div>
      <div className="location-buttons">
        <SmartLink href={clientConfig.links.maps} className="btn btn--ghost">Google Maps</SmartLink>
        <SmartLink href={clientConfig.links.uber} className="btn btn--ghost">Uber</SmartLink>
        <button className="btn btn--ghost" type="button" onClick={copyAddress}>
          <CopyIcon />
          <span>{copied ? "Endereco copiado" : "Copiar para 99"}</span>
        </button>
      </div>
    </div>
  );
}

function SiteNav() {
  return (
    <header className="site-nav">
      <BrandMark compact />
      <nav aria-label="Navegacao principal">
        <a href="#ocasioes">Vestidos</a>
        <a href="#atelier">Como reservar</a>
        <a href="#localizacao">Como chegar</a>
        <SmartLink href="/links">Linkpage</SmartLink>
      </nav>
      <CtaButton context="prova pelo menu" variant="nav">Agendar prova</CtaButton>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero-bg" aria-hidden="true">
        <img src={clientConfig.assets.hero} alt="" />
      </div>
      <div className="hero-orbit" aria-hidden="true" />
      <div className="hero-content">
        <p className="kicker">Aluguel exclusivo em Manaus</p>
        <h1>Reserve o vestido da sua grande entrada.</h1>
        <p>{clientConfig.positioning}</p>
        <div className="hero-actions">
          <CtaButton context="hero vitrine" />
          <a className="btn btn--outline" href="#ocasioes">
            <span>Ver vestidos disponiveis</span>
            <ArrowIcon />
          </a>
        </div>
        <div className="proof-row" aria-label="Provas sociais">
          {clientConfig.proof.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <aside className="hero-card" aria-label="Resumo do atelie">
        <span>Prova com horario marcado</span>
        <strong>Escolha sua ocasiao e fale com o atelie antes de ir.</strong>
        <small>{clientConfig.addressShort}</small>
      </aside>
    </section>
  );
}

function CategoryCard({ item, index }) {
  return (
    <article className="category-card" style={{ "--accent": item.accent, "--delay": `${index * 70}ms` }}>
      <img src={item.image} alt={item.title} loading={index < 2 ? "eager" : "lazy"} />
      <div className="category-shade" aria-hidden="true" />
      <div className="category-copy">
        <span>{item.eyebrow}</span>
        <h3>{item.label}</h3>
        <p>{item.body}</p>
        <SmartLink href={buildReservationUrl(item.label)}>
          {item.title}
          <ArrowIcon />
        </SmartLink>
      </div>
    </article>
  );
}

function CategoriesSection() {
  return (
    <section className="section categories" id="ocasioes">
      <div className="section-head">
        <p className="kicker">Escolha por ocasiao</p>
        <h2>Encontre o vestido certo antes da prova.</h2>
        <p>Veja a categoria que combina com sua data e chame o atendimento com um pedido claro. O atelie te orienta nos modelos, cores e disponibilidade.</p>
      </div>
      <div className="category-grid">
        {clientConfig.categories.map((item, index) => <CategoryCard key={item.id} item={item} index={index} />)}
      </div>
    </section>
  );
}

function AtelierSection() {
  return (
    <section className="section atelier" id="atelier">
      <div className="atelier-copy">
        <p className="kicker">Como reservar</p>
        <h2>Agende a prova com uma ideia clara do que voce quer.</h2>
        <p>O atendimento fica mais rapido quando voce chega com ocasiao, data, estilo e referencias. A vitrine guia esse primeiro contato e leva voce direto para a reserva.</p>
        <div className="process-list">
          {clientConfig.process.map(([number, title, body]) => (
            <article key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="atelier-stage" aria-hidden="true">
        <img className="stage-main" src={clientConfig.assets.silver} alt="" />
        <img className="stage-float stage-float--one" src={clientConfig.assets.blue} alt="" />
        <img className="stage-float stage-float--two" src={clientConfig.assets.lilac} alt="" />
      </div>
    </section>
  );
}

function GallerySection() {
  const gallery = [clientConfig.assets.red, clientConfig.assets.green, clientConfig.assets.sash, clientConfig.assets.blue, clientConfig.assets.lilac, clientConfig.assets.silver];
  return (
    <section className="gallery-band" aria-label="Galeria inicial">
      <div className="gallery-track">
        {gallery.concat(gallery).map((src, index) => (
          <img key={`${src}-${index}`} src={src} alt="" loading="lazy" />
        ))}
      </div>
    </section>
  );
}

function LocationSection() {
  return (
    <section className="section location" id="localizacao">
      <div>
        <p className="kicker">Prova presencial</p>
        <h2>Chegue ao atelie sem perder tempo.</h2>
        <p>Abra a rota no mapa, chame Uber ou copie o endereco para a 99. A decisao do vestido continua no atendimento.</p>
      </div>
      <LocationActions />
    </section>
  );
}

function FinalCta() {
  return (
    <section className="final-cta">
      <BrandMark />
      <h2>Quer provar um vestido para sua data?</h2>
      <p>Chame o atelie, informe sua ocasiao e agende um horario.</p>
      <CtaButton context="cta final">Agendar minha prova</CtaButton>
    </section>
  );
}

function ShowcasePage() {
  React.useEffect(() => {
    document.title = "Kaleb Aguiar | Vitrine Premium";
  }, []);

  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <CategoriesSection />
        <AtelierSection />
        <GallerySection />
        <LocationSection />
        <FinalCta />
      </main>
    </>
  );
}

function LinkAction({ item }) {
  return (
    <SmartLink href={buildReservationUrl(item.label)} className="flyer-card" style={{ "--accent": item.accent }} aria-label={`${item.title} pelo Instagram`}>
      <img src={item.image} alt={item.title} loading="lazy" />
      <span className="flyer-card-shade" aria-hidden="true" />
      <span className="flyer-card-copy">
        <em>{item.title.replace("Ver ", "").replace("Consultar ", "")}</em>
        <strong>{item.label}</strong>
        <i />
      </span>
    </SmartLink>
  );
}

function LinkPage() {
  React.useEffect(() => {
    document.title = "Kaleb Aguiar | Links";
  }, []);

  const flyerLinks = clientConfig.categories;
  const features = [
    ["Atelie", "sob medida"],
    ["Tecidos", "premium"],
    ["Acabamento", "artesanal"],
    ["Exclusivo", "para voce"],
  ];

  return (
    <main className="linkpage flyer-page">
      <div className="flyer-backdrop" aria-hidden="true">
        <img src={clientConfig.assets.hero} alt="" />
      </div>
      <article className="flyer-poster" aria-label="Linkpage premium Kaleb Aguiar">
        <section className="flyer-hero">
          <div className="flyer-hero-image" aria-hidden="true">
            <video
              src="/assets/kaleb-aguiar/kaleb-flyer-motion.mp4"
              poster="/assets/kaleb-aguiar/motion-flyer-still.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          </div>

          <header className="flyer-top">
            <video
              className="flyer-logo-motion"
              src="/assets/kaleb-aguiar/kaleb-logo-reveal.mp4"
              poster="/assets/kaleb-aguiar/motion-logo-still.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Kaleb Aguiar"
            />
            <SmartLink href={clientConfig.instagramUrl} className="flyer-menu" aria-label="Abrir Instagram Kaleb Aguiar">
              <span />
              <span />
              <span />
            </SmartLink>
          </header>

          <div className="flyer-copy">
            <p className="flyer-kicker">Designer de moda</p>
            <h1>Vestidos que <span>transformam</span> ocasioes em <span>memoria</span></h1>
            <i className="flyer-divider" aria-hidden="true" />
            <p>Escolha sua ocasiao e agende uma prova com atendimento sob medida.</p>
            <small>{clientConfig.contactNote}</small>
            <div className="flyer-cta-stack">
              <CtaButton context="linkpage flyer principal">Reservar meu vestido</CtaButton>
              <a className="btn btn--outline" href="#flyer-estilos">
                <span>Explorar estilos</span>
                <ArrowIcon />
              </a>
            </div>
          </div>

          <aside className="flyer-side-rail" aria-hidden="true">
            <span>Exclusividade</span>
            <span>Atelie</span>
            <span>Sob medida</span>
          </aside>
        </section>

        <nav className="flyer-grid" id="flyer-estilos" aria-label="Escolher estilo de vestido">
          {flyerLinks.map((item) => <LinkAction key={item.id} item={item} />)}
        </nav>

        <section className="flyer-feature-bar" aria-label="Diferenciais do atelie">
          {features.map(([top, bottom]) => (
            <div key={top}>
              <video
                src="/assets/kaleb-aguiar/motion-icon-spark.webm"
                poster="/assets/kaleb-aguiar/motion-icon-spark.png"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
              <span>{top}</span>
              <strong>{bottom}</strong>
            </div>
          ))}
        </section>

        <section className="flyer-bridge" aria-label="Vitrine completa Kaleb Aguiar">
          <div>
            <p className="flyer-kicker">Vitrine completa</p>
            <h2>Veja a experiencia completa antes de agendar.</h2>
          </div>
          <SmartLink href="/" className="btn btn--outline">
            <span>Entrar na vitrine</span>
            <ArrowIcon />
          </SmartLink>
        </section>

        <section className="flyer-location">
          <h2>Como chegar ao atelie</h2>
          <LocationActions compact />
        </section>
      </article>
    </main>
  );
}

export function App() {
  const pathname = usePathname();
  if (pathname === "/links") return <LinkPage />;
  return <ShowcasePage />;
}
