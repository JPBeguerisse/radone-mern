import { se } from "date-fns/locale";
import { Loader, Search, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchUsers } from "src/services/userService";
import { User } from "src/types/user.types";

interface SearchSidebarProps {
  isSearchOpen: boolean;
  onSearchOpen: (isOpen: boolean) => void;
  isSidebarOpen: boolean;
  onSidebarOpen: (isOpen: boolean) => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  isSearchOpen,
  onSearchOpen,
  isSidebarOpen,
  onSidebarOpen,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emptyUser, setEmptyUser] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setEmptyUser(false);
    try {
      setLoading(true);
      const users = await searchUsers(searchTerm.trim());
      //   if (users.length === 0) {
      //     setEmptyUser(true);
      //   } else {
      //     setError("");
      //   }
      setSearchResults(users);
      setEmptyUser(users.length === 0);

      setError("");
    } catch (err: any) {
      setError("Erreur lors de la recherche.");
      setEmptyUser(false);
    } finally {
      setLoading(false);
    }
  };

  const handeleDeleteSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setError("");
    setLoading(false);
    setEmptyUser(false);
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      // Vérifie si l'utilisateur a arrêté de taper
      if (searchTerm.trim()) {
        handleSearch();
        setEmptyUser(false);
      } else {
        setSearchResults([]);
      }
    }, 500); // Attends 500ms après que l’utilisateur ait arrêté de taper

    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div>
      <div
        className="fixed top-0 left-0 h-full w-full md:w-96 bg-white border-r-2 z-50 transition-transform duration-300 ease-in-out transform pointer-events-auto rounded-r-sm"
        style={{
          transform: isSearchOpen ? "translateX(0%)" : "translateX(-100%)",
        }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Recherche</h2>
            <button
              className="text-gray-500 hover:text-black"
              onClick={() => onSearchOpen(false)}
            >
              <X />
            </button>
          </div>
          <div className="relative mb-4">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
              placeholder="Rechercher un utilisateur"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <X
                size={18}
                className="cursor-pointer"
                onClick={handeleDeleteSearch}
              />
            </span>
          </div>

          {loading && <Loader className="animate-spin text-gray-500" />}
          {error && <p className="text-red-500">{error}</p>}

          <div className="mt-2 p-4 overflow-auto flex flex-col gap-2 max-h-[calc(100vh-200px)]">
            {searchResults.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  onSearchOpen(false);
                  navigate(`/profil/${user.userName}?tab=posts`);
                }}
                className="cursor-pointer flex items-center gap-3 p-2 hover:bg-gray-100 rounded"
              >
                <div>
                  <img
                    src={`${
                      process.env.REACT_APP_API_URL
                    }/${user.picture?.replace(/^\//, "")}`}
                    alt="user"
                    className="w-14 h-14 rounded-full object-cover object-center"
                  />
                </div>
                <div className="flex flex-col ">
                  <span className="text-black font-bold">{user.userName}</span>
                  <span>{user.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            {emptyUser && (
              <p className="text-gray-500 text-center mt-4">
                Aucun utilisateur trouvé.
              </p>
            )}
          </div>
        </div>
      </div>

      {(isSidebarOpen || isSearchOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => {
            onSidebarOpen(false);
            onSearchOpen(false);
          }}
        ></div>
      )}
    </div>
  );
};

export default SearchSidebar;
