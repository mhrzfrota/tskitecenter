import { ESCOLA, linkWhatsApp } from "@/marca";
import { MENU, linkMenu, type Pagina } from "./navbar";
import { useIdioma } from "@/idioma";
import Botao from "./botao";

const telefone = (n: string) => `(${n.slice(2, 4)}) ${n.slice(4, 9)}-${n.slice(9)}`;

/** Rodapé em painel escuro arredondado, com margem, como na referência. */
export default function Rodape({ pagina = "inicio" }: { pagina?: Pagina }) {
  const { t } = useIdioma();
  return (
    <footer id="contato" className="p-2 sm:p-3">
      <div className="rounded-painel bg-mar px-6 pb-8 pt-10 text-white sm:px-10 sm:pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <a href={pagina === "inicio" ? "#inicio" : "/"} className="flex items-center gap-2.5">
              <img src="/logo-ts.png" alt="" width={36} height={36} loading="lazy" className="h-9 w-9 rounded-full" />
              <span className="text-xl font-medium tracking-[-0.04em]">TS Kite Center</span>
            </a>
            <p className="mt-5 max-w-sm leading-relaxed text-white/85">
              {t("Aprenda kitesurf com quem vive isso todos os dias. Vem pra TS.", "Learn kitesurfing with locals who live it every day. Come ride with TS.")}
            </p>
            <Botao href={linkWhatsApp(t("Olá! Vim pelo site da TS Kite Center.", "Hi! I found TS Kite Center through the website."))} externo className="mt-7">
              {t("Chamar no WhatsApp", "Message us on WhatsApp")}
            </Botao>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-sol">{t("Navegação", "Navigation")}</p>
              <ul className="mt-5 space-y-3 text-white/80">
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
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-sol">{t("Contato", "Contact")}</p>
              <ul className="mt-5 space-y-3 text-white/80 [overflow-wrap:anywhere]">
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
              <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-sol">{t("Endereço", "Address")}</p>
              <p className="mt-5 leading-relaxed text-white/80">
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

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} TS Kite Center. {t("Todos os direitos reservados.", "All rights reserved.")}</p>
          <p>{t("Desenvolvido por MF Services", "Built by MF Services")}</p>
        </div>
      </div>
    </footer>
  );
}
