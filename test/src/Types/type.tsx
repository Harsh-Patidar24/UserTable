export interface User {
  _id: string;
  name: string;
  lastName: string;
  age: number;
  createdAt?: string;
  updatedAt?: string;
}

export type ModalProps = {
  user: { id: string; name: string; age: number };
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (user: { id: string; name: string; age: number }) => void;
};

export type Counts = {
  childCount: number;
  youngCount: number;
  oldCount: number;
};

export type userRowProps = {
  user: User;
  onSelect: (user: User) => void;
  index: number;
};

export type AddUserFormProps = {
  onAdd: (user: User) => void;
  onCancel: () => void;
};

// export type
