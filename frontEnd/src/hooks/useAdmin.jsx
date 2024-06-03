import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useAdmin = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: isAdmin = false, isLoading: isAdminLoading, error } = useQuery({
    queryKey: [user?.email, 'isAdmin'],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      if (user?.email) {
        const res = await axiosSecure.get(`/users/admin/${user.email}`);
        return res.data.admin;
      }
      return false;
    },
    onError: (error) => {
      console.error('Error fetching admin status:', error);
    },
  });

  return [isAdmin, isAdminLoading, error];
};

export default useAdmin;