/* eslint-disable no-unused-vars */
import React from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";


const UpdateRecette = () => {
    const item = useLoaderData();
    console.log(item);

    const { register, handleSubmit, reset } = useForm();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("image", data.image[0]);
        formData.append("name", data.name);
        formData.append("description", data.description);
        formData.append("price", data.price);
        formData.append("category", data.category);
        axiosSecure
            .patch(`/recettes/${item._id}`, formData)
            .then((res) => {
                if (res.data.modifiedCount) {
                    reset();
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Your work has been saved",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    navigate("/dashboard/manage-items");
                }
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div className="w-full md:w-[870px] mx-auto px-4 ">
            <h2 className="text-2xl font-semibold my-4">
                Update <span className="text-green">Recette</span>
            </h2>

            {/* menu items table  */}
            <div>
                <div className="overflow-x-auto">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full max-w-lg"
                    >
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-first-name"
                                >
                                    Name
                                </label>
                                <input
                                    {...register("name")}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                    id="grid-first-name"
                                    type="text"
                                    placeholder="Recipe Name"
                                />
                            </div>
                            <div className="w-full md:w-1/2 px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-last-name"
                                >
                                    Price
                                </label>
                                <input
                                    {...register("price")}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-last-name"
                                    type="number"
                                    placeholder="Price"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3">
                                <label
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                    htmlFor="grid-password"
                                >
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    id="grid-password"
                                    type="text"
                                    placeholder="Description"
                                />
                            </div>
                        </div>
                        <div className="flex flex-wrap -mx-3 mb-6">
                            <div className="w-full px-3"></div>
                            <label
                                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                htmlFor="grid-password"
                            >
                                Image
                            </label>
                            <input
                                {...register("image")}
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                id="grid-password"
                                type="file"
                            />
                        </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label
                            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                        >
                            Category
                        </label>
                        <input
                            {...register("category")}
                            className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                            id="grid-password"
                            type="text"
                            placeholder="Category"
                        />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </div>  
      </div >
    </div >
  );
};

export default UpdateRecette;