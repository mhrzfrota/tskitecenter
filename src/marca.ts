/**
 * Dados da escola num lugar só. Fonte: briefing de 2026-09-27
 * (Instagram @tskitecenter e TripAdvisor).
 */
export const ESCOLA = {
  nome: "TS Kite Center",
  instagram: "https://www.instagram.com/tskitecenter",
  loja: "https://www.instagram.com/tskiteshop_cumbuco",
  endereco: "Av. Des. Jurema, 56, Praia do Cumbuco, Caucaia (CE)",
  // Os dois números do briefing. O primeiro é o que os botões usam.
  whatsapps: ["5585986041912", "5585997711757"],
};

export function linkWhatsApp(mensagem: string) {
  return `https://wa.me/${ESCOLA.whatsapps[0]}?text=${encodeURIComponent(mensagem)}`;
}

// Ponto de referência para a leitura do vento: praia do Cumbuco, Caucaia (CE)
export const CUMBUCO = { lat: -3.627, lon: -38.728 };
