import React from "react";
import { useNavigate } from "react-router-dom";

/**
 * home page of the website
 * @returns returns a button
 */
function Home() {
  // navigate use to navigate to specific url
  const navigate = useNavigate();

  /**
   * go to /page/1 when onclick
   */
  function onClick() {
    navigate("/page/1");
  }

  return (
    <div className="FrontPage">
      <h1 className="forum_name">Simple Forum</h1>
      <button onClick={onClick}>Enter</button>
    </div>
  );
}

export default Home;
