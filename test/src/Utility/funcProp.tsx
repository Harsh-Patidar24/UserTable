// src/utils/userUtils.ts
import { User, Counts } from "../Types/type"

// Count category statistics
export function calculateCounts(users: User[]): Counts {
  return users.reduce(
    (acc: Counts, user: User) => {
      if (user.age < 18) acc.childCount++
      else if (user.age <= 60) acc.youngCount++
      else acc.oldCount++
      return acc
    },
    { childCount: 0, youngCount: 0, oldCount: 0 }
  )
}

// Filter users by search term
export function filterUsers(users: User[], search: string): User[] {
  const lower = search.toLowerCase();
  return users.filter((u) =>
    u.name.toLowerCase().startsWith(lower) ||
    u.lastName.toLowerCase().startsWith(lower)
  );
}


// Get user by ID (for profile page)
export function getUserById(users: User[], id: string | undefined): User | null {
  if (!id) return null
  return users.find((u) => u._id === id) || null
}
