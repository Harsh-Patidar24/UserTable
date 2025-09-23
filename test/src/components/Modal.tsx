// src/components/Modal.jsx
import React, { useState, memo } from 'react';
import Category from "./Category";
import { ModalProps } from '../Types/type';


// type ModalProps = {
//   user: {id: string, name:string, age:number},
//   onClose: () => void,
//   onDelete: (id: string) => void,
//   onUpdate: (user: {id: string, name:string, age:number}) => void
// }

function Modal({ user, onClose, onDelete, onUpdate }: ModalProps) {
  if (!user) return null;

  const [name, setName] = useState<string>(user.name);
  const [age, setAge] = useState<number>(user.age);

  // Check if any changes were made
  const hasChanges = name !== user.name || Number(age) !== user.age;

  const handleUpdate = () => {
    onUpdate({ ...user, name, age: Number(age) });
  };

  const handleCancelUpdate = () => {
    setName(user.name);
    setAge(user.age);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>User Details</h3>

        {/* Always show input fields */}
        <label>
          <strong>Name:</strong>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          <strong>Age:</strong>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />
        </label>
        <p>
          <strong>Category:</strong> <Category age={Number(age)} />
        </p>

        <div className="modal-actions">
          {hasChanges ? (
            <>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={handleCancelUpdate} className="cancel-btn">
                Cancel Update
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose}>Close</button>
              <button onClick={() => onDelete(user.id)} className="delete-btn">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(Modal);