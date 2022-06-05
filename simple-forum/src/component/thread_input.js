import React from "react";
import { useNavigate } from "react-router-dom";
import "./thread.css";
import { Navigate } from "react-router-dom";

// input for creates new threads
function ThreadInput() {
  /**
   * topic, user and text is variables that use for create new threads
   * topic -> holds the topic of a thread
   * user -> user that creates the threads
   * text -> content of the threads
   */
  const [topic, setTopic] = React.useState("");
  const [user, setUser] = React.useState("");
  const [text, setText] = React.useState("");
  const [emptyflag, setflag] = React.useState(false);
  const navigate = useNavigate();

  /**
   * function that submits to create a new threads
   * reads all input fields and set them to empty
   * show warning when one of the field is empty
   * submit when all field is collected using fetch
   */
  async function btn_submit() {
    if (topic === "" || user === "" || text === "") {
      setflag(true);
    } else {
      setTopic("");
      console.log(topic);
      setUser("");
      console.log(user);
      setText("");
      console.log(text);
      setflag(false);

      try {
        fetch("/createThread", {
          method: "POST",
          body: JSON.stringify({
            topic: topic,
            user: user,
            text: text,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((res) => {
            //console.log(res);

            navigate("/page/1");
            window.location.reload();
          });
      } catch (error) {
        console.log(error.response.data);
      }
    }
  } // btn_submit() end

  return (
    <div className="input">
      <div className="input_container">
        <h3 className="header_3">topic</h3>
        <input
          className="input_1"
          value={topic || ""}
          onChange={(e) => setTopic(e.target.value)}
        ></input>
        {emptyflag && topic === "" ? (
          <h4 className="empty_warning">topic can not be empty</h4>
        ) : null}
        <h3 className="header_3">user</h3>
        <input
          className="input_1"
          value={user || ""}
          onChange={(e) => setUser(e.target.value)}
        ></input>
        {emptyflag && user === "" ? (
          <h4 className="empty_warning">user can not be empty</h4>
        ) : null}
        <h3 className="header_3">text</h3>
        <textarea
          className="textarea1"
          value={text || ""}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        {emptyflag && text === "" ? (
          <h4 className="empty_warning">text can not be empty</h4>
        ) : null}
        <button className="submit_btn" onClick={btn_submit}>
          submit
        </button>
      </div>
    </div>
  );
}

export default ThreadInput;
