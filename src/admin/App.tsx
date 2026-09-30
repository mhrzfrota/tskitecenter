import { useState, type FormEvent } from "react";
import Painel from "./Painel";

// Só demonstração: enquanto não há Supabase, o painel fica atrás de um PIN simples.
// O acesso de verdade virá com o login do Supabase.
const PIN_DEMONSTRACAO = "2026";
const CHAVE = "ts:admin:entrou";

function jaEntrou() {
  try {
    return sessionStorage.getItem(CHAVE) === "sim";
  } catch {
    return false;
  }
}

export default function App() {
  const [entrou, setEntrou] = useState(jaEntrou);
  const [pin, setPin] = useState("");
  const [erro, setErro] = useState("");

  function entrar(e: FormEvent) {
    e.preventDefault();
    if (pin !== PIN_DEMONSTRACAO) {
      setErro("PIN incorreto.");
      return;
    }
    try {
      sessionStorage.setItem(CHAVE, "sim");
    } catch {
      // vale só nesta aba
    }
    setEntrou(true);
  }

  function sair() {
    try {
      sessionStorage.removeItem(CHAVE);
    } catch {
      // nada a limpar
    }
    setEntrou(false);
    setPin("");
  }

  if (entrou) return <Painel sair={sair} />;

  return (
    <main className="flex min-h-screen items-center justify-center bg-bandeja p-4">
      <form onSubmit={entrar} className="w-full max-w-sm rounded-painel bg-white p-6 sm:p-8">
        <img src="/logo-ts.png" alt="TS Kite Center" width={56} height={56} className="h-14 w-14 rounded-full" />
        <p className="rotulo mt-6">Painel da loja</p>
        <h1 className="titulo mt-3 text-3xl">
          TS Kite Shop <span className="suave">produtos</span>
        </h1>
        <label htmlFor="pin" className="mt-8 block text-sm font-medium">
          PIN de acesso
        </label>
        <input
          id="pin"
          type="password"
          inputMode="numeric"
          autoComplete="off"
          maxLength={8}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value.replace(/\D/g, ""));
            setErro("");
          }}
          className="mt-2 block h-14 w-full rounded-2xl bg-bandeja px-4 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-mar"
        />
        {erro && (
          <p role="alert" className="mt-2 text-sm text-red-700">
            {erro}
          </p>
        )}
        <button type="submit" disabled={!pin} className="mt-6 h-12 w-full rounded-full bg-sol font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-mar disabled:opacity-40">
          Entrar
        </button>
      </form>
    </main>
  );
}
