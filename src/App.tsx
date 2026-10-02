import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Categorias from "./components/categorias";
import Precos from "./components/precos";
import Inscricao from "./components/inscricao";
import Previsao from "./components/previsao";
import Produtos from "./components/produtos";
import PorQueTs from "./components/por-que-ts";
import Localizacao from "./components/localizacao";
import Rodape from "./components/rodape";
import WhatsAppFlutuante from "./components/whatsapp-flutuante";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Categorias />
        <Precos />
        <Inscricao />
        <Previsao />
        <PorQueTs />
        <Produtos />
        <Localizacao />
      </main>
      <Rodape />
      <WhatsAppFlutuante />
    </>
  );
}
