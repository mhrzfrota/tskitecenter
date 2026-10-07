import { useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, X } from "lucide-react";
import { CATEGORIAS, ErroLoja, formatarPreco, lerPreco, lojaLocal as loja, nomeDaCor, normalizarCores, normalizarDetalhes, normalizarOpcoes, prepararFoto, tonsDaCor, type CategoriaId, type Produto } from "@/loja";
import FotoLoja from "./FotoLoja";
import Interruptor from "./Interruptor";

const MAX_FOTOS = 8;

const centavosParaTexto = (c: number | null) => (c === null ? "" : (c / 100).toFixed(2).replace(".", ","));

/**
 * Formulário de produto em uma tela só, na ordem em que o dono pensa: o que é,
 * quanto custa, quais tamanhos, as fotos. Tudo o que não é obrigatório já vem
 * preenchido com o valor mais comum.
 */
export default function Editor({ produto, aoFechar }: { produto: Produto | null; aoFechar: (salvo?: string) => void }) {
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [categoria, setCategoria] = useState<CategoriaId | "">(produto?.categoria ?? "");
  const [preco, setPreco] = useState(centavosParaTexto(produto?.precoCentavos ?? null));
  const [opcoes, setOpcoes] = useState((produto?.opcoes ?? []).join(", "));
  const [cores, setCores] = useState((produto?.cores ?? []).join(", "));
  const [detalhes, setDetalhes] = useState((produto?.detalhes ?? []).join("\n"));
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [fotos, setFotos] = useState<string[]>(produto?.fotos ?? []);
  const [disponivel, setDisponivel] = useState(produto?.disponivel ?? true);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [enviando, setEnviando] = useState<{ feitas: number; total: number } | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [arrastando, setArrastando] = useState(false);
  const entrada = useRef<HTMLInputElement>(null);
  // Fotos enviadas nesta edição: se o dono cancelar, elas não podem ficar órfãs no navegador
  const novas = useRef<Set<string>>(new Set());

  const precoLido = lerPreco(preco);
  const opcoesLidas = (() => {
    try {
      return normalizarOpcoes(opcoes);
    } catch {
      return [];
    }
  })();

  const coresLidas = (() => {
    try {
      return normalizarCores(cores);
    } catch {
      return [];
    }
  })();

  async function adicionarFotos(arquivos: FileList | File[]) {
    const lista = [...arquivos].slice(0, MAX_FOTOS - fotos.length);
    if (!lista.length) {
      setErro(`Cada produto pode ter até ${MAX_FOTOS} fotos.`);
      return;
    }
    setErro("");
    setEnviando({ feitas: 0, total: lista.length });
    for (const [i, arquivo] of lista.entries()) {
      try {
        const id = await loja.guardarFoto(await prepararFoto(arquivo));
        novas.current.add(id);
        setFotos((atual) => [...atual, id]);
      } catch (e) {
        setErro(e instanceof ErroLoja ? `${arquivo.name}: ${e.message}` : `Não foi possível adicionar ${arquivo.name}.`);
      }
      setEnviando({ feitas: i + 1, total: lista.length });
    }
    setEnviando(null);
  }

  function mover(i: number, passo: number) {
    setFotos((atual) => {
      const j = i + passo;
      if (j < 0 || j >= atual.length) return atual;
      const copia = [...atual];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });
  }

  async function cancelar() {
    for (const id of novas.current) await loja.removerFoto(id).catch(() => undefined);
    aoFechar();
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (salvando || enviando) return;
    setErro("");
    if (!categoria) return setErro("Escolha a categoria.");
    if (precoLido === "invalido") return setErro('Preço inválido. Use, por exemplo, "1.500,00". Deixe vazio para "Sob consulta".');
    let opcoesFinais: string[];
    try {
      opcoesFinais = normalizarOpcoes(opcoes);
    } catch (err) {
      return setErro(err instanceof ErroLoja ? err.message : "Confira as opções.");
    }
    let coresFinais: string[];
    let detalhesFinais: string[];
    try {
      coresFinais = normalizarCores(cores);
      detalhesFinais = normalizarDetalhes(detalhes);
    } catch (err) {
      return setErro(err instanceof ErroLoja ? err.message : "Confira as cores e os detalhes.");
    }
    setSalvando(true);
    try {
      const salvo = await loja.salvar({
        ...(produto ? { id: produto.id } : {}),
        nome,
        categoria,
        descricao,
        precoCentavos: precoLido,
        opcoes: opcoesFinais,
        cores: coresFinais,
        detalhes: detalhesFinais,
        fotos,
        disponivel,
        destaque,
        ativo,
      });
      // Fotos tiradas do produto nesta edição saem do navegador depois que o produto já foi salvo sem elas
      const retiradas = (produto?.fotos ?? []).filter((id) => !fotos.includes(id));
      for (const id of retiradas) await loja.removerFoto(id).catch(() => undefined);
      aoFechar(salvo.nome);
    } catch (err) {
      setErro(err instanceof ErroLoja ? err.message : "Não foi possível salvar. Tente de novo.");
      setSalvando(false);
    }
  }

  const ocupado = salvando || Boolean(enviando);

  return (
    <form onSubmit={salvar} className="mx-auto max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={cancelar} disabled={ocupado} className="inline-flex min-h-11 items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-maré hover:text-mar disabled:opacity-40">
          <ArrowLeft aria-hidden className="h-4 w-4" /> Produtos
        </button>
        <p className="rotulo">{produto ? "Editar produto" : "Novo produto"}</p>
      </div>

      <div className="mt-4 space-y-3 rounded-painel bg-bandeja p-2 sm:p-3">
        {/* O que é */}
        <section className="rounded-3xl bg-white p-5 sm:p-6">
          <label htmlFor="nome" className="rotulo">
            Nome do produto
          </label>
          <input
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Kite North Orbit 2026"
            maxLength={80}
            required
            className="mt-3 block h-14 w-full rounded-2xl bg-bandeja px-4 text-[18px] font-medium tracking-[-0.01em] outline-none placeholder:font-normal placeholder:text-maré/60 focus:ring-2 focus:ring-mar"
          />
          <p className="rotulo mt-6">Categoria</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Categoria">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={categoria === c.id}
                onClick={() => setCategoria(c.id)}
                className={`min-h-[44px] rounded-full px-4 text-[14px] font-medium transition-colors ${categoria === c.id ? "bg-mar text-white" : "bg-pilula text-mar hover:bg-[#D8E2E2]"}`}
              >
                {c.nome}
              </button>
            ))}
          </div>
        </section>

        {/* Quanto custa e opções */}
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 sm:p-6">
            <label htmlFor="preco" className="rotulo">
              Preço
            </label>
            <div className="mt-3 flex h-14 items-center rounded-2xl bg-bandeja px-4 focus-within:ring-2 focus-within:ring-mar">
              <span className="font-medium text-maré">R$</span>
              <input
                id="preco"
                inputMode="decimal"
                value={preco}
                onChange={(e) => setPreco(e.target.value.replace(/[^\d.,]/g, ""))}
                placeholder="0,00"
                className="h-full w-full bg-transparent px-2 text-[18px] font-medium outline-none placeholder:text-maré/50"
              />
            </div>
            <p className={`mt-2 text-sm ${precoLido === "invalido" ? "text-red-700" : "text-maré"}`}>
              {precoLido === "invalido" ? 'Use o formato "1.500,00".' : precoLido === null ? 'Vazio: aparece "Sob consulta" no site.' : `Aparece como ${formatarPreco(precoLido)}.`}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-5 sm:p-6">
            <label htmlFor="opcoes" className="rotulo">
              Tamanhos ou opções
            </label>
            <input
              id="opcoes"
              value={opcoes}
              onChange={(e) => setOpcoes(e.target.value)}
              placeholder="Ex.: 9 m, 12 m, 14 m"
              className="mt-3 block h-14 w-full rounded-2xl bg-bandeja px-4 text-[16px] outline-none placeholder:text-maré/60 focus:ring-2 focus:ring-mar"
            />
            {opcoesLidas.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {opcoesLidas.map((o) => (
                  <li key={o} className="rounded-full bg-sol/30 px-2.5 py-1 text-[13px] font-medium">
                    {o}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-maré">Separe por vírgula. Vazio se não tiver.</p>
            )}
          </div>
        </section>

        {/* Cores e detalhes: aparecem na página do produto */}
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white p-5 sm:p-6">
            <label htmlFor="cores" className="rotulo">
              Cores
            </label>
            <input
              id="cores"
              value={cores}
              onChange={(e) => setCores(e.target.value)}
              placeholder="Ex.: Azul, Preto/Amarelo, Branco"
              className="mt-3 block h-14 w-full rounded-2xl bg-bandeja px-4 text-[16px] outline-none placeholder:text-maré/60 focus:ring-2 focus:ring-mar"
            />
            {coresLidas.length > 0 ? (
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {coresLidas.map((c) => {
                  const tons = tonsDaCor(c);
                  return (
                    <li key={c} className="flex items-center gap-1.5 rounded-full bg-bandeja py-1 pl-1 pr-2.5 text-[13px] font-medium">
                      <span
                        className="h-5 w-5 rounded-full ring-1 ring-black/15"
                        style={{ background: tons.length > 1 ? `linear-gradient(135deg, ${tons[0]} 50%, ${tons[1]} 50%)` : tons[0] ?? "repeating-linear-gradient(45deg,#ddd 0 3px,#fff 3px 6px)" }}
                      />
                      {nomeDaCor(c)}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-maré">Separe por vírgula. Cor fora do comum: escreva o nome e o código, ex.: "Petróleo #0F5560".</p>
            )}
          </div>
          <div className="rounded-3xl bg-white p-5 sm:p-6">
            <label htmlFor="detalhes" className="rotulo">
              Detalhes técnicos
            </label>
            <textarea
              id="detalhes"
              value={detalhes}
              onChange={(e) => setDetalhes(e.target.value)}
              rows={5}
              placeholder={"Um por linha. Ex.:\nMaterial: Dacron\nNível: iniciante a avançado\nAcompanha bolsa"}
              className="mt-3 block w-full resize-y rounded-2xl bg-bandeja p-4 text-[15px] leading-relaxed outline-none placeholder:text-maré/60 focus:ring-2 focus:ring-mar"
            />
            <p className="mt-2 text-sm text-maré">Com dois-pontos vira tabela (Material | Dacron). Sem, vira item da lista.</p>
          </div>
        </section>

        {/* Fotos */}
        <section className="rounded-3xl bg-white p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <p className="rotulo">Fotos</p>
            <p className="text-sm text-maré">
              {fotos.length}/{MAX_FOTOS} · a primeira é a capa
            </p>
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {fotos.map((id, i) => (
              <li key={id} className="relative">
                <FotoLoja id={id} alt={`Foto ${i + 1}`} className={`aspect-square rounded-2xl ring-1 ${i === 0 ? "ring-2 ring-sol" : "ring-black/10"}`} />
                {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-sol px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]">Capa</span>}
                <div className="mt-1.5 flex justify-center gap-1">
                  <button type="button" aria-label="Mover para a esquerda" disabled={i === 0} onClick={() => mover(i, -1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-pilula disabled:opacity-30">
                    <ArrowLeft aria-hidden className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Mover para a direita" disabled={i === fotos.length - 1} onClick={() => mover(i, 1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-pilula disabled:opacity-30">
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </button>
                  <button type="button" aria-label="Tirar esta foto" onClick={() => setFotos((a) => a.filter((f) => f !== id))} className="flex h-9 w-9 items-center justify-center rounded-full bg-pilula text-red-700">
                    <X aria-hidden className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
            {fotos.length < MAX_FOTOS && (
              <li>
                <button
                  type="button"
                  onClick={() => entrada.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setArrastando(true);
                  }}
                  onDragLeave={() => setArrastando(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setArrastando(false);
                    adicionarFotos(e.dataTransfer.files);
                  }}
                  disabled={Boolean(enviando)}
                  className={`flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center text-[13px] transition-colors ${arrastando ? "border-mar bg-sol/20" : "border-black/15 text-maré hover:border-mar hover:text-mar"}`}
                >
                  <ImagePlus aria-hidden className="h-6 w-6" strokeWidth={1.5} />
                  {enviando ? `Enviando ${enviando.feitas}/${enviando.total}` : "Adicionar fotos"}
                </button>
              </li>
            )}
          </ul>
          <input
            ref={entrada}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => {
              if (e.target.files) adicionarFotos(e.target.files);
              e.target.value = "";
            }}
          />
          <p className="mt-3 text-sm text-maré">Pode arrastar várias de uma vez. Elas são reduzidas para carregar rápido, sem cortar.</p>
        </section>

        {/* Descrição e vitrine */}
        <section className="rounded-3xl bg-white p-5 sm:p-6">
          <label htmlFor="descricao" className="rotulo">
            Descrição <span className="normal-case tracking-normal">(opcional)</span>
          </label>
          <textarea
            id="descricao"
            rows={4}
            maxLength={1000}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Estado, ano, o que acompanha, para quem é indicado..."
            className="mt-3 block w-full rounded-2xl bg-bandeja p-4 text-[16px] outline-none placeholder:text-maré/60 focus:ring-2 focus:ring-mar"
          />
          <div className="mt-5 grid gap-1 sm:grid-cols-3">
            <Interruptor rotulo="Disponível" marcado={disponivel} aoAlterar={() => setDisponivel(!disponivel)} />
            <Interruptor rotulo="Destaque na vitrine" marcado={destaque} aoAlterar={() => setDestaque(!destaque)} />
            <Interruptor rotulo="Visível no site" marcado={ativo} aoAlterar={() => setAtivo(!ativo)} />
          </div>
        </section>
      </div>

      {erro && (
        <p role="alert" className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-800">
          {erro}
        </p>
      )}

      <div className="sticky bottom-0 mt-4 flex gap-3 bg-gradient-to-t from-white via-white to-white/0 pb-4 pt-6">
        <button type="button" onClick={cancelar} disabled={ocupado} className="h-12 rounded-full bg-pilula px-6 font-mono text-[13px] font-medium uppercase tracking-[0.12em] disabled:opacity-40">
          Cancelar
        </button>
        <button type="submit" disabled={ocupado || !nome.trim()} className="h-12 flex-1 rounded-full bg-sol font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-mar disabled:opacity-40">
          {salvando ? "Salvando..." : produto ? "Salvar alterações" : "Cadastrar produto"}
        </button>
      </div>
      {produto && <p className="pb-6 text-center text-xs text-maré">Criado em {new Date(produto.criadoEm).toLocaleDateString("pt-BR")}</p>}
    </form>
  );
}
