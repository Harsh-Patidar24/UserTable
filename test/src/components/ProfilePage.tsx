// src/pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userApi } from "../api/axios";
import { User } from "../Types/type";
import { useToast } from "./ToastContainer";
import {
  FaArrowLeft,
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaUserCircle,
  FaSun,
  FaMoon,
  FaSpinner,
} from "react-icons/fa";
import { MdOutlineCalendarToday, MdPerson } from "react-icons/md";
import Category from "./Category";

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  });

  const getCategory = (age: number) => {
    if (age < 18) return "Child";
    if (age <= 60) return "Adult";
    return "Elderly";
  };

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsDarkMode(!isDarkMode);
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
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to fetch user data");
        showToast("Failed to fetch user data", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleDelete = async () => {
    if (!user?._id) return;

    if (!window.confirm(`Are you sure you want to delete ${user.name} ${user.lastName}?`)) {
      return;
    }

    try {
      const response = await userApi.deleteUser(user._id);

      if (response.status === 200 || response.status === 204) {
        showToast(`User ${user.name} ${user.lastName} deleted successfully!`, "success");
        navigate("/");
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user:", err);
      showToast("Failed to delete user", "error");
    }
  };


  const handleSave = async () => {
    if (!user?._id) return;

    if (!editName.trim() || !editLastName.trim() || !editAge.trim()) {
      showToast("Please fill in all fields", "error");
      return;
    }

    const ageNum = Number(editAge);
    if (!Number.isInteger(ageNum) || ageNum < 0) {
      showToast("Please enter a valid age", "error");
      return;
    }
    try {
      const updatedUser = {
        name: editName.trim(),
        lastName: editLastName.trim(),
        age: ageNum,
      };

      await userApi.updateUser(user._id, updatedUser);
      setUser({ ...user, ...updatedUser });
      showToast(`User ${updatedUser.name} ${updatedUser.lastName} updated successfully!`, "success");
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update user:", err);
      showToast("Failed to update user", "error");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditName(user?.name || "");
    setEditLastName(user?.lastName || "");
    setEditAge(user?.age.toString() || "");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <FaSpinner className="loading-spinner" />
          <p>Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate("/")} className="back-home-btn">
            <FaArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error-state">
          <p className="error-message">User not found</p>
          <button onClick={() => navigate("/")} className="back-home-btn">
            <FaArrowLeft /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* Theme Toggle */}
      <button onClick={toggleTheme} className="theme-toggle">
        <span className="theme-toggle-icon">
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </span>
        <span className="theme-toggle-text">
          {isDarkMode ? 'Light' : 'Dark'}
        </span>
      </button>

      {/* Back Button */}
      <button onClick={() => navigate("/")} className="back-button">
        <FaArrowLeft className="back-icon" />
        <span>Back to Users</span>
      </button>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <FaUserCircle className="avatar-icon" />
          </div>
          <div className="profile-title">
            <h1>User Profile</h1>
            <p>Manage user information</p>
          </div>
        </div>

        {/* User Details */}
        <div className="profile-content">
          {!isEditing ? (
            <>
              {/* View Mode */}
              <div className="user-details">
                <div className="detail-group">
                  <label>
                    <FaUser className="detail-icon" />
                    First Name
                  </label>
                  <div className="detail-value">{user.name}</div>
                </div>

                <div className="detail-group">
                  <label>
                    <FaUser className="detail-icon" />
                    Last Name
                  </label>
                  <div className="detail-value">{user.lastName}</div>
                </div>

                <div className="detail-group">
                  <label>
                    <MdOutlineCalendarToday className="detail-icon" />
                    Age
                  </label>
                  <div className="detail-value">{user.age} years old</div>
                </div>

                <div className="detail-group">
                  <label>
                    <MdPerson className="detail-icon" />
                    Category
                  </label>
                  <div className="detail-value">
                    <Category age={user.age} />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="profile-actions">
                <button onClick={() => setIsEditing(true)} className="edit-btn">
                  <FaEdit className="btn-icon" />
                  Edit Profile
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  <FaTrash className="btn-icon" />
                  Delete User
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Edit Mode */}
              <div className="edit-form">
                <div className="form-group">
                  <label>
                    <FaUser className="form-icon" />
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter first name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <FaUser className="form-icon" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MdOutlineCalendarToday className="form-icon" />
                    Age
                  </label>
                  <input
                    type="number"
                    value={editAge}
                    onChange={(e) => setEditAge(e.target.value)}
                    placeholder="Enter age"
                    min="0"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>
                    <MdPerson className="form-icon" />
                    Category Preview
                  </label>
                  <div className="category-preview">
                    <Category age={Number(editAge) || 0} />
                  </div>
                </div>
              </div>

              {/* Save/Cancel Buttons */}
              <div className="profile-actions">
                <button onClick={handleSave} className="save-btn">
                  <FaSave className="btn-icon" />
                  Save Changes
                </button>
                <button onClick={handleCancel} className="cancel-btn">
                  <FaTimes className="btn-icon" />
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
