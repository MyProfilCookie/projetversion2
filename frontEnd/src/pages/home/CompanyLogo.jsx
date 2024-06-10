/* eslint-disable no-unused-vars */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogleScholar, faGithub, faReact, faStripe, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { useTheme } from "../../hooks/ThemeContext";


const CompanyLogo = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className=" py-24 mt-12">
      <div className="mx-auto max-w-7xl px-6 lg-px-8">
        <h2 className="text-center text-red text-lg font-bold leading-8 text-secondary">
          Pour une experience encore plus authentique
        </h2>
        <div className={`mx-auto mt-10 grid grid-cols-4 items-center gap-x-8 gap-y-10 sm-max-w-xl sm-gap-x-10 lg-mx-0 lg-max-w-none lg-grid-cols-5 && ${isDarkMode ? "bgDark white" : "PrimaryBG"}`}>
          <div
            className="col-span-2 max-h-12 w-full object-contain lg-col-span-1">
            <FontAwesomeIcon icon={faGoogleScholar} style={{ width: 200, height: 48 }} />
          </div>
          <div
            className="col-span-2 max-h-12 w-full object-contain lg-col-span-1">
            <FontAwesomeIcon icon={faGithub} style={{ width: 200, height: 48 }} />
          </div>
          <div
            className="col-span-2 max-h-12 w-full object-contain lg-col-span-1">
            <FontAwesomeIcon icon={faReact} style={{ width: 200, height: 48 }} />


          </div>
          <div
            className="col-span-2 max-h-12 w-full object-contain lg-col-span-1">
            <FontAwesomeIcon icon={faLinkedin} style={{ width: 200, height: 48 }} />

          </div>
          <div
            className="col-span max-h-12 w-full object-contain  lg-col-span-1">
            <FontAwesomeIcon icon={faStripe} style={{ width: 200, height: 48 }} />

          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLogo;
