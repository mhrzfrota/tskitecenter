import { useEffect, useState } from "react";
import { linkWhatsApp } from "@/marca";

const LINKS = [
  { href: "#aulas", rotulo: "Aulas" },
  { href: "#spot", rotulo: "O spot" },
];

export default function Navbar() {
  // Transparente sobre o hero, ganha fundo quando a página rola
  const [rolou, setRolou] = useState(false);
  useEffect(() => {
    const ver = () => setRolou(window.scrollY > 24);
    ver();
    window.addEventListener("scroll", ver, { passive: true });
    return () => window.removeEventListener("scroll", ver);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        rolou ? "bg-mar/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-8">
        <a href="#topo" className="flex items-center gap-3 text-white">
          <img src="/logo-ts.png" alt="" width={40} height={40} className="h-9 w-9 rounded-full sm:h-10 sm:w-10" />
          <span className="font-display text-[15px] font-bold italic tracking-tight [font-stretch:115%]">
            TS Kite Center
          </span>
        </a>

        <div className="flex items-center gap-8">
          <ul className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm font-medium text-bruma transition-colors hover:text-white">
                  {l.rotulo}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={linkWhatsApp("Olá! Quero agendar uma aula de kitesurf.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-sol px-4 py-2 text-sm font-bold text-mar transition-transform hover:-translate-y-0.5 sm:px-5 sm:py-2.5"
          >
            Agendar aula
          </a>
        </div>
      </nav>
    </header>
  );
}
