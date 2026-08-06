import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Ranges from './components/Ranges';
import Catalogue from './components/Catalogue';
import Expertise from './components/Expertise';
import Atelier from './components/Atelier';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Ranges />
        <Catalogue />
        <Expertise />
        <Atelier />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
