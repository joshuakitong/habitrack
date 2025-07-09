import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkBase = menuOpen ? "border-b-4 w-fit" : "pb-2 border-b-4 w-fit";
  const linkActive = "border-gray-300";
  const linkInactive = "border-transparent hover:border-gray-500";

  return (
    <nav className="flex flex-col md:flex-row md:justify-between md:items-center pt-4 mx-2 text-white border-b border-gray-300">
      <div className="flex justify-between items-center">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Habit Tracker
        </NavLink>

        <button
          className="md:hidden text-white focus:outline-none -mt-[0.5rem]"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={`flex-col md:flex-row md:flex md:space-x-6 mt-2 md:mt-0 ${
          menuOpen ? "flex" : "hidden"
        }`}
      >
        <NavLink
          to="/habits"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
          onClick={() => setMenuOpen(false)}
        >
          Habits
        </NavLink>
        <NavLink
          to="/overview"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
          onClick={() => setMenuOpen(false)}
        >
          Overview
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
          onClick={() => setMenuOpen(false)}
        >
          Settings
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;