import {create} from 'zustand';

interface AdminState {
  users: { id: number; email: string; role: string }[];
  platforms: { id: number; name: string; status: string }[];
  setUsers: (users: { id: number; email: string; role: string }[]) => void;
  setPlatforms: (platforms: { id: number; name: string; status: string }[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  platforms: [],
  setUsers: (users) => set({ users }),
  setPlatforms: (platforms) => set({ platforms }),
}));
