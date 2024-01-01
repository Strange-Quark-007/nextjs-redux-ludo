'use server';
import Footer from '@/Components/Footer';
import StaticLudoBoard from '@/Components/StaticLudoBoard';
import Link from 'next/link';

const Home = () => {
  const color = {
    "P1": "#FF2525",
    "P2": "#4CAF50",
    "P3": "#FDFC49",
    "P4": "#4169E1"
  };

  return (
    <div className="w-full flex flex-col justify-between h-screen overflow-y-auto">
      <header className="mt-14 mb-auto px-4 py-4 text-center">
        <div className="text-slate-900 font-extrabold font-serif text-7xl tracking-widest">
          LUDO
        </div>
        <p className="lg:flex items-center justify-center mt-4 font-mono font-semibold text-xl text-slate-800 tracking-wider">
          Where squares of fate meet<span className="text-3xl mx-1">🎲</span>-isive destiny.<span className="block my-2 lg:inline lg:ml-2"> Don&#39;t miss the roll call.</span>
        </p>
      </header>
      <main className="flex flex-col lg:flex-row lg:justify-center lg:mt-10 mt-24 mb-auto items-center ">
        <div className="lg:ml-auto h-auto w-auto md:w-[450px]">
          <svg
            viewBox='0 0 150 150'
            preserveAspectRatio='xMidYMid meet'
            strokeWidth="0.8" stroke="black"
            className="rounded-lg border-4 border-black bg-white rotate-45 h-full w-full ludoBoardHome">
            <StaticLudoBoard color={color} />
          </svg>
        </div>
        <div className="flex flex-col lg:justify-center justify-between items-center lg:ml-52 lg:mr-auto font-bold font-mono mt-16 text-3xl h-96">
          <Link href="/customize" className="mt-auto text-gray-800 mb-16 text-4xl hover:text-gray-900">
            Play
          </Link>
          <button className="mt-16 mb-auto text-slate-600 flex flex-col items-center" disabled>
            Online Multiplayer
            <span className="font-thin text-xl"> (Future Dream)</span>
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;