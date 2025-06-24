import { NavLink } from "react-router-dom";

const Navbar = () => {
  const linkBase = "pb-2 border-b-4";
  const linkActive = "border-gray-300";
  const linkInactive = "border-transparent hover:border-gray-500";

  return (
    <nav className="flex justify-between items-center pt-4 text-white border-b border-gray-300">
      <div className="flex space-x-6">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Habit Tracker
        </NavLink>
      </div>
      <div className="flex space-x-6">
        <NavLink
          to="/habits"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Habits
        </NavLink>
        <NavLink
          to="/overview"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? linkActive : linkInactive}`
          }
        >
          Overview
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;