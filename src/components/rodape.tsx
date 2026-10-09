import { ESCOLA, linkWhatsApp } from "@/marca";
import { MENU, linkMenu, type Pagina } from "./navbar";
import { useIdioma } from "@/idioma";
import Botao from "./botao";

const telefone = (n: string) => `(${n.slice(2, 4)}) ${n.slice(4, 9)}-${n.slice(9)}`;

/**
 * Rodapé da North: frase grande e o WhatsApp à esquerda, colunas no meio,
 * tudo separado por linhas finas sobre o escuro, de borda a borda.
 */
export default function Rodape({ pagina = "inicio" }: { pagina?: Pagina }) {
  const { t } = useIdioma();
  const coluna = "text-[12px] font-bold uppercase tracking-[0.14em]";
  return (
    <footer id="contato" className="escuro border-t border-white/20">
      <div className="shell grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.2fr_2fr] lg:gap-20">
        <div>
          <p className="titulo text-[2.5rem] sm:text-[3.4rem]">
            {t("Vem pra TS.", "Come ride")} <span className="suave">{t("A água te espera.", "with TS.")}</span>
          </p>
          <p className="mt-5 max-w-sm leading-relaxed text-white/80">
            {t("Aprenda kitesurf com quem vive isso todos os dias.", "Learn kitesurfing with locals who live it every day.")}
          </p>
          <Botao href={linkWhatsApp(t("Olá! Vim pelo site da TS Kite Center.", "Hi! I found TS Kite Center through the website."))} externo className="mt-8">
            {t("Chamar no WhatsApp", "Message us on WhatsApp")}
          </Botao>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div>
            <p className={coluna}>{t("Navegação", "Navigation")}</p>
            <ul className="mt-5 space-y-3 text-[15px] text-white/80">
              {MENU.map((l) => (
                <li key={l.href}>
                  <a href={linkMenu(l.href, pagina)} className="transition-colors hover:text-white">
                    {t(l.pt, l.en)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={coluna}>{t("Contato", "Contact")}</p>
            <ul className="mt-5 space-y-3 text-[15px] text-white/80 [overflow-wrap:anywhere]">
              {ESCOLA.whatsapps.map((n) => (
                <li key={n}>
                  <a href={`https://wa.me/${n}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                    {telefone(n)}
                  </a>
                </li>
              ))}
              <li>
                <a href={ESCOLA.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  @tskitecenter
                </a>
              </li>
              <li>
                <a href={ESCOLA.loja} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">
                  @tskiteshop_cumbuco
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className={coluna}>{t("Endereço", "Address")}</p>
            <p className="mt-5 text-[15px] leading-relaxed text-white/80">
              Outro Beach Club
              <br />
              Av. Des. Jurema, 56
              <br />
              {t("Praia do Cumbuco", "Cumbuco Beach")}
              <br />
              {t("Caucaia (CE)", "Caucaia, Ceará, Brazil")}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="shell flex flex-col gap-4 py-6 text-sm text-white/85 sm:flex-row sm:items-center sm:justify-between">
          <a href={pagina === "inicio" ? "#inicio" : "/"} className="flex items-center gap-2.5 text-white">
            <img src="/logo-ts.png" alt="" width={28} height={28} loading="lazy" className="h-7 w-7 rounded-full" />
            <span className="font-semibold tracking-[-0.03em]">TS Kite Center</span>
          </a>
          <p>© {new Date().getFullYear()} TS Kite Center. {t("Todos os direitos reservados.", "All rights reserved.")}</p>
          <p>{t("Desenvolvido por MF Services", "Built by MF Services")}</p>
        </div>
      </div>
    </footer>
  );
}
