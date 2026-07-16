import React from "react";

function ensureMeta(name) {
  const existing = document.head.querySelector(`meta[name="${name}"]`);
  if (existing) return { element: existing, created: false };

  const element = document.createElement("meta");
  element.setAttribute("name", name);
  document.head.appendChild(element);
  return { element, created: true };
}

export function usePageMetadata({
  title,
  description,
  robots = "index, follow",
  canonicalPath,
}) {
  React.useEffect(() => {
    const previousTitle = document.title;
    const descriptionMeta = ensureMeta("description");
    const robotsMeta = ensureMeta("robots");
    const previousDescription = descriptionMeta.element.getAttribute("content");
    const previousRobots = robotsMeta.element.getAttribute("content");
    const existingCanonical = document.head.querySelector('link[rel="canonical"]');
    const previousCanonicalHref = existingCanonical?.getAttribute("href") ?? null;
    let canonicalElement = existingCanonical;
    let canonicalWasRemoved = false;
    let canonicalWasCreated = false;

    document.title = title;
    descriptionMeta.element.setAttribute("content", description);
    robotsMeta.element.setAttribute("content", robots);

    if (canonicalPath) {
      if (!canonicalElement) {
        canonicalElement = document.createElement("link");
        canonicalElement.setAttribute("rel", "canonical");
        document.head.appendChild(canonicalElement);
        canonicalWasCreated = true;
      }
      canonicalElement.setAttribute("href", new URL(canonicalPath, window.location.origin).href);
    } else if (canonicalPath === null && canonicalElement) {
      canonicalElement.remove();
      canonicalWasRemoved = true;
    }

    return () => {
      document.title = previousTitle;

      if (descriptionMeta.created) {
        descriptionMeta.element.remove();
      } else if (previousDescription === null) {
        descriptionMeta.element.removeAttribute("content");
      } else {
        descriptionMeta.element.setAttribute("content", previousDescription);
      }

      if (robotsMeta.created) {
        robotsMeta.element.remove();
      } else if (previousRobots === null) {
        robotsMeta.element.removeAttribute("content");
      } else {
        robotsMeta.element.setAttribute("content", previousRobots);
      }

      if (canonicalWasCreated) {
        canonicalElement?.remove();
      } else if (canonicalWasRemoved && existingCanonical) {
        if (previousCanonicalHref !== null) {
          existingCanonical.setAttribute("href", previousCanonicalHref);
        }
        document.head.appendChild(existingCanonical);
      } else if (canonicalElement && previousCanonicalHref !== null) {
        canonicalElement.setAttribute("href", previousCanonicalHref);
      }
    };
  }, [canonicalPath, description, robots, title]);
}
