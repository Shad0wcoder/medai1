"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Define the User type
  type User = {
    name: string;
    avatar?: string;
  };
  
  const [user, setUser] = useState<User | null>(null);
  const [currentImage, setCurrentImage] = useState("im1.jpg");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get("/api/auth/user", { withCredentials: true });
        setIsAuthenticated(true);
        setUser(data.user);
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === "im1.jpg" ? "im12.jpg" : "im1.jpg"));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout", {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-white shadow-md mx-auto rounded-lg w-full">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link href="/" onClick={closeMenu}>
          <Image
            src={`/${currentImage}`}
            alt="logo"
            width={60}
            height={60}
            className="transition-opacity duration-500 ease-in-out"
          />
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Navigation Links */}
        <nav
          className={`md:flex items-center md:space-x-8 absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none p-5 md:p-0 transition-transform transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            <li>
              <Link href="/healthnew" className="font-bold text-blue-700 hover:text-blue-400" onClick={closeMenu}>
                Health News
              </Link>
            </li>
            <li>
              <Link href="/about" className="font-bold text-blue-700 hover:text-blue-400" onClick={closeMenu}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="font-bold text-blue-700 hover:text-blue-400" onClick={closeMenu}>
                FAQ
              </Link>
            </li>
          </ul>

          {/* Profile Icon, Login & Logout (Mobile) */}
          <div className="flex flex-col md:hidden mt-4 space-y-4">
            {isAuthenticated && user ? (
              <>
                <Link href="/profile" className="flex items-center space-x-2" onClick={closeMenu}>
                  <Image
                    src={user.avatar || "/profile.jpeg"}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-semibold">{user.name}</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500 w-full">
                    Login
                  </button>
                </Link>
                <Link href="/signup" onClick={closeMenu}>
                  <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500 w-full">
                    Signup
                  </button>
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Profile Icon, Login & Logout (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <Link href="/profile">
                <Image
                  src={user.avatar || '/profile.jpeg'}
                  alt={user.name || "User"}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover cursor-pointer"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-500">
                  Login
                </button>
              </Link>
              <Link href="/signup">
                <button className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500">
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
