import React from "react";
import ForumPage from "./component/ForumPage";
import { BrowserRouter as Router } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import ThreadPage from "./component/ThreadPage";
import Home from "./component/Home";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Navbar";
import SearchPage from "./component/SearchPage";
import { useNavigate } from "react-router-dom";

import "./App.css";

function App() {
  const [input, setInput] = React.useState("");
  const navigate = useNavigate();

  function search_click() {
    navigate("/search/" + input + "/1");
    window.location.reload();
  }

  return (
    /**
     * this app contains four paths
     * 1. the homepage
     * 2. page shows all threads
     * 3. single page about specific threads
     * 4. search page
     */
    <div className="App">
      <Navbar className="Nav_Bar">
        <Container>
          <Navbar.Brand className="brand" href="/">
            Simple Forum
          </Navbar.Brand>
          <div className="search_bar">
            <input
              value={input || ""}
              onChange={(e) => setInput(e.target.value)}
            ></input>
            <button onClick={search_click}>Search</button>
          </div>
        </Container>
      </Navbar>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/page/:p" element={<ForumPage />} />
        <Route exact path="/search/:string/:p" element={<SearchPage />} />
        <Route exact path="/ThreadPage/:id" element={<ThreadPage />} />
      </Routes>
    </div>
  );
}

export default App;
