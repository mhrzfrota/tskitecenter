/**
 * Dados da escola num lugar só.
 *
 * FALTA confirmar com o cliente: número do WhatsApp e @ do Instagram.
 * Enquanto não vierem, o link abre o WhatsApp sem destinatário.
 */
export const WHATSAPP = ""; // ex.: "5585999999999"

export function linkWhatsApp(mensagem: string) {
  const texto = encodeURIComponent(mensagem);
  return WHATSAPP ? `https://wa.me/${WHATSAPP}?text=${texto}` : `https://wa.me/?text=${texto}`;
}

// Ponto de referência para a leitura do vento: praia do Cumbuco, Caucaia (CE)
export const CUMBUCO = { lat: -3.627, lon: -38.728 };
