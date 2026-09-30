import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Download, ExternalLink, LogOut, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { CATEGORIAS, ErroLoja, formatarPreco, loja, nomeCategoria, type CategoriaId, type Produto } from "@/loja";
import Editor from "./Editor";
import FotoLoja from "./FotoLoja";
import Interruptor from "./Interruptor";

/**
 * Lista da loja. As três chaves que o dono mais mexe (disponível, destaque,
 * visível) ficam no próprio card, sem abrir o formulário.
 */
export default function Painel({ sair }: { sair: () => void }) {
  const [produtos, setProdutos] = useState<Produto[] | null>(null);
  const [filtro, setFiltro] = useState<CategoriaId | "">("");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState<Produto | "novo" | null>(null);
  const [aviso, setAviso] = useState("");
  const [erro, setErro] = useState("");
  const [confirmarRemocao, setConfirmarRemocao] = useState<string | null>(null);
  const arquivoBackup = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const carregar = () =>
      loja
        .listar({ incluirInativos: true })
        .then(setProdutos)
        .catch((e) => setErro(e instanceof ErroLoja ? e.message : "Não foi possível ler os produtos."));
    carregar();
    return loja.ouvir(carregar);
  }, []);

  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(() => setAviso(""), 3500);
    return () => clearTimeout(t);
  }, [aviso]);

  const contagem = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of produtos ?? []) m.set(p.categoria, (m.get(p.categoria) ?? 0) + 1);
    return m;
  }, [produtos]);

  const lista = (produtos ?? []).filter(
    (p) => (!filtro || p.categoria === filtro) && (!busca.trim() || p.nome.toLowerCase().includes(busca.trim().toLowerCase())),
  );

  async function alternar(p: Produto, campo: "disponivel" | "destaque" | "ativo") {
    setErro("");
    try {
      await loja.salvar({ ...p, [campo]: !p[campo] });
    } catch (e) {
      setErro(e instanceof ErroLoja ? e.message : "Não foi possível atualizar.");
    }
  }

  async function remover(p: Produto) {
    try {
      await loja.remover(p.id);
      setAviso(`${p.nome} removido.`);
    } catch (e) {
      setErro(e instanceof ErroLoja ? e.message : "Não foi possível remover.");
    }
    setConfirmarRemocao(null);
  }

  async function exportar() {
    try {
      const blob = await loja.exportar();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `backup-loja-ts-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (e) {
      setErro(e instanceof ErroLoja ? e.message : "Não foi possível gerar o backup.");
    }
  }

  async function importar(arquivo: File) {
    setErro("");
    try {
      const { produtos: n } = await loja.importar(arquivo);
      setAviso(`Backup restaurado: ${n} ${n === 1 ? "produto" : "produtos"}.`);
    } catch (e) {
      setErro(e instanceof ErroLoja ? e.message : "Não foi possível restaurar o backup.");
    }
  }

  return (
    <div className="min-h-screen bg-white text-mar">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/logo-ts.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full" />
            <div className="leading-tight">
              <p className="font-medium tracking-[-0.02em]">TS Kite Shop</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-maré">Painel da loja</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <a href="/#loja" target="_blank" rel="noopener noreferrer" className="hidden h-10 items-center gap-1.5 rounded-full px-3 text-sm hover:bg-bandeja sm:inline-flex">
              Ver site <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </a>
            <button type="button" onClick={sair} aria-label="Sair" className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-bandeja">
              <LogOut aria-hidden className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {editando ? (
          <Editor
            produto={editando === "novo" ? null : editando}
            aoFechar={(salvo) => {
              setEditando(null);
              if (salvo) setAviso(`${salvo} salvo.`);
            }}
          />
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h1 className="titulo text-4xl sm:text-5xl">
                Produtos <span className="suave">{produtos?.length ?? 0}</span>
              </h1>
              <button type="button" onClick={() => setEditando("novo")} className="group inline-flex h-12 items-center gap-3 rounded-full bg-sol pl-5 pr-1.5 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-mar">
                Novo produto
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mar text-white transition-transform group-hover:rotate-90">
                  <Plus aria-hidden className="h-4 w-4" />
                </span>
              </button>
            </div>

            <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="-mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filtrar por categoria">
                {[{ id: "" as const, plural: "Todos" }, ...CATEGORIAS].map((c) => (
                  <button
                    key={c.id || "todos"}
                    type="button"
                    aria-pressed={filtro === c.id}
                    onClick={() => setFiltro(c.id)}
                    className={`min-h-[40px] shrink-0 rounded-full px-4 text-[14px] font-medium transition-colors ${filtro === c.id ? "bg-mar text-white" : "bg-pilula text-mar hover:bg-[#D8E2E2]"}`}
                  >
                    {c.plural}
                    {c.id && contagem.get(c.id) ? <span className="ml-1.5 opacity-60">{contagem.get(c.id)}</span> : null}
                  </button>
                ))}
              </div>
              <label className="relative lg:w-72">
                <span className="sr-only">Buscar produto</span>
                <Search aria-hidden className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-maré" />
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto" className="h-11 w-full rounded-full bg-bandeja pl-10 pr-4 text-[15px] outline-none focus:ring-2 focus:ring-mar" />
              </label>
            </div>

            {aviso && (
              <p role="status" className="mt-5 rounded-2xl bg-sol/25 px-4 py-3 text-sm font-medium">
                {aviso}
              </p>
            )}
            {erro && (
              <p role="alert" className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {erro}
              </p>
            )}

            {produtos === null ? (
              <p className="mt-10 text-maré">Carregando...</p>
            ) : produtos.length === 0 ? (
              <div className="mt-8 rounded-painel bg-bandeja p-10 text-center">
                <p className="titulo text-2xl">Nenhum produto ainda</p>
                <p className="mx-auto mt-2 max-w-sm text-maré">Cadastre o primeiro kite, prancha ou boné. Ele aparece na vitrine do site assim que for salvo.</p>
                <button type="button" onClick={() => setEditando("novo")} className="mt-6 h-12 rounded-full bg-mar px-6 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-sol">
                  Cadastrar produto
                </button>
              </div>
            ) : lista.length === 0 ? (
              <p className="mt-10 text-maré">Nada encontrado com esse filtro.</p>
            ) : (
              <ul className="mt-6 grid gap-2 rounded-painel bg-bandeja p-2 sm:gap-3 sm:p-3 md:grid-cols-2 xl:grid-cols-3">
                {lista.map((p) => {
                  const ativos = (produtos ?? []).filter((x) => x.ativo);
                  const pos = ativos.findIndex((x) => x.id === p.id);
                  return (
                    <li key={p.id} className={`flex flex-col rounded-3xl bg-white p-3 ${p.ativo ? "" : "opacity-60"}`}>
                      <div className="flex gap-3">
                        <FotoLoja id={p.fotos[0]} alt={p.nome} className="h-24 w-24 shrink-0 rounded-2xl ring-1 ring-black/5" />
                        <div className="min-w-0 flex-1 py-1">
                          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-maré">{nomeCategoria(p.categoria)}</p>
                          <p className="mt-0.5 line-clamp-2 font-medium leading-snug tracking-[-0.01em]">{p.nome}</p>
                          <p className="mt-1 text-sm">{formatarPreco(p.precoCentavos)}</p>
                          <div className="mt-1.5 flex flex-wrap gap-1">
                            {!p.ativo && <span className="rounded-full bg-mar px-2 py-0.5 text-[11px] text-white">Oculto</span>}
                            {!p.disponivel && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] text-red-800">Esgotado</span>}
                            {p.destaque && <span className="rounded-full bg-sol px-2 py-0.5 text-[11px]">Destaque</span>}
                            {p.opcoes.length > 0 && <span className="rounded-full bg-pilula px-2 py-0.5 text-[11px]">{p.opcoes.length} opções</span>}
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-x-4 border-t border-black/5 pt-1">
                        <Interruptor rotulo="Disponível" marcado={p.disponivel} aoAlterar={() => alternar(p, "disponivel")} />
                        <Interruptor rotulo="Destaque" marcado={p.destaque} aoAlterar={() => alternar(p, "destaque")} />
                        <Interruptor rotulo="No site" marcado={p.ativo} aoAlterar={() => alternar(p, "ativo")} />
                      </div>
                      {confirmarRemocao === p.id ? (
                        <div className="mt-2 flex items-center justify-between gap-2 rounded-2xl bg-red-50 p-2 pl-3 text-sm text-red-800">
                          Remover de vez?
                          <span className="flex gap-1">
                            <button type="button" onClick={() => setConfirmarRemocao(null)} className="h-9 rounded-full bg-white px-3">
                              Não
                            </button>
                            <button type="button" onClick={() => remover(p)} className="h-9 rounded-full bg-red-700 px-3 text-white">
                              Remover
                            </button>
                          </span>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-1">
                          <button type="button" onClick={() => setEditando(p)} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-full bg-pilula text-sm font-medium hover:bg-[#D8E2E2]">
                            <Pencil aria-hidden className="h-4 w-4" /> Editar
                          </button>
                          {p.ativo && (
                            <>
                              <button type="button" aria-label="Subir na vitrine" disabled={pos <= 0} onClick={() => loja.mover(p.id, "subir")} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-bandeja disabled:opacity-30">
                                <ArrowUp aria-hidden className="h-4 w-4" />
                              </button>
                              <button type="button" aria-label="Descer na vitrine" disabled={pos >= ativos.length - 1} onClick={() => loja.mover(p.id, "descer")} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-bandeja disabled:opacity-30">
                                <ArrowDown aria-hidden className="h-4 w-4" />
                              </button>
                            </>
                          )}
                          <button type="button" aria-label={`Remover ${p.nome}`} onClick={() => setConfirmarRemocao(p.id)} className="flex h-10 w-10 items-center justify-center rounded-full text-red-700 hover:bg-red-50">
                            <Trash2 aria-hidden className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Enquanto os produtos ficam só neste navegador, o backup é o que protege o cadastro */}
            <section className="mt-10 flex flex-col gap-4 rounded-3xl border border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium">Backup da loja</p>
                <p className="mt-1 max-w-xl text-sm text-maré">Por enquanto os produtos ficam guardados neste navegador. Baixe um backup de vez em quando; ele também leva os produtos para outro computador.</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" onClick={exportar} className="inline-flex h-11 items-center gap-2 rounded-full bg-pilula px-4 text-sm font-medium">
                  <Download aria-hidden className="h-4 w-4" /> Baixar
                </button>
                <button type="button" onClick={() => arquivoBackup.current?.click()} className="inline-flex h-11 items-center gap-2 rounded-full bg-pilula px-4 text-sm font-medium">
                  <Upload aria-hidden className="h-4 w-4" /> Restaurar
                </button>
                <input
                  ref={arquivoBackup}
                  type="file"
                  accept="application/json,.json"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (f && window.confirm("Restaurar substitui todos os produtos atuais pelos do backup. Continuar?")) importar(f);
                  }}
                />
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
