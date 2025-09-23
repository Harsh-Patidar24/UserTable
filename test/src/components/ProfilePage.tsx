// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../api/axios";
import { User } from "../Types/type";
import {
  FaArrowLeft,
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import { MdOutlineCalendarToday, MdPerson } from "react-icons/md";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const getCategory = (age: number) => {
    if (age < 18) return "Child";
    if (age <= 60) return "Adult";
    return "Elderly";
  };

  // Fetch user from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const response = await userApi.getUserById(id);
        const userData: User = response.data;

        setUser(userData);
        setEditName(userData.name);
        setEditLastName(userData.lastName);
        setEditAge(userData.age.toString());
        setEditCategory(getCategory(userData.age));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
  if (!user?._id) return;

  try {
    // Call backend delete API
    const response = await userApi.deleteUser(user._id); // Make sure userApi.deleteUser sends DELETE to `/users/${id}`

    if (response.status === 200 || response.status === 204) {
      alert("User deleted successfully");
      navigate("/"); // redirect after deletion
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (err) {
    console.error("Failed to delete user:", err);
    alert("Failed to delete user");
  }
};


  const handleSave = async () => {
    if (!user?._id) return;

    try {
      const updatedUser = {
        name: editName.trim(),
        lastName: editLastName.trim(),
        age: Number(editAge),
      };

      await userApi.updateUser(user._id, updatedUser);
      setUser({ ...user, ...updatedUser });
      setEditCategory(getCategory(Number(editAge)));
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="p-6 text-red-600 font-semibold">{error}</div>;
  if (!user) return <div className="p-6 text-red-600 font-semibold">User not found</div>;

  return (
    <div className="user-profile">
      <button
        onClick={() => navigate(-1)}
        className="back-button absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
      >
        <FaArrowLeft className="icon" /> Back
      </button>

      <div className="flex flex-col items-center mb-6">
        <FaUserCircle className="text-gray-400" size={80} />
        <h2 className="text-2xl font-bold text-gray-800 mt-2">User Profile</h2>
      </div>

      {!isEditing ? (
        <>
          {/* View Mode */}
          <div className="user-details">
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" value={user.name} disabled />
            </div>
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" value={user.lastName} disabled />
            </div>
            <div className="input-group">
              <MdOutlineCalendarToday className="icon" />
              <input type="number" value={user.age} disabled />
            </div>
            <div className="input-group">
              <MdPerson className="icon" />
              <input type="text" value={editCategory} disabled />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="button-group">
            <button onClick={() => setIsEditing(true)} className="update-button">
              <FaEdit className="icon" /> Edit
            </button>
            <button onClick={handleDelete} className="delete-button">
              <FaTrash className="icon" /> Delete
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Edit Mode */}
          <div className="user-details">
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter Name"
              />
            </div>
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                value={editLastName}
                onChange={(e) => setEditLastName(e.target.value)}
                placeholder="Enter Last Name"
              />
            </div>
            <div className="input-group">
              <MdOutlineCalendarToday className="icon" />
              <input
                type="number"
                value={editAge}
                onChange={(e) => {
                  setEditAge(e.target.value);
                  setEditCategory(getCategory(Number(e.target.value)));
                }}
                placeholder="Enter Age"
              />
            </div>
            <div className="input-group">
              <MdPerson className="icon" />
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option value="Child">Child</option>
                <option value="Adult">Adult</option>
                <option value="Elderly">Elderly</option>
              </select>
            </div>
          </div>

          {/* Save / Cancel Buttons */}
          <div className="button-group">
            <button onClick={handleSave} className="update-button">
              <FaSave className="icon" /> Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditName(user.name);
                setEditLastName(user.lastName);
                setEditAge(user.age.toString());
                setEditCategory(getCategory(user.age));
              }}
              className="cancel-button"
            >
              <FaTimes className="icon" /> Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
