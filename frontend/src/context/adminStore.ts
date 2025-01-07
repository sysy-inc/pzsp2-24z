import create from 'zustand';

interface AdminState {
  users: { id: number; name: string; email: string; role: string }[];
  platforms: { id: number; name: string; status: string }[];
  setUsers: (users: AdminState['users']) => void;
  setPlatforms: (platforms: AdminState['platforms']) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  platforms: [],
  setUsers: (users) => set({ users }),
  setPlatforms: (platforms) => set({ platforms }),
}));
