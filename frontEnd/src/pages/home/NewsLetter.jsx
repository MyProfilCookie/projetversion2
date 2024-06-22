/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import React from "react";

const NewsLetter = () => {
  return (
    <div className="w-full media-w-2-3 mx-auto flex flex-col items-center p-10 mt-12">
      <h3 className="text-secondary font-semibold text-center text-4xl">
        Enregistrez vous à la newsletter pour recevoir les nouvelles recettes.
      </h3>
      <p className="mt-6 text-gray-600 text-lg text-center leading-normal font-light">
        Recevez nos dernières recettes quotidiennes.
        <br />
        Et ça en quelques minutes !
      </p>
      <div className="mt-6 flex flex-col media-flex-row items-center justify-center w-full md:px-8 gap-4 mb-20">
        <input
          className="flex flex-grow px-4 py-4 rounded-md text-gray-500 outline-none  placeholder-text-[##1b2629]"
          placeholder="Pseudo"
          style={{ border: "none" }}
        />
        <input
          className="flex flex-grow px-4 py-4 rounded-md text-gray-500 outline-none  placeholder-text-[##1b2629] "
          placeholder="Email Address"
          style={{ border: "none" }}
        />
        <button
          className="md:mt-0 md:ml-2 bg-btnColor hover:text-secondary outline-none hover:border hover:border-btnColor hover:bg-[#f9f7f3]  text-white shadow-lg rounded-md px-8 py-4 "
          style={{
            border: "none",
            backgroundColor: "#ff4747",
            cursor: "pointer",
          }}
        >
          C'est parti !
        </button>
      </div>
    </div>
  );
};

export default NewsLetter;
