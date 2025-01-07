import { useAdminStore } from '../context/adminStore';

export const useAdmin = () => {
  const { users, platforms, setUsers, setPlatforms } = useAdminStore();
  return { users, platforms, setUsers, setPlatforms };
};
