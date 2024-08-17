import React from "react";

const Navbar: React.FC = () => {
  return (
    <div className="navbar bg-base-100 bg-opacity-50 backdrop-blur-md">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">GreenChain</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="btn btn-ghost">Home</a>
          </li>
          <li>
            <a className="btn btn-ghost">About</a>
          </li>
          <li>
            <a className="btn btn-ghost">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
