interface UserItem {
  socketId: string;
  name: string;
}

interface PlayerListProps {
  list: UserItem[];
}

const PlayerList: React.FC<PlayerListProps> = ({ list }) => {
  return (
    <>
      {list &&
        list.map((item) => (
          <div key={item.socketId}>
            <span className="m-2 p-2 h-5 text-xl font-mono text-slate-800">{item.name}</span>
          </div>
        ))}
    </>
  );
};

export default PlayerList;
