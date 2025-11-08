'use client';
import StaticLudoBoard from './StaticLudoBoard';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/hooks';
import { calculateAndMove } from '../redux/middleware/gameLogic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type LudoBoardColor = {
  [key: string]: string;
};

const DynamicLudoBoard = () => {
  const color: LudoBoardColor = {
    P1: '#FF2525',
    P2: '#4CAF50',
    P3: '#FDFC49',
    P4: '#4169E1',
  };

  const router = useRouter();
  const gameState = useAppSelector((state) => state.gameState);
  const players = useAppSelector((state) => state.players);
  const gameStatus = gameState.gameStatus;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (gameStatus === 'start') {
      router.push('/customize');
    }
    if (gameStatus === 'end') {
      router.push('/leaderboard');
    }
  }, [gameStatus]);

  const handleToken = (e: any) => {
    let tokenId = e.target.id;
    let playerId = tokenId.substr(0, 2);
    let player = players.find((p) => p.id === playerId);
    let token = player?.tokens.find((t) => t.id === tokenId);
    let locationStatus = token?.locationStatus;

    if (!gameState.hasRolled) {
      return;
    }

    if (playerId !== gameState.currentTurn) {
      return;
    }

    if (!gameState.isSix && (locationStatus === 'spawn' || locationStatus === 'home')) {
      return;
    }

    try {
      dispatch(calculateAndMove({ playerId: playerId, tokenId: tokenId }));
    } catch (e) {
      alert(e);
    }
  };

  const renderTokens = () => {
    return players.map(
      (player) =>
        player.isPlaying &&
        player.tokens.map((token) => {
          let highlightToken = '';

          if (gameState.currentTurn === player.id && gameState.hasRolled) {
            if (gameState.diceRoll === 6) {
              highlightToken = 'highlight';
            } else if (
              gameState.diceRoll !== 6 &&
              (token.locationStatus === 'onBoard' || token.locationStatus === 'onLane')
            )
              highlightToken = 'highlight';
          }

          return (
            <circle
              key={token.id}
              id={token.id}
              cx={token.px}
              cy={token.py}
              r={1.75}
              fill={color[player.id]}
              strokeWidth="0.7"
              stroke="black"
              onClick={handleToken}
              className={highlightToken}
            />
          );
        })
    );
  };

  return (
    <svg
      viewBox="0 0 150 150"
      height="700"
      width="700"
      preserveAspectRatio="xMidYMid meet"
      className="rounded-lg border-4 border-black bg-white"
    >
      <StaticLudoBoard color={color} />
      {renderTokens()}
    </svg>
  );
};

export default DynamicLudoBoard;
