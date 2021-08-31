import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div className="jumbotron">

      <h2>Welcome to Interview Book</h2>
      <p className="lead">Share details about the interview processes you have been through.</p>

    </div>
    <div className="container">
      <Posts />
    </div>
  </div>
);

export default Home;
