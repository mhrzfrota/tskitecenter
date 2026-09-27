import { ESCOLA, linkWhatsApp } from "@/marca";
import { MENU } from "./navbar";
import { IconeInstagram, IconeWhatsApp } from "./icones";

const telefone = (n: string) => `(${n.slice(2, 4)}) ${n.slice(4, 9)}-${n.slice(9)}`;

export default function Rodape() {
  return (
    <footer id="contato" className="bg-mar pb-10 pt-14 text-white">
      <div className="shell">
        <div className="grid gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr_1fr_1.2fr] lg:gap-12">
          <img src="/logo-ts.png" alt="TS Kite Center" width={120} height={120} loading="lazy" className="h-28 w-28 rounded-full" />

          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em]">TS Kite Center</p>
            <ul className="mt-5 space-y-2.5 text-sm tracking-normal text-bruma">
              {MENU.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-white">
                    {l.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sol">Contato</p>
            <ul className="mt-5 space-y-2.5 text-sm tracking-normal text-bruma">
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
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-sol">Endereço</p>
            <p className="mt-5 text-sm leading-relaxed tracking-normal text-bruma">
              Outro Beach Club
              <br />
              Av. Des. Jurema, 56
              <br />
              Praia do Cumbuco, Caucaia (CE)
            </p>
          </div>

          <p className="text-sm font-medium uppercase leading-relaxed tracking-[0.2em] sm:col-span-2 lg:col-span-1 lg:text-right">
            "Aprenda kitesurf com quem vive isso todos os dias."
          </p>
        </div>

        <div className="flex flex-col gap-6 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs tracking-normal text-bruma">
            © {new Date().getFullYear()} TS Kite Center. Todos os direitos reservados. Desenvolvido por MF Services.
          </p>
          <div className="flex gap-2">
            <a href={ESCOLA.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center transition-colors hover:text-sol">
              <IconeInstagram />
            </a>
            <a href={linkWhatsApp("Olá! Vim pelo site da TS Kite Center.")} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="flex h-11 w-11 items-center justify-center transition-colors hover:text-sol">
              <IconeWhatsApp />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
