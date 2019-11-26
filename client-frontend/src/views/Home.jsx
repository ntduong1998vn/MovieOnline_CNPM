import React, { useState, useEffect } from "react";
import Feature from "./Feature";
import PopularMovie from "./PopularMovie";
import Banner from "./Banner";
import { getFeaturedMovies } from "../utils/MovieAPI";

const Home = () => {
  const [featureList, setFeatureList] = useState([]);

  useEffect(() => {
    getFeaturedMovies().then(response => setFeatureList(response));
  }, []);

  // console.log(featureList.map(movie => console.log(movie)));

  return (
    <React.Fragment>
      {/* <Banner /> */}
      <PopularMovie />
      <Feature feature={featureList} />
    </React.Fragment>
  );
};

export default Home;
