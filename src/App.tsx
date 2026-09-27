import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Aulas from "./components/aulas";
import Spot from "./components/spot";

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Aulas />
        <Spot />
      </main>
    </>
  );
}
