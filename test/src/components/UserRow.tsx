import Category from "./Category";
import { userRowProps } from "../Types/type";

function UserRow({ user, onSelect, index }: userRowProps) {
  return (
    <tr
      onClick={() => onSelect(user)}
      style={{ cursor: "pointer" }}
    >
      <td>{index + 1}</td>
      <td>{user.name + " " + user.lastName}</td>
      <td>{user.age}</td>
      <td><Category age={user.age} /></td>
    </tr>
  );
}

export default UserRow;
