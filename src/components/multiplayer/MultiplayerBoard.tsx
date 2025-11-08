'use client';
import { Socket } from 'socket.io-client';
import DynamicLudoBoard from './DynamicLudoBoard';
import PlayerCard from './PlayerCard';

interface MultiplayerBoardProps {
  socket: Socket;
}

const MultiplayerBoard: React.FC<MultiplayerBoardProps> = ({ socket }) => {
  return (
    <div>
      <div className="my-4 flex justify-between">
        <PlayerCard key="P2" id="P2" socket={socket} />
        <PlayerCard key="P3" id="P3" socket={socket} />
      </div>
      <div className="w-auto h-auto">
        <DynamicLudoBoard socket={socket} />
      </div>
      <div className="my-4 flex justify-between">
        <PlayerCard key="P1" id="P1" socket={socket} />
        <PlayerCard key="P4" id="P4" socket={socket} />
      </div>
    </div>
  );
};

export default MultiplayerBoard;
