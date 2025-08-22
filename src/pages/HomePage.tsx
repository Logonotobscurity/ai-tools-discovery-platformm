import Header from '@/components/header';
import Hero from '@/components/hero';
import ToolList from '@/components/tool-list';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ToolList />
      </main>
    </>
  );
}
