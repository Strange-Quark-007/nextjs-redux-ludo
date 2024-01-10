"use client";
import { store } from '@/redux/store';
import { Provider } from 'react-redux';
import Footer from '@/components/Footer';
import PlayerList from '@/components/multiplayer/PlayerList';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { BiRename } from "react-icons/bi";
import { useAppSelector, useAppDispatch } from "@/redux/hooks/hooks";
import { start } from '@/redux/middleware/multiplayerLogic';
import MultiplayerBoard from "@/components/multiplayer/MultiplayerBoard";
import { FaRegCircleCheck, FaCircleCheck } from "react-icons/fa6";


interface roomProp {
  params: {
    room: string;
  };
};

interface Player {
  socketId: string;
  name: string;
};


const Room: React.FC<roomProp> = ({ params }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { room } = params;

  const gameStatus = useAppSelector((state) => state.gameState.gameStatus);

  const [socket, setSocket] = useState<Socket>();
  const [userName, setUserName] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [ready, setReady] = useState(false);
  const [playersReady, setPlayersReady] = useState<number>(0);
  const [playerList, setPlayerList] = useState<Player[]>([]);
  const playerListRef = useRef<Player[]>([]);
  const readyRef = useRef<number>(Number(ready));



  const startVisible = (socket?.id === owner && playersReady === 4) ? "" : "invisible";

  const handleNameChange = (e: any) => {
    e.preventDefault();
    setUserName(e.target.value);
    socket?.emit('nameChange', e.target.value);
  };

  const handleReady = (e: any) => {
    e.preventDefault();
    readyRef.current = 1;
    setReady(true);
    socket?.emit('ready', 1);
  };

  const handleStart = (e: any) => {
    e.preventDefault();
    socket?.emit('start');
  };

  useEffect(() => {
    if (!socket) {
      setSocket(io("https://5eb28475-c4a8-41c1-8d08-28f4ed6d5e91-00-1vqejcytggvx4.janeway.replit.dev", {
        transports: ['websocket']
      }));
    }
  }, [socket]);


  useEffect(() => {

    if (!socket)
      return;

    socket.on("log", (message: string) =>
      console.log(message));

    socket.on("connect", () => {
      console.log("Connected to server");
      setSocket(socket);
    });

    socket.on("connect_error", (e: any) => {
      console.error("connection failed");
    });

    socket.on("roomFull", (message: string) => {
      alert(message);
      router.push('/multiplayer');
    });

    socket.emit("joinRoom", room);

    socket.on('username', (username) => {
      setUserName(username);
    });

    socket.on('ready', (pr: number) => setPlayersReady(pr));

    socket.on('ownerChange', (owner: string) => setOwner(owner));

    socket.on('userListChange', (userList) => {
      setPlayerList(JSON.parse(userList));
      playerListRef.current = JSON.parse(userList);
      socket.emit('ready', Number(readyRef.current));
    });

    socket?.on('start', (playerTurn: string) => {
      dispatch(start(playerListRef.current, playerTurn));
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);


  const inputNameCSS = ready ? 'font-bold ring-2 ring-blue-500' : 'focus-within:border-amber-800 focus-within:ring-2 focus-within:ring-amber-500 focus-within:text-amber-800';


  return (
    gameStatus === 'start' ?
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="mt-auto text-6xl font-bold font-serif mb-10">Dice-y Gathering</h1>
        <div className="flex items-center justify-center">
          <div className={`mt-8 flex items-center rounded-lg border-2 border-black h-12 ${inputNameCSS}`}>
            <div className="px-2 text-4xl"><BiRename /></div>
            <input className="mx-2 px-2 text-lg w-32 rounded-lg focus:outline-none font-mono bg-transparent" type="text" value={userName} onChange={handleNameChange} disabled={ready} />
          </div>
          {ready ? <div className="mt-8 mx-4 text-4xl text-blue-600"><FaCircleCheck /></div> :
            <button onClick={handleReady} disabled={ready} className="mt-8 mx-4 text-4xl text-yellow-500 "><FaRegCircleCheck /></button>
          }
        </div>
        <h1 className="mt-12 text-2xl font-bold font-serif mb-5">Player List</h1>
        <PlayerList list={playerList} />
        <div className={`mt-12 ${startVisible}`}>
          <button
            onClick={handleStart}
            className={`p-4 border-orange-700 bg-amber-500 text-slate-900 text-2xl font-mono font-semibold rounded-xl shadow-lg hover:shadow-md`}>
            Start
          </button>
        </div>
        <Footer />
      </div >
      :
      <main className="flex justify-center items-center sm:scale-100 scale-50 w-full h-full">
        <MultiplayerBoard socket={socket!} />
      </main>
  );
};


const Page = ({ params }: roomProp) => (
  <Provider store={store}>
    <Room params={params} />
  </Provider>
);

export default Page;