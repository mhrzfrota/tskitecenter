export default function Interruptor({ rotulo, marcado, aoAlterar, desabilitado = false }: { rotulo: string; marcado: boolean; aoAlterar: () => void; desabilitado?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={marcado}
      disabled={desabilitado}
      onClick={aoAlterar}
      className="inline-flex min-h-11 items-center gap-2.5 text-left text-[14px] disabled:opacity-40"
    >
      <span aria-hidden className={`flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 transition-colors ${marcado ? "bg-mar" : "bg-pilula"}`}>
        <span className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${marcado ? "translate-x-4" : ""}`} />
      </span>
      {rotulo}
    </button>
  );
}
