import { useQuery } from "@tanstack/react-query";
import useAuth from "./useAuth";

const useAdmin = () => {
  const { user, loading } = useAuth();

  const { data: isAdmin = false, isLoading: isAdminLoading, error } = useQuery({
    queryKey: [user?.email, "isAdmin"],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      if (user?.email) {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://localhost:3001/users/admin/${user.email}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        return data.admin;
      }
      return false;
    },
    onError: (error) => {
      console.error("Error fetching admin status:", error);
    },
  });

  return [isAdmin, isAdminLoading, error];
};

export default useAdmin;
