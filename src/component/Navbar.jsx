import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../feature/auth/authSlice";
import { getAvatar } from "../utils/avatar";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!token) return null;

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.username || "User";

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center gap-6 shadow-lg sticky top-0 z-40">
      <span className="font-bold text-xl tracking-tight text-indigo-400">
        MyApp
      </span>

      <NavLink
        to="/products"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
        }
      >
        Products
      </NavLink>
      <NavLink
        to="/crud"
        className={({ isActive }) =>
          `text-sm font-medium transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
        }
      >
        Manage
      </NavLink>

      {/* User info + logout */}
      <div className="ml-auto flex items-center gap-3">
        <img
          src={getAvatar(user?.username || "user")}
          alt="avatar"
          className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-indigo-400"
        />
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-white leading-none">
            {displayName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            @{user?.username || "user"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
