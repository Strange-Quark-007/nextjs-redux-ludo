'use client';

import Dice from '../Dice';
import { useAppSelector } from '@/redux/hooks/hooks';

interface MultiplayerCard {
  id: String;
}

const MultiplayerCard = ({ id }: MultiplayerCard) => {
  const player = useAppSelector((state) => state.players[+id.split('')[1] - 1]);
  const invisible = !player?.isPlaying ? 'invisible' : '';
  const currentTurn = useAppSelector((state) => state.gameState.currentTurn);
  const card_flex = id === 'P3' || id === 'P4' ? `flex flex-row-reverse` : `flex`;

  return (
    <div className={card_flex}>
      <div
        className={`${card_flex} ${invisible} justify-center items-center w-40 h-20 px-4 py-2 rounded-2xl shadow-md shadow-slate-700 bg-slate-600 transition-all duration-300 ease-in-out hover:bg-slate-700 mx-1`}
      >
        {player?.isPlaying && (
          <div className="text-md text-white text-lg font-mono max-w-[100px] line-clamp-1 overflow-ellipsis  overflow-hidden">
            {player?.name}
          </div>
        )}
      </div>
      {currentTurn === player?.id && <Dice key={player.id} playerId={player.id} />}
    </div>
  );
};

export default MultiplayerCard;
