'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/hooks';
import { calculateAndMove, inPlayUserDisconnect } from '@/redux/middleware/multiplayerLogic';
import StaticLudoBoard from '../StaticLudoBoard';

interface LudoBoardColor {
  [key: string]: string;
}

interface MultiplayerBoardProps {
  socket: Socket;
}

interface MoveToken {
  playerId: string;
  tokenId: string;
}

const DynamicLudoBoard: React.FC<MultiplayerBoardProps> = ({ socket }) => {
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
  let moveToken: MoveToken = { playerId: '', tokenId: '' };
  const dispatch = useAppDispatch();

  const [tokenClicked, setTokenClicked] = useState(false);

  useEffect(() => {
    if (gameStatus === 'start') {
      router.push('/multiplayer');
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

    if (tokenClicked) {
      return;
    }

    if (player && player.socketId !== socket.id) {
      return;
    }

    if (!gameState.hasRolled) {
      return;
    }

    if (socket.id !== gameState.currentTurn) {
      return;
    }

    if (!gameState.isSix && (locationStatus === 'spawn' || locationStatus === 'home')) {
      return;
    }

    setTokenClicked(true);

    moveToken = { playerId: playerId, tokenId: tokenId };
    socket.emit('moveToken', JSON.stringify(moveToken));
  };

  useEffect(() => {
    socket.on('moveToken', (moveToken) => {
      try {
        dispatch(calculateAndMove(socket, JSON.parse(moveToken)));
        setTokenClicked(false);
      } catch (e) {
        if (socket.id === gameState.currentTurn) {
          alert(e);
          setTokenClicked(false);
        }
      }
    });

    socket.on('inPlayUserDisconnect', (userList: string) => {
      dispatch(inPlayUserDisconnect(userList));
    });

    return () => {
      socket.off('moveToken');
      socket.off('inPlayUserDisconnect');
    };
  }, [socket]);

  const renderTokens = () => {
    return players.map(
      (player) =>
        player.isPlaying &&
        player.tokens.map((token) => {
          let highlightToken = '';

          if (gameState.currentTurn === socket.id && gameState.currentTurn === player.socketId && gameState.hasRolled) {
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
