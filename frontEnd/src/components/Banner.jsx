/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStarHalfStroke, faStar } from "@fortawesome/free-solid-svg-icons";

function Banner() {
  return (
    <div className="container mx-auto px-4 py-8 xl-px-24 max-w-screen-2xl">
      {/* <h1 className='text-center text-4xl font-bold text-gray-90 leading-snug'>Notre patisserie <span className='text-red'>binaire</span> on code <span className='text-red'>avec des cônes <FontAwesomeIcon icon={faIceCream} /></span></h1> */}

      <div className="section-container py-16 flex md-flex-col-reverse justify-between items-center gap-8">
        <div className="md-w-half space-y-7 sd-w-full ">
          <h2 className="md-text-5xl text-4xl font-bold md-leading-snug leading-snug">
            {" "}
            La pâtisserie <span className="text-red">gourmande</span>{" "}
            <span className="text-red">elit</span>.
          </h2>
          <p className="text-xl text-gray">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <Link
            to="/recettes"
            className="btn-primary px-8 py-3 font-semibold rounded-full mt-10"
          >
            Voir plus
          </Link>
        </div>

        <div className="md-w-half space-y-7 px-4 sd-w-full text-align-center sd-w-full">
          <img
            src="./images/chef.jpeg"
            alt="banner"
            className="cover rounded-3xl shadow-2xl w-150 md-w-full"
          />
          <div className="flex md-flex-col flex-row gap-10 items-center justify-around -mt-18">
            <div className="flex  bg-white rounded-2xl items-center shadow-md w-64 md-w-full">
              <img
                src="./bavarois.jpeg"
                alt="banner"
                width={125}
                height={150}
                className="rounded-semi md-w-half cover"
              />
              <div className="space-y-1 px-10-md ">
                <h5 className="font-medium mb-1">Bavarois aux fruits rouges</h5>
                <div className="rating rating-sm">
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStarHalfStroke} />
                </div>
                <p className="text-red ">(6 votes)</p>
              </div>
            </div>
            <div className="flex bg-white hidden-md md:flex rounded-2xl items-center shadow-md w-64 sd-w-full ">
              <img
                src="./bavarois.jpeg"
                alt="banner"
                width={125}
                height={150}
                className="rounded-semi"
              />
              <div className="space-y-1 ">
                <h5 className="font-medium mb-1">Bavarois aux fruits rouges</h5>
                <div
                  className="rating rating-sm"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <FontAwesomeIcon icon={faStar} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 576 512"
                  >
                    <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                  </svg>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={18}
                    height={18}
                    viewBox="0 0 576 512"
                  >
                    <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.7 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L384.2 324.1c-1.3-7.7 1.2-15.5 6.8-21l85.9-85.1L358.6 200.5c-7.8-1.2-14.6-6.1-18.1-13.3L287.9 79z" />
                  </svg>
                </div>
                <p className="text-red ">(6 votes)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
