import React from "react";
import ThreadList from "./ThreadList";
import ThreadInput from "./thread_input";

function ForumPage() {
  /**
   * contains two part in this component
   * 1. a list of threads to show
   * 2. the input section for user to create new threads
   */
  return (
    <div className="ForumPage">
      <ThreadList></ThreadList>
      <ThreadInput></ThreadInput>
    </div>
  );
}

export default ForumPage;
