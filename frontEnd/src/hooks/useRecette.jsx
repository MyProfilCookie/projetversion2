// eslint-disable-next-line no-unused-vars
import React from "react";
import useAxiosPublic from "./useAxiosPublic";
import { useQuery } from "@tanstack/react-query";

const useRecette = () => {
  const axiosPublic = useAxiosPublic();

  const {
    data: menu = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["recette"],
    queryFn: async () => {
      const res = await axiosPublic.get("/recettes");
      console.log(res);
      return res.data;
    },
  });

  return [menu, loading, refetch];
};

export default useRecette;
