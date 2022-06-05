import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";

function ThreadPage(props) {
  //

  /**
   *
   * id -> id in the url -> id number about a specific thread
   * thread -> thread data corresponding to id
   * posts -> post element of this thread
   * DataFlag -> tells whether the client received data from server
   * reply_user -> reply user for creating new post
   * reply_content -> reply content for creating new post
   */
  const navigate = useNavigate();
  let { id } = useParams();
  const [thread, setThread] = React.useState();
  const [posts, setPosts] = React.useState([]);
  const [DataFlag, setFlag] = React.useState(false);

  const [reply_user, setR_User] = React.useState("");
  const [reply_content, setR_content] = React.useState("");

  // call readThread when the component is started
  // only call it once
  useEffect(() => {
    readThread();
  }, []);

  /**
   * readThread() -> fetch and read data from server
   * set value to state objects
   */
  async function readThread() {
    try {
      await fetch("/findThread", {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setThread(res);
          setPosts(res.post);
          setFlag(true);
        });
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * creating new post to server
   * takes id, user and content
   */
  async function createPost() {
    const newId = parseInt(id);

    try {
      fetch("/createPost", {
        method: "POST",
        body: JSON.stringify({
          id: newId,
          user: reply_user,
          content: reply_content,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          //console.log(res);

          navigate("/ThreadPage/" + id);
          window.location.reload();
        });
    } catch (error) {
      console.log(error.response.data);
    }
  }

  return (
    <div className="thread_page">
      {DataFlag ? (
        <Card bg={"light"}>
          <Card.Header className="C-Header">{thread.topic}</Card.Header>
          <Card.Body>
            <Card.Text className="user">User: {thread.user}</Card.Text>
            <Card.Text className="Card_Box">{thread.content}</Card.Text>
          </Card.Body>
        </Card>
      ) : null}
      <div className="sub_post">
        {DataFlag
          ? posts.map((id, index) => {
              return (
                <Card className="Card_subPost" bg={"light"} key={index}>
                  <Card.Body>
                    <Card.Text className="user">
                      User: {posts[index].user}
                    </Card.Text>
                    <Card.Text className="Card_Box">
                      {posts[index].content}
                    </Card.Text>
                  </Card.Body>
                </Card>
              );
            })
          : null}
      </div>

      {DataFlag ? (
        <Card className="Card_input">
          <Card.Header>
            {thread.lock
              ? "Thread is locked, unable to post"
              : "Share your thoughts"}
          </Card.Header>
          <Card.Body className="post_input">
            <p>user</p>
            <input
              type="text"
              value={reply_user || ""}
              onChange={(e) => setR_User(e.target.value)}
              disabled={thread.lock}
            ></input>
            <p>text</p>
            <textarea
              className="textarea2"
              type="text"
              value={reply_content || ""}
              onChange={(e) => setR_content(e.target.value)}
              disabled={thread.lock}
            ></textarea>
            <button
              className="btn_post_input"
              onClick={createPost}
              disabled={thread.lock}
            >
              submit
            </button>
          </Card.Body>
        </Card>
      ) : null}
    </div>
  );
}

export default ThreadPage;
