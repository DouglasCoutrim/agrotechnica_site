import type { Settings, Section, Service, Product, Testimonial, Faq, PortfolioItem } from "./types";
type Team = import("./types").TeamMember;

/** Conteúdo inicial. Aparece enquanto o banco está vazio e some assim que o admin cadastra o real. */
export const defaultSettings: Settings = {
  company_name: "Agrotechnica",
  tagline: "Tecnologia e soluções no agro",
  whatsapp_number: "5561996275673",
  address: "Cristalina - GO", city: "Cristalina", state: "GO",
  maps_link: "https://share.google/qmnPxXPDPBWfZUeOq",
  instagram_url: "https://www.instagram.com/agro.technica",
  opening_hours: [
    { dia: "Segunda a sexta", horario: "08h às 18h" },
    { dia: "Sábado", horario: "08h às 12h" },
  ],
};

export const defaultWhatsApp: Record<string, string> = {
  "/": "Olá! Vim pelo site da Agrotechnica e gostaria de falar com um especialista.",
  "/servicos/*": "Olá! Vi um serviço no site da Agrotechnica e quero um orçamento.",
  "/pecas": "Olá! Estou procurando uma peça para meu drone. Podem me ajudar?",
  "/pecas/*": "Olá! Vi um produto no site da Agrotechnica e quero um orçamento.",
  "/gps-piloto-automatico": "Olá! Quero saber mais sobre piloto automático e sinal RTK.",
  "/promocoes": "Olá! Vi as promoções no site e quero aproveitar.",
};

export const defaultSections: Record<string, Section> = {
  "home.hero": {
    eyebrow: "Cristalina, Goiás",
    title: "Seu drone parado custa safra. A gente põe ele de volta no ar.",
    subtitle:
      "Peças originais XAG e DJI, manutenção de drones, baterias e geradores, e sinal RTK de 2 cm. Técnicos certificados em cada marca.",
    cta_label: "Solicitar orçamento", cta_url: "/contato",
    extra: { secondary_label: "Ver serviços", secondary_url: "/servicos" },
  },
  "home.diferenciais": {
    title: "Por que o produtor traz o drone para a Agrotechnica",
    extra: {
      items: [
        { t: "Peças originais", d: "Procedência garantida em peças XAG e DJI, com pronta entrega." },
        { t: "Técnicos certificados", d: "Formação em nível especialista em cada marca que atendemos." },
        { t: "Bateria que outros desistiram", d: "Desbloqueio, equalização e recuperação de fusíveis em baterias DJI Agras e XAG." },
        { t: "Atendimento de quem entende de agro", d: "Falamos a língua da safra e sabemos o custo de uma máquina parada." },
      ],
    },
  },
  "home.baterias": {
    eyebrow: "Nosso diferencial",
    title: "Se a bateria não voltou na Agrotechnica, não tem mais salvação.",
    body: "É o que os clientes dizem. Recuperamos baterias DJI Agras e XAG que outras oficinas descartam: desbloqueio, equalização de células, recuperação de fusíveis e diagnóstico completo.",
    cta_label: "Orçar manutenção de bateria", cta_url: "/servicos/manutencao-de-baterias",
  },
  "home.gps": {
    eyebrow: "GPS agrícola",
    title: "Precisão de 2 cm na linha de plantio. Pague só pelo que usar.",
    body: "Sinal RTK para as linhas Topcon e Trimble e Starpoint PRO com precisão de até 2,5 cm. Sem anuidade forçada na entressafra.",
    cta_label: "Conhecer o piloto automático", cta_url: "/gps-piloto-automatico",
  },
  "home.cta": {
    title: "Conte o que está acontecendo com seu equipamento.",
    subtitle: "Um especialista responde pelo WhatsApp e indica o melhor caminho.",
    cta_label: "Chamar no WhatsApp",
  },
  "sobre.historia": {
    title: "Suporte e inovação tecnológica para quem produz",
    body:
      "A Agrotechnica nasceu para levar suporte técnico e inovação ao agronegócio. Revendemos peças para drones XAG e DJI e fazemos manutenção de drones de todas as marcas, além de geradores DJI e de outras marcas.\n\nCada setor tem técnicos especializados. Nosso diferencial é a oficina de baterias DJI Agras e XAG, onde fazemos desbloqueio, equalização, recuperação de fusíveis e mais.\n\nSeu drone merece peças originais e a confiança de quem entende do agro.",
  },
};

export const defaultServices: Service[] = [
  {
    slug: "manutencao-de-baterias", placeholder: "bateria",
    title: "Manutenção de baterias DJI Agras e XAG",
    short_description: "Desbloqueio, equalização e recuperação de fusíveis. A bateria que outros desistiram.",
    body: "Baterias de drones agrícolas são o item mais caro de repor. Nossa oficina faz o diagnóstico completo e recupera o que for possível, com testes antes e depois da entrega.",
    features: ["Desbloqueio de bateria", "Equalização de células", "Recuperação de fusíveis", "Diagnóstico com relatório"],
  },
  {
    slug: "manutencao-de-drones", placeholder: "drone",
    title: "Manutenção de drones agrícolas",
    short_description: "DJI, XAG e Eavision, com técnicos certificados em cada marca.",
    body: "Atendemos drones pulverizadores e de mapeamento, de todas as marcas. Revisão preventiva, troca de motores, bombas, ESCs, bicos e estruturas.",
    features: ["Revisão preventiva", "Troca de motores, bombas e ESCs", "Calibração de sensores", "Técnicos certificados"],
  },
  {
    slug: "manutencao-de-geradores", placeholder: "oficina",
    title: "Manutenção de geradores",
    short_description: "Geradores DJI e de outras marcas, para a operação não parar no campo.",
    body: "Revisão e reparo de geradores usados na recarga de baterias em campo.",
    features: ["Geradores DJI e outras marcas", "Revisão e reparo", "Peças originais"],
  },
  {
    slug: "sinal-rtk", placeholder: "gps",
    title: "Sinal RTK e piloto automático",
    short_description: "Precisão de 2 cm para Topcon e Trimble. Pague só pelo consumo.",
    body: "Venda e ativação de sinal RTK, telas, receptores e linha completa de pilotos automáticos Topcon.",
    features: ["Sinal RTK de 2 cm", "Linhas Topcon e Trimble", "Starpoint PRO de até 2,5 cm", "Ativação imediata"],
  },
];

export const defaultProducts: Product[] = [
  { slug: "bateria-dji-agras", name: "Bateria DJI Agras", brand: "DJI", category: "Baterias", placeholder: "bateria", image_url: "/brand/bateria-dji.jpg", in_stock: true, description: "Bateria original para drones DJI Agras. Consulte o modelo compatível com seu equipamento." },
  { slug: "helices-xag", name: "Hélices XAG", brand: "XAG", category: "Hélices", placeholder: "drone", in_stock: true, description: "Hélices originais para drones agrícolas XAG." },
  { slug: "bomba-de-pulverizacao", name: "Bomba de pulverização", brand: "XAG", category: "Bombas", placeholder: "oficina", in_stock: true, description: "Bomba original para sistema de pulverização." },
  { slug: "motores-dji", name: "Motores DJI", brand: "DJI", category: "Motores", placeholder: "drone", in_stock: true, description: "Motores originais para linha DJI Agras." },
  { slug: "escs-e-modulos", name: "ESCs e módulos", brand: "XAG", category: "Eletrônica", placeholder: "oficina", in_stock: true, description: "ESCs, sensores e módulos originais." },
  { slug: "bicos-de-pulverizacao", name: "Bicos de pulverização", brand: "DJI", category: "Bicos", placeholder: "campo", in_stock: true, description: "Bicos originais, inclusive de duas camadas." },
];

export const defaultTestimonials: Testimonial[] = [
  { author: "Cliente da Agrotechnica", role: "Produtor rural", content: "Levei a bateria em duas oficinas e nenhuma resolveu. Na Agrotechnica voltou funcionando." },
  { author: "Cliente da Agrotechnica", role: "Prestador de serviço com drone", content: "Peça original e entrega rápida. Não perdi a janela de aplicação." },
  { author: "Cliente da Agrotechnica", role: "Operador de drone", content: "Atendimento de quem entende. Explicaram o problema do começo ao fim." },
];

export const defaultFaqs: Faq[] = [
  { question: "As peças são originais?", answer: "Sim. Trabalhamos com peças originais XAG e DJI, com procedência." },
  { question: "Vocês consertam baterias bloqueadas?", answer: "Sim. Fazemos desbloqueio, equalização de células e recuperação de fusíveis em baterias DJI Agras e XAG." },
  { question: "Atendem drones de outras marcas?", answer: "Fazemos manutenção de drones de todas as marcas, com suporte especializado em XAG, DJI e Eavision." },
  { question: "Como funciona o sinal RTK?", answer: "Você paga apenas pelo que consumir, sem anuidade forçada na entressafra. Atendemos as linhas Topcon e Trimble com precisão de 2 cm." },
  { question: "Como peço um orçamento?", answer: "Pelo WhatsApp ou pelo formulário de contato. Dizendo a marca e o modelo, respondemos mais rápido." },
];

export const defaultTeam: Team[] = [
  { name: "Equipe técnica", role: "Manutenção de drones", bio: "Técnicos com formação em nível especialista em cada marca.", certifications: ["DJI", "XAG", "Eavision"] },
  { name: "Oficina de baterias", role: "Recuperação de baterias", bio: "Setor dedicado a baterias DJI Agras e XAG.", certifications: ["DJI Agras", "XAG"] },
];

export const defaultPortfolio: PortfolioItem[] = [
  { slug: "bateria-recuperada", title: "Bateria DJI Agras recuperada", category: "Baterias", description: "Bateria bloqueada, com fusíveis queimados, devolvida em operação.", image_url: null },
  { slug: "revisao-completa", title: "Revisão completa de drone", category: "Drones", description: "Troca de motores e calibração de sensores.", image_url: null },
  { slug: "ativacao-rtk", title: "Ativação de sinal RTK", category: "GPS", description: "Piloto automático Topcon com sinal de 2 cm.", image_url: null },
];
