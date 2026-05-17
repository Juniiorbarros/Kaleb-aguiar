const image = (name) => `/assets/kaleb-aguiar/${name}`;

export const clientConfig = {
  brand: "Kaleb Aguiar",
  descriptor: "Designer de moda",
  handle: "@kaleb_aguiar",
  instagramUrl: "https://www.instagram.com/kaleb_aguiar/",
  fallbackContactUrl: "https://www.instagram.com/kaleb_aguiar/",
  phoneDisplay: "WhatsApp a confirmar",
  contactMode: "instagram",
  contactNote: "Atendimento inicial pelo Instagram ate confirmacao do WhatsApp oficial.",
  city: "Manaus, AM",
  address: "Rua Rio Purus, 1078, Vieiralves, Manaus - AM, 69053-050",
  addressShort: "Rua Rio Purus, 1078 - Vieiralves",
  promise: "Reserve o vestido da sua grande entrada.",
  positioning: "Aluguel exclusivo para debutantes, madrinhas e formandas em Manaus. Escolha sua ocasiao, agende a prova e receba atendimento sob medida no atelie.",
  proof: ["Aluguel exclusivo", "Prova em Vieiralves", "Debutantes | Madrinhas | Formandas"],
  assets: {
    logo: image("kaleb-logo.jpeg"),
    hero: image("hero-debutante-roxo-escadaria.png"),
    heroMobileBoi: image("vestido-boi-mobile-bg.png"),
    heroMobileNicole: image("vestido-nicole-mobile-bg-clean.png"),
    green: image("vestido-verde-plumas-corredor.png"),
    red: image("vestido-vermelho-fenda.png"),
    blue: image("figurino-azul-palco.png"),
    sash: image("vestido-verde-faixa.png"),
    lilac: image("vestido-lilas-baloes.png"),
    silver: image("vestido-prata-noite.png"),
  },
  links: {
    maps: "https://www.google.com/maps/search/?api=1&query=Rua%20Rio%20Purus%2C%201078%2C%20Vieiralves%2C%20Manaus%20AM%2069053-050",
    uber: "https://m.uber.com/ul/?action=setPickup&dropoff[formatted_address]=Rua%20Rio%20Purus%2C%201078%2C%20Vieiralves%2C%20Manaus%20AM%2069053-050",
  },
  categories: [
    {
      id: "debutante",
      label: "Debutante",
      eyebrow: "15 anos",
      title: "Ver vestidos de debutante",
      body: "Vestidos com volume, brilho e presenca para sua entrada principal.",
      image: image("hero-debutante-roxo-escadaria.png"),
      accent: "var(--rose)",
    },
    {
      id: "madrinha",
      label: "Madrinha",
      eyebrow: "Casamentos",
      title: "Ver vestidos de madrinha",
      body: "Modelos elegantes para cerimônia, fotos e festa sem perder conforto.",
      image: image("vestido-verde-plumas-corredor.png"),
      accent: "var(--jade)",
    },
    {
      id: "formatura",
      label: "Formatura",
      eyebrow: "Colacao e baile",
      title: "Ver vestidos de formatura",
      body: "Bordados, fendas e silhuetas de impacto para celebrar sua conquista.",
      image: image("vestido-vermelho-fenda.png"),
      accent: "var(--ruby)",
    },
    {
      id: "noiva",
      label: "Noiva",
      eyebrow: "Cerimonia",
      title: "Consultar vestidos de noiva",
      body: "Opcoes para quem procura uma peca delicada, marcante e fotografavel.",
      image: image("vestido-prata-noite.png"),
      accent: "var(--ivory)",
    },
    {
      id: "palco",
      label: "Exclusivos",
      eyebrow: "Modelos especiais",
      title: "Ver modelos exclusivos",
      body: "Pecas de impacto para ensaios, eventos, palco e producoes especiais.",
      image: image("figurino-azul-palco.png"),
      accent: "var(--sapphire)",
    },
    {
      id: "prova",
      label: "Prova",
      eyebrow: "Atendimento",
      title: "Agendar prova no atelie",
      body: "Fale sua data, estilo e tamanho. O atendimento direciona os melhores modelos.",
      image: image("vestido-lilas-baloes.png"),
      accent: "var(--violet)",
    },
  ],
  process: [
    ["01", "Diga sua data", "Informe o evento, horario e tipo de vestido que procura."],
    ["02", "Escolha o estilo", "Envie referencias de cor, brilho, volume e caimento."],
    ["03", "Agende a prova", "O atelie separa opcoes antes da sua visita."],
    ["04", "Reserve o modelo", "Gostou do vestido? Saia com a data encaminhada."],
  ],
};

export function buildReservationUrl(context = "") {
  const message = context
    ? `Ola, Kaleb Aguiar. Vim pelo site e quero agendar uma prova para: ${context}.`
    : "Ola, Kaleb Aguiar. Vim pelo site e quero agendar uma prova.";
  return `${clientConfig.instagramUrl}?utm_source=site&utm_medium=cta&utm_campaign=${encodeURIComponent(message)}`;
}
