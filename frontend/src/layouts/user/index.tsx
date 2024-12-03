const UserLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <nav className="flex justify-between items-center p-5 shadow-md bg-white">
        <h1 className="text-2xl font-bold">Kawan Library</h1>
      </nav>
      <div>{children}</div>
    </>
  );
};

export default UserLayout;
