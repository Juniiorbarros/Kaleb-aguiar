import React from "react";
import { clientConfig, buildReservationUrl } from "./config/client.config.js";
import { ArrowIcon, CopyIcon, CrownIcon, DressIcon, FacebookIcon, InstagramIcon, PinIcon, WhatsAppIcon } from "./components/Icons.jsx";

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

function getAnchorTargetId(id) {
  return id === "ocasioes" ? "vestidos" : id;
}

function getFixedNavOffset() {
  const nav = document.querySelector(".site-nav");
  const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
  return Math.ceil(navBottom + 18);
}

function scrollToSection(id, behavior = "smooth") {
  const targetId = getAnchorTargetId(id);
  const section = document.getElementById(targetId) || document.getElementById(id);
  if (!section) return false;
  const sectionTop = section.getBoundingClientRect().top + window.scrollY;
  const top = sectionTop - getFixedNavOffset();
  window.scrollTo({ top: Math.max(0, top), behavior });
  return true;
}

function useInViewport(options = {}) {
  const ref = React.useRef(null);
  const [isInView, setIsInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsInView(true);
      observer.disconnect();
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.rootMargin, options.threshold]);

  return [ref, isInView];
}

function useAnchorNavigation() {
  React.useEffect(() => {
    const onClick = (event) => {
      const anchor = event.target.closest?.("a[href^='#']");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;
      const id = decodeURIComponent(href.slice(1));
      if (!scrollToSection(id)) return;
      event.preventDefault();
      window.history.pushState(null, "", `#${getAnchorTargetId(id)}`);
    };

    const onHashChange = () => {
      const id = window.location.hash.slice(1);
      if (id) window.requestAnimationFrame(() => scrollToSection(id, "smooth"));
    };

    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);
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
    <SmartLink href="/" className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-label="Atelier Kaleb Aguiar">
      <img src={clientConfig.assets.logo} alt="" />
      <span>
        <strong>Atelier Kaleb Aguiar</strong>
        {!compact && <em>Designer de moda</em>}
      </span>
    </SmartLink>
  );
}

function KalebTypemark({ compact = false }) {
  return (
    <SmartLink href="/" className={`kaleb-typemark ${compact ? "kaleb-typemark--compact" : ""}`} aria-label="Atelier Kaleb Aguiar">
      <span className="kaleb-seal">
        <img src={clientConfig.assets.logo} alt="" />
      </span>
      <span className="kaleb-signature">
        <strong>Atelier Kaleb Aguiar</strong>
        <em>Designer de moda</em>
      </span>
    </SmartLink>
  );
}

function CtaButton({ context = "visita sem compromisso", children = "Visite sem compromisso", variant = "primary" }) {
  return (
    <SmartLink href={buildReservationUrl(context)} className={`btn btn--${variant}`} aria-label={`${children} pelo WhatsApp`}>
      <CrownIcon />
      <span>{children}</span>
    </SmartLink>
  );
}

function SocialLinks() {
  const items = [
    ["Facebook", clientConfig.facebookUrl, FacebookIcon],
    ["Instagram", clientConfig.instagramUrl, InstagramIcon],
    ["WhatsApp", clientConfig.whatsappUrl, WhatsAppIcon],
  ];

  return (
    <nav className="flyer-social-links" aria-label="Redes sociais do Atelier Kaleb Aguiar">
      {items.map(([label, href, Icon]) => (
        <SmartLink key={label} href={href} className="flyer-social-link" aria-label={`Abrir ${label} do Atelier Kaleb Aguiar`} title={label}>
          <Icon />
          <span>{label}</span>
        </SmartLink>
      ))}
    </nav>
  );
}

function HeroSocialLinks() {
  const items = [
    ["Facebook", clientConfig.facebookUrl, FacebookIcon],
    ["Instagram", clientConfig.instagramUrl, InstagramIcon],
    ["WhatsApp", clientConfig.whatsappUrl, WhatsAppIcon],
  ];

  return (
    <nav className="hero-social-links" aria-label="Redes sociais do Atelier Kaleb Aguiar">
      <span>Redes sociais</span>
      <div>
        {items.map(([label, href, Icon]) => (
          <SmartLink key={label} href={href} className="hero-social-link" aria-label={`Abrir ${label} do Atelier Kaleb Aguiar`} title={label}>
            <Icon />
            <span>{label}</span>
          </SmartLink>
        ))}
      </div>
    </nav>
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
  const pathname = usePathname();
  const [activeSection, setActiveSection] = React.useState("inicio");
  const navRef = React.useRef(null);

  React.useEffect(() => {
    if (pathname === "/links") {
      setActiveSection("linkpage");
      return undefined;
    }

    const sectionIds = ["inicio", "vestidos", "atelier", "localizacao"];
    const updateActiveSection = () => {
      const marker = getFixedNavOffset() + window.innerHeight * 0.24;
      const current = sectionIds.reduce((active, id) => {
        const section = document.getElementById(id);
        if (!section) return active;
        return section.getBoundingClientRect().top <= marker ? id : active;
      }, "inicio");
      setActiveSection(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  React.useEffect(() => {
    const activeLink = navRef.current?.querySelector("a.is-active");
    activeLink?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [activeSection]);

  const navLinkClass = (id) => activeSection === id ? "is-active" : "";
  const current = (id) => activeSection === id ? "page" : undefined;
  const activate = (id) => () => setActiveSection(id);

  return (
    <header className="site-nav">
      <BrandMark compact />
      <nav ref={navRef} aria-label="Navegacao principal">
        <a className={navLinkClass("inicio")} aria-current={current("inicio")} href="#inicio" onClick={activate("inicio")}>Inicio</a>
        <a className={navLinkClass("vestidos")} aria-current={current("vestidos")} href="#vestidos" onClick={activate("vestidos")}>Vestidos</a>
        <a className={navLinkClass("atelier")} aria-current={current("atelier")} href="#atelier" onClick={activate("atelier")}>Como reservar</a>
        <a className={navLinkClass("localizacao")} aria-current={current("localizacao")} href="#localizacao" onClick={activate("localizacao")}>Como chegar</a>
        <SmartLink className={navLinkClass("linkpage")} aria-current={current("linkpage")} href="/links">Linkpage</SmartLink>
      </nav>
      <CtaButton context="menu principal" variant="nav">Visitar</CtaButton>
    </header>
  );
}

function Hero() {
  const heroSlides = clientConfig.assets.heroSlides || [{ src: clientConfig.assets.hero, position: "70% 50%" }];

  return (
    <section className="hero" id="inicio">
      <div className="hero-bg" aria-hidden="true">
        {heroSlides.map((slide, index) => (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`hero-bg-slide ${heroSlides.length === 1 ? "hero-bg-slide--single" : ""}`}
            style={{
              "--slide-delay": `${index * 5}s`,
              "--hero-position": slide.position,
              "--hero-mobile-position": slide.mobilePosition || slide.position,
              "--hero-scale-start": slide.scaleStart,
              "--hero-scale-end": slide.scaleEnd,
              "--hero-shift-x-start": slide.shiftXStart,
              "--hero-shift-x-end": slide.shiftXEnd,
              "--hero-shift-y-start": slide.shiftYStart,
              "--hero-shift-y-end": slide.shiftYEnd,
              "--hero-mobile-scale-start": slide.mobileScaleStart,
              "--hero-mobile-scale-end": slide.mobileScaleEnd,
              "--hero-mobile-shift-x-start": slide.mobileShiftXStart,
              "--hero-mobile-shift-x-end": slide.mobileShiftXEnd,
              "--hero-mobile-shift-y-start": slide.mobileShiftYStart,
              "--hero-mobile-shift-y-end": slide.mobileShiftYEnd,
              "--hero-frame-width": slide.frameWidth,
              "--hero-frame-height": slide.frameHeight,
              "--hero-frame-right": slide.frameRight,
              "--hero-frame-bottom": slide.frameBottom,
              "--hero-short-frame-width": slide.shortFrameWidth,
              "--hero-short-frame-bottom": slide.shortFrameBottom,
            }}
          />
        ))}
      </div>
      <div className="hero-content">
        <p className="kicker">Atelie de cena em Manaus</p>
        <h1 className="hero-title">
          <span className="hero-title__eyebrow">Atelier</span>
          <span className="hero-title__name">Kaleb Aguiar</span>
        </h1>
        <p>{clientConfig.positioning}</p>
        <div className="hero-actions">
          <CtaButton context="hero vitrine" />
          <a className="btn btn--outline" href="#vestidos">
            <span>Ver vestidos disponíveis</span>
            <ArrowIcon />
          </a>
        </div>
        <div className="proof-row" aria-label="Diferenciais do atelie">
          {clientConfig.proof.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <HeroSocialLinks />
    </section>
  );
}

function useHorizontalDragScroll() {
  const railRef = React.useRef(null);
  const dragRef = React.useRef({
    active: false,
    moved: false,
    pointerId: null,
    scrollLeft: 0,
    startX: 0,
  });

  const endDrag = React.useCallback((event) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!drag.active || drag.pointerId !== event.pointerId) return;
    if (drag.moved) event.preventDefault();
    drag.active = false;
    drag.pointerId = null;
    rail?.classList.remove("is-dragging");
    if (rail?.hasPointerCapture?.(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      window.setTimeout(() => {
        dragRef.current.moved = false;
      }, 0);
    }
  }, []);

  const onPointerDown = React.useCallback((event) => {
    if (event.button !== 0) return;
    const rail = railRef.current;
    if (!rail || rail.scrollWidth <= rail.clientWidth) return;
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      scrollLeft: rail.scrollLeft,
      startX: event.clientX,
    };
  }, []);

  const onPointerMove = React.useCallback((event) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag.active || drag.pointerId !== event.pointerId) return;
    const deltaX = event.clientX - drag.startX;
    if (Math.abs(deltaX) < 4) return;
    if (!drag.moved) {
      rail.classList.add("is-dragging");
      rail.setPointerCapture?.(event.pointerId);
    }
    drag.moved = true;
    rail.scrollLeft = drag.scrollLeft - deltaX;
    event.preventDefault();
  }, []);

  const onClickCapture = React.useCallback((event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    dragRef.current.moved = false;
  }, []);

  return {
    ref: railRef,
    onClickCapture,
    onPointerCancel: endDrag,
    onPointerDown,
    onPointerLeave: endDrag,
    onPointerMove,
    onPointerUp: endDrag,
  };
}

function DressCtaCards({ item, activeImageIndex = 0 }) {
  const photoNumber = activeImageIndex + 1;
  const activePhotoContext = item.isCollectionAlbum
    ? `${item.whatsappContext}, foto ${photoNumber} do album`
    : `${item.whatsappContext}, foto ${photoNumber}`;
  const actions = item.isCollectionAlbum
    ? [
      ["Consultar foto", activePhotoContext],
      ["Prova sem compromisso", `${item.whatsappContext} para prova no atelie`],
      ["Enviar referencia", `quero enviar como referencia: ${item.title}, foto ${photoNumber}`],
    ]
    : [
      ["Consultar vestido", activePhotoContext],
      ["Prova sem compromisso", `${item.whatsappContext} para prova no atelie`],
      ["Enviar referencia", `quero enviar como referencia: ${item.title}, foto ${photoNumber}`],
    ];

  return (
    <div className="dress-cta-grid" aria-label="Acoes para este vestido">
      {actions.map(([label, context], index) => (
        <SmartLink
          key={label}
          href={buildReservationUrl(context)}
          className={`dress-cta-card ${index === 0 ? "dress-cta-card--primary" : ""}`}
          aria-label={`${label} pelo WhatsApp`}
        >
          {index === 0 ? <WhatsAppIcon /> : <CrownIcon />}
          <span>{label}</span>
          <ArrowIcon />
        </SmartLink>
      ))}
    </div>
  );
}

function getUniqueGallery(items) {
  return [...new Set(items.flatMap((item) => item.gallery || []))];
}

function buildCollectionAlbumItem(collection, items) {
  const gallery = getUniqueGallery(items);
  const cover = collection.albumCover || gallery[0];
  const albumGallery = cover ? [cover, ...gallery.filter((src) => src !== cover)] : gallery;
  return {
    id: `album-${collection.id}`,
    collectionId: collection.id,
    title: `Album ${collection.label}`,
    eyebrow: collection.eyebrow,
    shortDescription: `Todas as fotos reais de ${collection.label} reunidas para comparar estilos.`,
    detailDescription: `Este album completo organiza as referencias de ${collection.label} em uma visualizacao unica. A cliente pode passar foto por foto, escolher o estilo desejado e chamar o atelie com uma direcao mais clara.`,
    idealFor: [collection.label, "Consulta visual", "Referencia para prova", "Atendimento pelo WhatsApp"],
    visualDetails: ["Fotos reais do acervo", "Galeria completa da categoria", "Comparacao de estilos", "Consulta sem compromisso"],
    gallery: albumGallery,
    backgroundImage: cover,
    proof: `${albumGallery.length} fotos reais desta modalidade`,
    accent: collection.accent,
    imagePosition: "50% 16%",
    mobilePosition: "50% 12%",
    whatsappContext: `album completo de ${collection.label}`,
    isCollectionAlbum: true,
  };
}

function getCollectionItems(collectionId) {
  const collection = clientConfig.dressCollections.find((item) => item.id === collectionId);
  const items = clientConfig.dressItems.filter((item) => item.collectionId === collectionId);
  if (!collection?.featuredItemId) return items;
  return items.sort((a, b) => {
    if (a.id === collection.featuredItemId) return -1;
    if (b.id === collection.featuredItemId) return 1;
    return 0;
  });
}

function DressModalNavigator({
  collections,
  collectionStats,
  dressItems,
  activeCollectionId,
  activeItemId,
  mode = "model",
  onSelectCollection,
  onSelectItem,
  onOpenAlbum,
}) {
  const modeTabsDrag = useHorizontalDragScroll();
  const modelRailDrag = useHorizontalDragScroll();
  const activeCollection = collections.find((collection) => collection.id === activeCollectionId) || collections[0];
  const activeCollectionItems = getCollectionItems(activeCollection.id);
  const albumCover = activeCollection.albumCover || activeCollectionItems[0]?.gallery?.[0];
  const activeStats = collectionStats[activeCollection.id] || { photos: 0 };

  return (
    <div className="dress-modal-navigator" aria-label={mode === "album" ? "Trocar album ou ver modelos no popup" : "Explorar vestidos no popup"}>
      <div className="dress-modal-nav-head">
        <span>{mode === "album" ? "Trocar album" : "Modalidades"}</span>
        <strong>{activeCollection.label}</strong>
      </div>
      <div
        className="dress-modal-mode-tabs"
        aria-label="Trocar modalidade dentro do popup"
        {...modeTabsDrag}
      >
        {collections.map((collection) => (
          <button
            key={collection.id}
            type="button"
            className={collection.id === activeCollection.id ? "is-active" : ""}
            onClick={() => onSelectCollection(collection.id)}
            style={{ "--mode-accent": collection.accent }}
            aria-pressed={collection.id === activeCollection.id}
            aria-label={mode === "album" ? `Abrir album ${collection.label}` : `Ver modelos de ${collection.label}`}
          >
            {collection.label}
          </button>
        ))}
      </div>
      <div
        className="dress-modal-model-rail"
        aria-label="Modelos desta modalidade"
        {...modelRailDrag}
      >
        {albumCover && (
          <button
            type="button"
            className={`dress-modal-model-chip ${activeItemId === `album-${activeCollection.id}` ? "is-active" : ""}`}
            onClick={() => onOpenAlbum(activeCollection.id)}
            style={{ "--model-accent": activeCollection.accent }}
            aria-pressed={activeItemId === `album-${activeCollection.id}`}
          >
            <img src={albumCover} alt="" loading="lazy" />
            <span>
              <small>{activeStats.photos} fotos</small>
              <strong>Album completo</strong>
            </span>
          </button>
        )}
        {activeCollectionItems.map((dressItem) => (
          <button
            key={dressItem.id}
            type="button"
            className={`dress-modal-model-chip ${dressItem.id === activeItemId ? "is-active" : ""}`}
            onClick={() => onSelectItem(dressItem)}
            style={{ "--model-accent": dressItem.accent }}
            aria-pressed={dressItem.id === activeItemId}
          >
            <img src={dressItem.gallery[0]} alt="" loading="lazy" />
            <span>
              <small>{dressItem.eyebrow}</small>
              <strong>{dressItem.title}</strong>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DressAlbumSwitcher({
  collections,
  activeCollectionId,
  onSelectCollection,
}) {
  const albumTabsDrag = useHorizontalDragScroll();
  const albumLabels = {
    "madrinha-moda-festa": "Madrinha",
    debutantes: "Debutantes",
    formatura: "Formatura",
    noiva: "Noiva",
    miss: "Miss",
    exclusivos: "Exclusivos",
  };

  return (
    <div className="dress-album-switcher" aria-label="Trocar album dentro do popup">
      <span>Albuns do acervo</span>
      <div className="dress-album-switcher__tabs" {...albumTabsDrag}>
        {collections.map((collection) => (
          <button
            key={collection.id}
            type="button"
            className={collection.id === activeCollectionId ? "is-active" : ""}
            onClick={() => {
              if (collection.id !== activeCollectionId) onSelectCollection(collection.id);
            }}
            style={{ "--album-accent": collection.accent }}
            aria-pressed={collection.id === activeCollectionId}
          >
            {albumLabels[collection.id] || collection.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function DressDetailDialog({
  item,
  onClose,
  collections,
  collectionStats,
  dressItems,
  activeCollectionId,
  onSelectCollection,
  onSelectItem,
  onOpenAlbum,
}) {
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);
  const dialogRef = React.useRef(null);
  const closeRef = React.useRef(null);
  const copyRef = React.useRef(null);
  const mediaRef = React.useRef(null);
  const previousFocusRef = React.useRef(null);
  const thumbsRef = React.useRef(null);
  const { ref: thumbDragRef, ...thumbRailHandlers } = useHorizontalDragScroll();
  const isOpen = Boolean(item);
  const gallery = item?.gallery || [];
  const photoTotal = gallery.length;
  const activeImage = gallery[activeImageIndex] || gallery[0];
  const canNavigateGallery = photoTotal > 1;
  const activeCollection = collections.find((collection) => collection.id === activeCollectionId);
  const modalDescription = item?.shortDescription || item?.detailDescription || "";
  const modalTags = item ? [...new Set([...(item.idealFor || []), ...(item.visualDetails || [])])].slice(0, 4) : [];
  const modalFacts = item ? [
    ["Fotos", `${photoTotal} fotos reais`],
    ["Ocasião", item.idealFor?.[0] || activeCollection?.label || item.eyebrow],
    ["Estilo", item.visualDetails?.[0] || item.proof],
  ] : [];

  const setThumbsNode = React.useCallback((node) => {
    thumbsRef.current = node;
    thumbDragRef.current = node;
  }, [thumbDragRef]);

  React.useEffect(() => {
    if (!item) return undefined;
    setActiveImageIndex(0);
    window.requestAnimationFrame(() => {
      dialogRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
      copyRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
      mediaRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
      thumbsRef.current?.scrollTo?.({ top: 0, left: 0, behavior: "auto" });
    });
    return undefined;
  }, [item]);

  const stepImage = React.useCallback((direction) => {
    setActiveImageIndex((current) => {
      if (!photoTotal) return 0;
      return (current + direction + photoTotal) % photoTotal;
    });
  }, [photoTotal]);

  React.useEffect(() => {
    const activeThumb = thumbsRef.current?.querySelector(`[data-image-index="${activeImageIndex}"]`);
    activeThumb?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [activeImageIndex]);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    previousFocusRef.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => closeRef.current?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  if (!item) return null;

  const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";
  const onDialogKeyDown = (event) => {
    const interactiveOutsideMedia = event.target.closest?.("a, button, input, textarea, select") && !event.target.closest?.(".dress-modal-media");
    if (interactiveOutsideMedia) return;
    if (event.key === "ArrowLeft" && canNavigateGallery) {
      event.preventDefault();
      stepImage(-1);
      return;
    }
    if (event.key === "ArrowRight" && canNavigateGallery) {
      event.preventDefault();
      stepImage(1);
      return;
    }
    if (event.key !== "Tab") return;
    const nodes = [...dialogRef.current.querySelectorAll(focusableSelector)];
    if (!nodes.length) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="dress-modal-backdrop"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <article
        ref={dialogRef}
        className={`dress-modal dress-modal--gallery ${item.isCollectionAlbum ? "dress-modal--album" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dress-modal-title"
        aria-describedby="dress-modal-description"
        onKeyDown={onDialogKeyDown}
        style={{ "--dress-accent": item.accent }}
      >
        <button
          ref={closeRef}
          type="button"
          className="dress-modal-close"
          onClick={onClose}
          aria-label={item.isCollectionAlbum ? "Fechar album e voltar para a vitrine" : "Fechar detalhes do vestido"}
        >
          <span aria-hidden="true">x</span>
        </button>

        <div className="dress-modal-media" ref={mediaRef}>
          <img src={activeImage || gallery[0]} alt={item.title} />
          <span className="dress-modal-badge">
            Foto {String(activeImageIndex + 1).padStart(2, "0")} / {String(photoTotal).padStart(2, "0")}
          </span>

          {canNavigateGallery && (
            <>
              <button
                type="button"
                className="dress-modal-image-nav dress-modal-image-nav--prev"
                onClick={() => stepImage(-1)}
                aria-label="Foto anterior do album"
              >
                <span aria-hidden="true">{"<"}</span>
              </button>
              <button
                type="button"
                className="dress-modal-image-nav dress-modal-image-nav--next"
                onClick={() => stepImage(1)}
                aria-label="Proxima foto do album"
              >
                <span aria-hidden="true">{">"}</span>
              </button>
            </>
          )}

        <div ref={setThumbsNode} className="dress-modal-thumbs" aria-label="Fotos do vestido" {...thumbRailHandlers}>
            {gallery.map((src, index) => (
              <button
                key={src}
                type="button"
                data-image-index={index}
                className={index === activeImageIndex ? "is-active" : ""}
                onClick={() => setActiveImageIndex(index)}
                aria-label={`Ver foto ${index + 1} de ${item.title}`}
                aria-pressed={index === activeImageIndex}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>

        <div className="dress-modal-copy" ref={copyRef}>
          <p className="kicker">{item.eyebrow}</p>
          <h3 id="dress-modal-title">{item.title}</h3>
          <p id="dress-modal-description">{modalDescription}</p>

          {item.isCollectionAlbum && (
            <DressAlbumSwitcher
              collections={collections}
              activeCollectionId={activeCollectionId}
              onSelectCollection={onSelectCollection}
            />
          )}

          <div className="dress-modal-tags" aria-label="Pontos principais">
            {modalTags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>

          <div className="dress-modal-facts" aria-label="Resumo do album">
            {modalFacts.map(([label, value]) => (
              <span key={label}>
                <small>{label}</small>
                <strong>{value}</strong>
              </span>
            ))}
          </div>

          <SmartLink
            href={buildReservationUrl(`${item.whatsappContext}, foto ${activeImageIndex + 1}`)}
            className="dress-modal-consult"
          >
            <WhatsAppIcon />
            <span>Consultar este vestido</span>
            <ArrowIcon />
          </SmartLink>
        </div>
      </article>
    </div>
  );
}

function DressFeatureCard({ item, activeIndex, total, onOpen }) {
  return (
    <button
      type="button"
      className="dress-feature-card"
      style={{
        "--accent": item.accent,
        "--dress-position": item.imagePosition,
        "--dress-mobile-position": item.mobilePosition || item.imagePosition,
      }}
      onClick={() => onOpen(item)}
      aria-label={`Abrir detalhes de ${item.title}`}
    >
      <img src={item.cardImage || item.gallery[0]} alt="" loading="eager" />
      <span className="dress-feature-card__shade" aria-hidden="true" />
      <span className="dress-feature-card__index">
        {String(activeIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="dress-feature-card__copy">
        <em>{item.eyebrow}</em>
        <strong>{item.title}</strong>
        <small>Clique para abrir</small>
      </span>
    </button>
  );
}

function DressFeatureCarousel({ items, activeIndex, onOpen, onStep }) {
  const dragRef = React.useRef({ active: false, moved: false, startX: 0, startY: 0 });
  const total = items.length;
  const getItem = React.useCallback((index) => {
    if (!total) return null;
    return items[((index % total) + total) % total];
  }, [items, total]);
  const carouselItems = total <= 1
    ? [{ slot: "active", item: getItem(activeIndex), index: activeIndex }]
    : [
      { slot: "prev", item: getItem(activeIndex - 1), index: activeIndex - 1 },
      { slot: "active", item: getItem(activeIndex), index: activeIndex },
      { slot: "next", item: getItem(activeIndex + 1), index: activeIndex + 1 },
    ];

  const onPointerDown = React.useCallback((event) => {
    if (event.button !== 0) return;
    dragRef.current = { active: true, moved: false, startX: event.clientX, startY: event.clientY };
  }, []);

  const onPointerMove = React.useCallback((event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      drag.moved = true;
      event.preventDefault();
    }
  }, []);

  const onPointerEnd = React.useCallback((event) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const dx = event.clientX - drag.startX;
    drag.active = false;
    if (Math.abs(dx) > 42) {
      drag.moved = true;
      onStep(dx < 0 ? 1 : -1);
    }
  }, [onStep]);

  const onClickCapture = React.useCallback((event) => {
    if (!dragRef.current.moved) return;
    event.preventDefault();
    event.stopPropagation();
    window.setTimeout(() => {
      dragRef.current.moved = false;
    }, 0);
  }, []);

  if (!total) return null;

  return (
    <div
      className="dress-feature-carousel"
      aria-label="Mini carrossel editorial de looks"
      onClickCapture={onClickCapture}
      onPointerCancel={onPointerEnd}
      onPointerDown={onPointerDown}
      onPointerLeave={onPointerEnd}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
    >
      {carouselItems.map(({ slot, item, index }) => item && (
        <button
          type="button"
          key={`${slot}-${item.id}`}
          className={`dress-feature-carousel__item dress-feature-carousel__item--${slot}`}
          onClick={() => {
            if (slot === "active") onOpen(item);
            else onStep(slot === "prev" ? -1 : 1);
          }}
          aria-label={slot === "active" ? `Abrir look ${item.title}` : slot === "prev" ? "Ver look anterior" : "Ver proximo look"}
        >
          <span className="dress-mini-card" style={{ "--accent": item.accent, "--dress-position": item.imagePosition, "--dress-mobile-position": item.mobilePosition || item.imagePosition }}>
            <img src={item.cardImage || item.gallery[0]} alt="" loading="eager" />
            <span className="dress-mini-card__veil" aria-hidden="true" />
            <span className="dress-mini-card__index">{String(((index % total) + total) % total + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
            <span className="dress-mini-card__copy">
              <em>{item.eyebrow}</em>
              <strong>{item.title}</strong>
              <span>Abrir look</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

function CategoriesSection() {
  const collections = clientConfig.dressCollections;
  const [collectionId, setCollectionId] = React.useState("madrinha-moda-festa");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [detailItem, setDetailItem] = React.useState(null);
  const [sectionRef, sectionInView] = useInViewport({ threshold: 0.24, rootMargin: "0px 0px -12% 0px" });
  const [motionReady, setMotionReady] = React.useState(false);

  const activeCollection = collections.find((collection) => collection.id === collectionId) || collections[0];
  const items = getCollectionItems(activeCollection.id);
  const active = items[activeIndex] || items[0];
  const activeBackground = active?.backgroundAsset || active?.backgroundImage || active?.gallery?.[0];
  const activeEditorial = active?.gallery?.[1] || activeBackground;
  React.useEffect(() => {
    if (!sectionInView) return undefined;
    const timeout = window.setTimeout(() => setMotionReady(true), 1180);
    return () => window.clearTimeout(timeout);
  }, [sectionInView]);

  const collectionStats = React.useMemo(() => {
    return collections.reduce((acc, collection) => {
      const categoryItems = clientConfig.dressItems.filter((item) => item.collectionId === collection.id);
      acc[collection.id] = {
        looks: categoryItems.length,
        photos: getUniqueGallery(categoryItems).length,
      };
      return acc;
    }, {});
  }, [collections]);
  const selectCollection = React.useCallback((nextCollectionId) => {
    setCollectionId(nextCollectionId);
    setActiveIndex(0);
  }, []);

  const openDetailItem = React.useCallback((nextItem) => {
    const nextItems = getCollectionItems(nextItem.collectionId);
    const nextIndex = nextItems.findIndex((dressItem) => dressItem.id === nextItem.id);
    const nextCollection = collections.find((collection) => collection.id === nextItem.collectionId);
    setCollectionId(nextItem.collectionId);
    setActiveIndex(nextIndex >= 0 ? nextIndex : 0);
    if (nextCollection && nextItems.length) {
      setDetailItem(buildCollectionAlbumItem(nextCollection, nextItems));
    } else {
      setDetailItem(nextItem);
    }
  }, [collections]);

  const openDetailAlbum = React.useCallback((nextCollectionId) => {
    const nextCollection = collections.find((collection) => collection.id === nextCollectionId);
    const nextItems = getCollectionItems(nextCollectionId);
    if (!nextCollection || !nextItems.length) return;
    setCollectionId(nextCollection.id);
    setActiveIndex(0);
    setDetailItem(buildCollectionAlbumItem(nextCollection, nextItems));
  }, [collections]);

  const selectDetailCollection = React.useCallback((nextCollectionId) => {
    if (detailItem?.isCollectionAlbum) {
      openDetailAlbum(nextCollectionId);
      return;
    }
    const nextItems = getCollectionItems(nextCollectionId);
    if (nextItems[0]) openDetailItem(nextItems[0]);
    else openDetailAlbum(nextCollectionId);
  }, [detailItem, openDetailAlbum, openDetailItem]);

  const closeDetail = React.useCallback(() => {
    setDetailItem(null);
  }, []);

  const goTo = React.useCallback((index) => {
    const length = items.length;
    if (!length) return;
    setActiveIndex(((index % length) + length) % length);
  }, [items.length]);

  const step = React.useCallback((direction) => {
    goTo(activeIndex + direction);
  }, [activeIndex, goTo]);

  if (!active) return null;

  return (
    <section
      ref={sectionRef}
      className={`dress-vitrine ${detailItem ? "is-modal-open" : ""} ${sectionInView ? "is-in-view" : ""} ${motionReady ? "is-motion-ready" : ""}`}
      id="vestidos"
      style={{
        "--dress-accent": active.accent,
        "--dress-position": active.imagePosition,
        "--dress-mobile-position": active.mobilePosition,
        "--image-position": active.backgroundPosition || active.imagePosition,
        "--image-mobile-position": active.backgroundMobilePosition || active.mobilePosition || active.imagePosition,
        "--editorial-position": active.backgroundPosition || active.imagePosition,
        "--editorial-mobile-position": active.backgroundMobilePosition || active.mobilePosition || active.imagePosition,
      }}
    >
      <div className="dress-atmosphere" aria-hidden="true">
        <img
          key={active.id}
          className="dress-atmosphere__image"
          src={activeBackground}
          alt=""
          loading="eager"
        />
        <span className="dress-atmosphere__shade" />
      </div>

      <div className="dress-editorial-figure" aria-hidden="true">
        <img
          key={`editorial-${active.id}`}
          src={activeEditorial}
          alt=""
          loading="eager"
        />
        <span className="dress-editorial-figure__shade" />
      </div>

      <div className="dress-vitrine-copy">
        <p className="kicker" key={`kicker-${activeCollection.id}`}>{activeCollection.eyebrow}</p>
        <h2 key={`headline-${activeCollection.id}`}>{activeCollection.headline}</h2>
        <p key={`body-${activeCollection.id}`}>{activeCollection.body}</p>

        <div className="dress-collection-tabs" aria-label="Filtrar vestidos por ocasiao">
          {collections.map((collection, index) => (
            <button
              key={collection.id}
              type="button"
              className={collection.id === collectionId ? "is-active" : ""}
              onClick={() => selectCollection(collection.id)}
              style={{ "--tab-accent": collection.accent, "--tab-index": index }}
            >
              <span className="dress-collection-tabs__icon" aria-hidden="true">
                {["noiva", "miss", "exclusivos"].includes(collection.id) ? <CrownIcon /> : <DressIcon />}
              </span>
              <strong>{collection.label}</strong>
              <span className="dress-collection-tabs__ornament" aria-hidden="true" />
              <small>{collectionStats[collection.id]?.photos || 0} fotos</small>
            </button>
          ))}
        </div>

        <div className="dress-readout" aria-live="polite" key={`readout-${active.id}`}>
          <span className="dress-readout__number">{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="dress-readout__divider" aria-hidden="true" />
          <span className="dress-readout__copy">
            <small>{String(items.length).padStart(2, "0")} looks nesta ocasiao</small>
            <strong>{active.title}</strong>
            <p>{active.shortDescription}</p>
          </span>
          <span className="dress-readout__texture" aria-hidden="true">
            <img src={activeBackground} alt="" loading="lazy" />
          </span>
        </div>

        <div className="dress-copy-actions">
          <button type="button" className="btn btn--primary" onClick={() => openDetailItem(active)}>
            <DressIcon />
            <span>Explorar criacao autoral</span>
            <ArrowIcon />
          </button>
          <button type="button" className="btn btn--outline" onClick={() => openDetailAlbum(activeCollection.id)}>
            <CrownIcon />
            <span>Abrir album completo</span>
            <ArrowIcon />
          </button>
          <SmartLink href={buildReservationUrl(active.whatsappContext)} className="btn btn--outline">
            <WhatsAppIcon />
            <span>Consultar disponibilidade</span>
            <ArrowIcon />
          </SmartLink>
        </div>
      </div>

      <div
        className="dress-feature"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") step(-1);
          if (event.key === "ArrowRight") step(1);
          if (event.key === "Enter") openDetailItem(active);
        }}
      >
        <div className="dress-feature-stage" role="group" aria-label={`Look em destaque: ${active.title}`} tabIndex={0}>
          <DressFeatureCarousel
            key={collectionId}
            items={items}
            activeIndex={activeIndex}
            onOpen={openDetailItem}
            onStep={step}
          />
        </div>
        <div className="dress-feature-controls" aria-label="Controles da vitrine">
          <button type="button" onClick={() => step(-1)} aria-label="Vestido anterior">
            <span aria-hidden="true">{"<"}</span>
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Proximo vestido">
            <span aria-hidden="true">{">"}</span>
          </button>
        </div>
      </div>

      <DressDetailDialog
        item={detailItem}
        onClose={closeDetail}
        collections={collections}
        collectionStats={collectionStats}
        dressItems={clientConfig.dressItems}
        activeCollectionId={detailItem?.collectionId || collectionId}
        onSelectCollection={selectDetailCollection}
        onSelectItem={openDetailItem}
        onOpenAlbum={openDetailAlbum}
      />
    </section>
  );
}

function AtelierSection() {
  const [sectionRef, sectionInView] = useInViewport({ threshold: 0.26, rootMargin: "0px 0px -10% 0px" });

  return (
    <section ref={sectionRef} className={`section atelier ${sectionInView ? "is-in-view" : ""}`} id="atelier">
      <div className="atelier-copy">
        <p className="kicker">Como reservar</p>
        <h2>Conheca os modelos com uma ideia clara do que voce quer.</h2>
        <p>O atendimento fica mais rapido quando voce chega com ocasiao, data, estilo e referencias. A vitrine guia esse primeiro contato e ajuda voce a visitar sem compromisso.</p>
        <div className="process-list">
          {clientConfig.process.map(([number, title, body], index) => (
            <article key={number} style={{ "--process-index": index }}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="atelier-reserve-cta">
          <span>Consulta direta pelo WhatsApp</span>
          <strong>Chegue ao atelie com data, estilo e referencias ja encaminhados.</strong>
          <SmartLink href={buildReservationUrl("consultar modelos para minha data")} className="btn btn--primary">
            <WhatsAppIcon />
            <span>Consultar modelos para minha data</span>
            <ArrowIcon />
          </SmartLink>
        </div>
      </div>
      <div className="atelier-stage" aria-hidden="true">
        <img className="stage-main" src={clientConfig.assets.silver} alt="" />
        <img className="stage-float stage-float--one" src={clientConfig.assets.blue} alt="" />
        <img className="stage-float stage-float--two" src={clientConfig.assets.reserveHorizontal} alt="" />
      </div>
    </section>
  );
}

function GallerySection() {
  const gallery = getUniqueGallery(clientConfig.dressItems);
  const fallbackGallery = [clientConfig.assets.red, clientConfig.assets.green, clientConfig.assets.sash, clientConfig.assets.blue, clientConfig.assets.lilac, clientConfig.assets.silver];
  const galleryBase = gallery.length ? gallery : fallbackGallery;
  const galleryLoop = [...galleryBase, ...galleryBase, ...galleryBase];
  return (
    <div className="gallery-band" role="region" aria-label="Galeria inicial">
      <div className="gallery-track">
        {galleryLoop.map((src, index) => (
          <img key={`${src}-${index}`} src={src} alt="" loading="lazy" />
        ))}
      </div>
    </div>
  );
}

function LocationSection() {
  const [sectionRef, sectionInView] = useInViewport({ threshold: 0.22, rootMargin: "0px 0px -10% 0px" });

  return (
    <section ref={sectionRef} className={`section location ${sectionInView ? "is-in-view" : ""}`} id="localizacao">
      <GallerySection />
      <div className="location-inner">
        <div className="location-copy">
          <p className="kicker">Visita presencial</p>
          <h2>Chegue ao atelie com direcao.</h2>
          <p>Abra a rota, envie sua ocasiao e chegue para conhecer os modelos com atendimento objetivo.</p>
        </div>
        <div className="location-panel">
          <LocationActions />
          <div className="location-final">
            <div>
              <span>Atendimento pelo WhatsApp</span>
              <h3>Conheca vestidos para a sua data.</h3>
              <p>Informe data, ocasiao e estilo para visitar sem compromisso.</p>
            </div>
            <div className="location-final__actions">
              <CtaButton context="cta final">Visitar sem compromisso</CtaButton>
              <SmartLink href={clientConfig.whatsappUrl} className="btn btn--ghost">
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </SmartLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcasePage() {
  useAnchorNavigation();

  React.useEffect(() => {
    document.title = "Atelier Kaleb Aguiar | Vitrine Premium";
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  }, []);

  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <CategoriesSection />
        <AtelierSection />
        <LocationSection />
      </main>
    </>
  );
}

function LinkAction({ item }) {
  return (
    <SmartLink href={buildReservationUrl(item.label)} className="flyer-card" style={{ "--accent": item.accent }} aria-label={`${item.title} pelo WhatsApp`}>
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

function OccasionShowcase({ items }) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const railRef = React.useRef(null);
  const active = items[activeIndex] || items[0];
  const goTo = React.useCallback((index) => {
    const length = items.length;
    setActiveIndex(((index % length) + length) % length);
  }, [items.length]);
  const shift = React.useCallback((step) => {
    goTo(activeIndex + step);
  }, [activeIndex, goTo]);

  React.useEffect(() => {
    const rail = railRef.current;
    const activeTile = rail?.querySelector('[aria-selected="true"]');
    if (!rail || !activeTile) return;

    const targetLeft = activeTile.offsetLeft - rail.offsetLeft - ((rail.clientWidth - activeTile.clientWidth) / 2);
    const maxLeft = rail.scrollWidth - rail.clientWidth;
    rail.scrollTo({
      left: Math.max(0, Math.min(targetLeft, maxLeft)),
      behavior: "smooth",
    });
  }, [activeIndex]);

  return (
    <section
      className="occasion-showcase"
      id="flyer-estilos"
      aria-label="Escolher estilo de vestido"
      style={{
        "--occasion-accent": active.accent,
        "--occasion-position": active.imagePosition,
        "--occasion-mobile-position": active.mobilePosition,
      }}
    >
      <div className="occasion-bg-stack" aria-hidden="true">
        {items.map((item, index) => (
          <img
            key={item.id}
            src={item.image}
            alt=""
            className={index === activeIndex ? "is-active" : ""}
            loading={index < 2 ? "eager" : "lazy"}
            style={{ "--image-position": item.imagePosition }}
          />
        ))}
      </div>

      <div className="occasion-editorial" key={`copy-${active.id}`}>
        <p className="flyer-kicker">Escolha sua ocasiao</p>
        <h2>Encontre o vestido ideal.</h2>
        <div className="occasion-count">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <i />
          <span>{String(items.length).padStart(2, "0")}</span>
        </div>
        <strong>{active.eyebrow}</strong>
        <p>{active.body}</p>
        <SmartLink href={buildReservationUrl(active.label)} className="btn btn--primary">
          <CrownIcon />
          <span>{active.title}</span>
        </SmartLink>
      </div>

      <div className="occasion-visual" aria-live="polite">
        <button className="occasion-nav occasion-nav--prev" type="button" onClick={() => goTo(activeIndex - 1)} aria-label="Vestido anterior">
          <span aria-hidden="true">‹</span>
        </button>
        <div className="occasion-stage" key={active.id}>
          <img src={active.image} alt={active.title} loading="eager" />
          <div className="occasion-stage-shade" aria-hidden="true" />
          <div className="occasion-stage-copy">
            <span>{active.eyebrow}</span>
            <h2>{active.label}</h2>
            <SmartLink href={buildReservationUrl(active.label)}>
              {active.title}
              <ArrowIcon />
            </SmartLink>
          </div>
        </div>
        <button className="occasion-nav occasion-nav--next" type="button" onClick={() => goTo(activeIndex + 1)} aria-label="Proximo vestido">
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div
        ref={railRef}
        className="occasion-rail"
        role="listbox"
        aria-label="Ocasiões"
      >
        <button
          className="occasion-rail-cue occasion-rail-cue--prev"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            shift(-1);
          }}
          aria-label="Puxar carrossel para a esquerda"
        >
          <span aria-hidden="true">‹</span>
        </button>
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              type="button"
              className={`occasion-tile ${isActive ? "is-active" : ""}`}
              style={{
                "--accent": item.accent,
                "--delay": `${index * 55}ms`,
                "--tile-position": item.tilePosition,
              }}
              onClick={() => goTo(index)}
              onFocus={() => goTo(index)}
              aria-label={`Ver ${item.label}`}
              aria-selected={index === activeIndex}
              role="option"
            >
              <img src={item.image} alt="" loading={index < 3 ? "eager" : "lazy"} />
              <span className="occasion-tile-glow" aria-hidden="true" />
              <span className="occasion-tile-copy">
                <em>{item.eyebrow}</em>
                <strong>{item.label}</strong>
              </span>
            </button>
          );
        })}
        <button
          className="occasion-rail-cue occasion-rail-cue--next"
          type="button"
          onPointerDown={(event) => event.stopPropagation()}
          onPointerUp={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.stopPropagation();
            shift(1);
          }}
          aria-label="Puxar carrossel para a direita"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>
    </section>
  );
}

function LinkPage() {
  React.useEffect(() => {
    document.title = "Atelier Kaleb Aguiar | Links";
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }));
  }, []);

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
      <article className="flyer-poster" aria-label="Linkpage premium Atelier Kaleb Aguiar">
        <section className="flyer-hero">
          <div className="flyer-hero-image" aria-hidden="true">
            <img className="flyer-hero-poster" src="/assets/kaleb-aguiar/hero-section-red-crown-final.png" alt="" />
            <img className="flyer-hero-mobile-bg flyer-hero-mobile-bg--boi" src={clientConfig.assets.heroMobileBoi} alt="" />
            <img className="flyer-hero-mobile-bg flyer-hero-mobile-bg--nicole" src={clientConfig.assets.heroMobileNicole} alt="" />
            <video
              src="/assets/kaleb-aguiar/kaleb-link-hero-editorial.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate nofullscreen"
              preload="auto"
            />
          </div>

          <header className="flyer-top">
            <KalebTypemark />
          </header>

          <div className="flyer-copy">
            <p className="flyer-kicker">Atelie em Manaus</p>
            <h1>
              Vestidos que<br />
              <span>transformam</span><br />
              ocasioes em<br />
              <span>memoria</span>
            </h1>
            <i className="flyer-divider" aria-hidden="true" />
            <p className="flyer-support-copy">Conheca os modelos, tire duvidas e visite o atelie sem compromisso antes de decidir.</p>
            <div className="flyer-cta-stack">
              <SocialLinks />
              <CtaButton context="linkpage principal">Visite o atelie sem compromisso</CtaButton>
              <a className="btn btn--outline" href="#flyer-estilos">
                <span>Ver vestidos disponiveis</span>
                <ArrowIcon />
              </a>
            </div>
            <div className="flyer-proof-strip" aria-label="Diferenciais principais">
              {clientConfig.proof.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>

          <a className="flyer-scroll-cue" href="#flyer-estilos" aria-label="Descer para escolher estilos">
            <span aria-hidden="true">↓</span>
          </a>

          <aside className="flyer-side-rail" aria-hidden="true">
            <span>Exclusividade</span>
            <span>Atelie</span>
            <span>Sob medida</span>
          </aside>
        </section>

        <OccasionShowcase items={clientConfig.linkpageCategories} />

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

        <section className="flyer-bridge" aria-label="Vitrine completa Atelier Kaleb Aguiar">
          <div>
            <p className="flyer-kicker">Vitrine completa</p>
            <h2>Veja a experiencia completa antes de visitar.</h2>
          </div>
          <SmartLink href="/" className="btn btn--outline">
            <span>Entrar na vitrine</span>
            <ArrowIcon />
          </SmartLink>
        </section>

        <section className="flyer-location">
          <h2>Como chegar ao atelie</h2>
          <p>{clientConfig.contactNote}</p>
          <LocationActions compact />
        </section>
      </article>
    </main>
  );
}

export function App() {
  const pathname = usePathname();
  if (pathname === "/links") return <LinkPage />;
  if (pathname === "/" || pathname === "/vitrine") return <ShowcasePage />;
  return <ShowcasePage />;
}
