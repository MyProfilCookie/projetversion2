/* eslint-disable no-unused-vars */
import React from "react";
import Banner from "../../components/Banner";
import Categories from "./Categories";
import CartePreview from "./CartePreview";
import SectionRecette from "./SectionRecette";
import OurServices from "./OurCategories";
import CompanyLogo from "./CompanyLogo";
import NewsLetter from "./NewsLetter";

import Diaporama from "../../components/Diaporama";

const Home = () => {
  return (
    <div>
      <Banner />
      <NewsLetter />
      <Diaporama />
      <Categories />
      <SectionRecette />
      <CompanyLogo />
      <OurServices />
      <CartePreview />
    </div>
  );
};

export default Home;
