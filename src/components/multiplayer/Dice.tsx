'use client';

import { Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { passTurn, setDiceRoll } from '@/redux/slices/game';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/hooks';
import { validateTurn } from '@/redux/middleware/multiplayerLogic';
import { FaDiceD6, FaDiceOne, FaDiceTwo, FaDiceThree, FaDiceFour, FaDiceFive, FaDiceSix } from 'react-icons/fa6';

interface DiceProps {
  socketId: string;
  socket: Socket;
}

const Dice: React.FC<DiceProps> = ({ socketId, socket }) => {
  const diceNumber = useAppSelector((state) => state.gameState.diceRoll);
  const hasRolled = useAppSelector((state) => state.gameState.hasRolled);
  const currentTurn = useAppSelector((state) => state.gameState.currentTurn);
  const dispatch = useAppDispatch();
  const [isRolling, setIsRolling] = useState(false);
  const [rollingDice, setRollingDice] = useState(0);

  useEffect(() => {
    socket.on('diceAnim', () => {
      setIsRolling(true);
      const rolling = setInterval(() => {
        setRollingDice((prev) => Math.floor(Math.random() * 6) + 1);
      }, 50);
      setTimeout(() => {
        clearInterval(rolling);
        setIsRolling(false);
      }, 1500);
    });

    socket.on('diceRoll', (roll: number) => {
      dispatch(setDiceRoll(roll));
      dispatch(validateTurn(socket));
    });

    socket.on('updateTurn', (nextPlayer: string) => {
      dispatch(passTurn(nextPlayer));
    });

    return () => {
      socket.off('diceRoll');
      socket.off('updateTurn');
    };
  }, [socket]);

  const handleDiceClick = () => {
    if (currentTurn !== socket.id) return;

    if (!hasRolled) {
      socket.emit('diceRoll');
    }
  };

  const handlePassTurn = () => {
    if (isRolling) return;
    socket.emit('passTurn');
  };

  const diceIcons = [
    <FaDiceD6 />,
    <FaDiceOne />,
    <FaDiceTwo />,
    <FaDiceThree />,
    <FaDiceFour />,
    <FaDiceFive />,
    <FaDiceSix />,
  ];

  const diceCursorClass = currentTurn === socket.id ? 'cursor-pointer' : 'cursor-not-allowed';

  let diceRollCursorClass = 'cursor-not-allowed';
  if (currentTurn === socket.id) diceRollCursorClass = isRolling || hasRolled ? 'cursor-not-allowed' : 'cursor-pointer';

  const passTurnClass = isRolling ? 'cursor-not-allowed' : 'cursor-pointer';

  const common_CSS =
    'border-2 rounded-2xl shadow-lg shadow-slate-700 transition-all duration-400 ease-in-out hover:shadow-md';

  const breathingAnim = socket.id === currentTurn && socketId === currentTurn ? 'breathingAnim' : '';

  return (
    <>
      <button
        className={`mx-3 w-20 h-20 text-white ${breathingAnim} ${common_CSS} ${diceRollCursorClass} ${diceCursorClass} hover:opacity-80 bg-slate-600`}
        onClick={handleDiceClick}
        disabled={isRolling || hasRolled || currentTurn !== socket.id}
      >
        <span className="flex justify-center text-6xl">
          {isRolling ? diceIcons[rollingDice] : diceIcons[diceNumber]}
        </span>
      </button>
      {currentTurn === socket.id && (
        <button
          key={`PT${socket.id}`}
          disabled={isRolling}
          onClick={handlePassTurn}
          className={`w-36 h-20 mx-1 ml-2 px-6 py-2 border-orange-700 bg-amber-500 text-slate-900 text-xl font-mono font-semibold ${passTurnClass} ${common_CSS}`}
        >
          Pass Turn
        </button>
      )}
    </>
  );
};
export default Dice;
