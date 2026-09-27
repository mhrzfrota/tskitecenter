import Navbar from "./components/navbar";
import Hero from "./components/hero";
import VentoAgora from "./components/vento-agora";
import Categorias from "./components/categorias";
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
        <VentoAgora />
        <Categorias />
        <Produtos />
        <PorQueTs />
        <Localizacao />
      </main>
      <Rodape />
      <WhatsAppFlutuante />
    </>
  );
}
