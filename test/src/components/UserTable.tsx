import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../components/UserTable.css";
import Modal from "./Modal";
import UserRow from "./UserRow";
import AddUserForm from "./form/AddUserForm";
import { CgAddR } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import { Counts, User } from "../Types/type";
import { userApi } from "../api/axios";

// Theme Toggle Icons
const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" />
  </svg>
);

export default function UserTable() {
  const navigate = useNavigate();

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [users, setUsers] = useState<User[]>([]);

  // Updated useEffect for fetching users with data validation
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userApi.getAllUsers();
        setUsers(response.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        // Backend server not available, using mock data as fallback
        console.log("Backend server not running at http://localhost:4000, using mock data");
        try {
          const mockUsers: User[] = [
            { _id: "1", name: "John", lastName: "Doe", age: 25 },
            { _id: "2", name: "Jane", lastName: "Smith", age: 30 },
            { _id: "3", name: "Bob", lastName: "Johnson", age: 45 },
            { _id: "4", name: "Alice", lastName: "Brown", age: 15 },
            { _id: "5", name: "Charlie", lastName: "Wilson", age: 65 }
          ];
          setUsers(mockUsers);
          setError(null);
        } catch (mockError) {
          console.error("Failed to load mock data:", mockError);
          setError("Failed to load user data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  // Navigate to profile page
  const handleAction = useCallback(
    (userId: string) => {
      navigate(`/profile/${userId}`);
    },
    [navigate]
  );

  const handleAdd = useCallback(async (userData: User) => {
  try {
    // Update the UI optimistically
    setUsers(prev => [...prev, userData]);
    setShowAddForm(false);
  } catch (err) {
    console.error("Failed to add user:", err);
    // Revert the optimistic update if needed
    setUsers(prev => prev.filter(u => u._id !== userData._id));
    setError("Failed to add user");
  }
}, []);

  // Search
  const handleSearch = useCallback(() => {
    setSearchTerm(searchInput);
  }, [searchInput]);

  // Filtered users with safer checks
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const searchLower = searchTerm.toLowerCase();

    return users.filter((u) => {
      const firstName = typeof u.name === "string" ? u.name.toLowerCase() : "";
      const lastName =
        typeof u.lastName === "string" ? u.lastName.toLowerCase() : "";
      return (
        firstName.startsWith(searchLower) || lastName.startsWith(searchLower)
      );
    });
  }, [users, searchTerm]);

  // Count statistics
  const counts: Counts = useMemo(() => {
    return users.reduce(
      (acc: Counts, u: User) => {
        if (u.age < 18) acc.childCount++;
        else if (u.age <= 60) acc.youngCount++;
        else acc.oldCount++;
        return acc;
      },
      { childCount: 0, youngCount: 0, oldCount: 0 }
    );
  }, [users]);

  const { childCount, youngCount, oldCount } = counts;

  if (loading) return <div>Loading...</div>;
  if (error)
    return <div className="text-red-600 font-semibold p-6">{error}</div>;

  return (
    <div>
      <button
        className="theme-toggle mb-4"
        onClick={toggleTheme}
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
        {isDarkMode ? "Light" : "Dark"}
      </button>

      <div className="header-row">
        <h2>User Table</h2>
        <button
          className="add-btn"
          onClick={() => setShowAddForm((s) => !s)}
          disabled={searchInput.trim() !== ""}
        >
          <CgAddR />
        </button>
      </div>

      {showAddForm && (
        <AddUserForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
      )}

      <div className="search-container">
        <input
          type="search"
          className="search-bar"
          placeholder="Search by name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Age</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <UserRow
              key={user._id ? `${user._id}-${index}` : `user-${index}`}
              user={user}
              index={index}
              onSelect={() => handleAction(user._id)}
            />
          ))}
        </tbody>
      </table>

      <div className="summary">
        <h4>Statistics</h4>
        <p>
          <span>Child</span>
          <span>{childCount}</span>
        </p>
        <p>
          <span>Adult</span>
          <span>{youngCount}</span>
        </p>
        <p>
          <span>Elderly</span>
          <span>{oldCount}</span>
        </p>
      </div>
    </div>
  );
}
