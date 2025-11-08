'use client';
import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { TiTick } from 'react-icons/ti';
import { store } from '@/redux/store';
import { Provider } from 'react-redux';
import { useAppDispatch } from '@/redux/hooks/hooks';
import { resetGameState } from '@/redux/slices/game';
import { resetPlayerState } from '@/redux/slices/player';

const Multiplayer = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showInput, setShowInput] = useState('invisible');
  const [roomId, setRoomId] = useState('');

  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL!;

  useEffect(() => {
    dispatch(resetGameState());
    dispatch(resetPlayerState());

    // * Trigger wake-up signal for the Server hosted on Glitch
    const checkServerStatus = async () => {
      try {
        const serverResponse = await fetch(serverUrl);
        const result = await serverResponse.json();
        console.log(result);
      } catch (error) {
        console.error('Error connecting to server:', error);
      }
    };
    checkServerStatus();
  }, []);

  const handleCreateRoom = () => {
    const roomId = new Date().getTime().toString().slice(5);
    router.push(`/multiplayer/${roomId}`);
  };

  const handleJoinRoom = () => {
    router.push(`/multiplayer/${roomId}`);
  };

  const handleRoomIdChange = (e: any) => setRoomId(e.target.value.substring(0, 14).trim());

  return (
    <div className="h-screen overflow-y-auto flex flex-col items-center justify-center">
      <h2 className="mt-auto py-4 px-4 text-5xl font-bold font-serif text-slate-900 text-center">Multiplayer Rooms</h2>
      <div className="mt-12 flex flex-col items-center justify-center">
        <div className="mb-8 text-2xl md:flex-row flex flex-col items-center gap-x-12 gap-y-4 text-slate-800">
          <button onClick={handleCreateRoom} className="font-mono my-2 hover:text-slate-900 hover:font-semibold">
            Create Room
          </button>
          <button
            onClick={() => setShowInput('visible')}
            className="font-mono my-2 hover:text-slate-900 hover:font-semibold"
          >
            Join Room
          </button>
        </div>
        <div className={`${showInput} flex`}>
          <input
            className={`w-40 h-12 p-4 rounded-xl focus:outline-none focus:ring-4 font-mono focus:ring-sky-600`}
            type="text"
            placeholder="Nom de Room"
            value={roomId}
            onChange={handleRoomIdChange}
          />
          <button className="mx-4 text-5xl text-blue-500 hover:text-blue-700" onClick={handleJoinRoom}>
            <TiTick />
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Page = () => (
  <Provider store={store}>
    <Multiplayer />
  </Provider>
);

export default Page;
