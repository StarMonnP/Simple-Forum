// server/index.js

const express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(path.resolve(__dirname, "simple-forum/build"))); //for cloud platform

// mongo db
const { MongoClient, ServerApiVersion } = require("mongodb");

// url to connect to mongodb
const uri = "your access to mongodb here";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const collect_1 = client.db("Simple-Forum").collection("topics");
client.connect(); // connect to mongodb, only connect once in app lifetime

/**
 * this function takes three augments and creates a thread
 * data upload to database
 * @param {*} topic must be string
 * @param {*} user must be string
 * @param {*} content must be string
 */
async function createThread(topic, user, content) {
  const threadTemp = {
    threadId: 0,
    topic: topic,
    user: user,
    content: content,
    postCount: 0,
    post: [],
    lock: false,
  };
  try {
    var threadId;
    // get a id for the thread
    await getthreadNumber().then((res) => (threadId = res));
    // update the id count
    await threadNumPlusOne();

    threadTemp.threadId = threadId;
    const result = await client
      .db("Simple-Forum")
      .collection("topics")
      .insertOne(threadTemp);
  } catch (e) {
    console.error(e);
  } finally {
  }
}

/**
 * this function takes three parameters and creates a post under a thread
 * @param {*} threadId  id to find which thread to reply to
 * @param {*} user      user who replys
 * @param {*} content   content that the user reply to thread
 */
async function createPost(threadId, user, content) {
  try {
    const thread = { threadId: threadId };

    // look for the thread in the database
    const data = await client
      .db("Simple-Forum")
      .collection("topics")
      .findOne(thread);

    // read the postId for new post
    const postId = data.postCount;
    // update postId
    data.postCount = postId + 1;

    const post = {
      postId: postId,
      user: user,
      content: content,
    };

    // update post element in the object
    data.post.push(post);
    const update = {
      $set: data,
    };

    const result = await client
      .db("Simple-Forum")
      .collection("topics")
      .updateOne(thread, update);
    return result;
  } catch (e) {
    console.error(e);
  } finally {
  }
}

/**
 * this function delete a thread base on threadId provided
 * @param {*} threadId unique threadId
 */
async function deleteThread(threadId) {
  try {
    // Connect to the MongoDB cluster

    const del_thread = { threadId: threadId };

    const result = await client
      .db("Simple-Forum")
      .collection("topics")
      .deleteOne(del_thread);
  } catch (e) {
    console.error(e);
  } finally {
  }
}

/**
 *
 * @param {*} threadId
 * @param {*} postId
 */
async function deletePost(threadId, postId) {
  try {
    // Connect to the MongoDB cluster

    const thread = { threadId: threadId };
    const data = await client
      .db("Simple-Forum")
      .collection("topics")
      .findOne(thread);
    const postArr = data.post;
    const index = postArr.findIndex((e) => e.postId === postId);
    if (index === -1) {
      console.log(postId + "not found");
    } else {
      data.post.splice(index, 1);
      const update = {
        $set: data,
      };

      const result = await client
        .db("Simple-Forum")
        .collection("topics")
        .updateOne(thread, update);
    }
  } catch (e) {
    console.error(e);
  } finally {
  }
}

/**
 *
 * @param {*} id -> threadId to look for the thread in database
 * @returns
 */
async function findThread(id) {
  try {
    const num = parseInt(id); //in case it is not int
    var search_string = { threadId: num };
    const data = await client
      .db("Simple-Forum")
      .collection("topics")
      .findOne(search_string);
    //console.log(data);
    return data;
  } catch (e) {
    console.log(e);
  }
}

/**
 *  intialize the data into database
 *  threadNumber -> counts how many thread has been created, never decreament on this event threads deleted
 *  shouldn't call when you have it inside database
 */
async function initialize_Data() {
  const data = {
    title: "threadCounts",
    threadNumber: 0,
  };

  try {
    const result = await client
      .db("Simple-Forum")
      .collection("topics")
      .insertOne(data);
    console.log(result);
  } catch (e) {
    console.error(e);
  } finally {
  }
}

/**
 *
 * @returns return the number of current exist thread
 */
async function getthreadNumber() {
  try {
    const data = await client
      .db("Simple-Forum")
      .collection("topics")
      .findOne({ title: "threadCounts" });
    const number = await data.threadNumber;

    return number;
  } catch (e) {
    console.error(e);
    number = -1;
  } finally {
  }
}

/**
 * this function search for the threadnumbers store in databse and +1 to it
 * should be call after each thread create
 */
async function threadNumPlusOne() {
  try {
    var threadNum;
    await getthreadNumber().then((res) => (threadNum = res + 1));

    const updateData = {
      $set: {
        threadNumber: threadNum,
      },
    };
    const result = await client
      .db("Simple-Forum")
      .collection("topics")
      .updateOne({ title: "threadCounts" }, updateData);
  } catch (e) {
    console.error(e);
  } finally {
  }
}

/**
 *
 * @returns all threads from database
 */
async function readAllThread() {
  try {
    const result = await client.db("Simple-Forum").collection("topics").find();

    var threadArr = [];

    await result.forEach((result) => threadArr.push(result));
    await threadArr.splice(0, 1);
    return threadArr;
  } catch (e) {
    console.error(e);
  } finally {
  }
} //end of readAllThread

/**
 * get the corresponding threads according to page number
 * @param {*} pageNumber each page contains 12 threads
 * @returns
 */
async function readThreadsByPage(pageNumber) {
  const data = await readAllThread();
  const data2 = await data.reverse(); // newest at top
  // cut 12 threads from all the threads
  const data3 = await data2.slice(
    0 + (pageNumber - 1) * 12,
    12 + (pageNumber - 1) * 12
  );
  return data3;
}

/**
 *
 * @returns total page number base on how many threads in database
 * used to build page button
 */
async function getPageNumber() {
  const data = await readAllThread();
  const page = await Math.ceil((await data.length) / 12);
  return page;
}

/**
 * search function to search threads
 * @param {*} page -> 1 for default, get 12 threads for coresponding page number
 * @param {*} string -> string to search with
 * @returns
 */
async function search(page, string) {
  const data = await readAllThread();
  const data2 = await data.reverse();
  const data3 = await data2.filter((data2) =>
    data2.topic.toLowerCase().includes(string.toLowerCase())
  );
  const data4 = await data3.slice(0 + (page - 1) * 12, 12 + (page - 1) * 12);

  // here return length -> to calculate page number
  // threads -> threads data
  const result = {
    length: data3.length,
    threads: data4,
  };

  return result;
}

// server to client side

app.post("/createThread", (req, res) => {
  const data = req.body;
  createThread(data.topic, data.user, data.text);
  res.json({ code: "200" });
});

app.get("/getAllThread", async (req, res) => {
  const data = await readAllThread();
  res.json(data);
});

app.get("/getePageNumber", async (req, res) => {
  const data = await getPageNumber();
  res.json(data);
});

app.post("/getThreadByPage", async (req, res) => {
  const page = req.body.page;
  const thread = await readThreadsByPage(page);

  res.json(thread);
});

app.post("/search", async (req, res) => {
  const page = req.body.page;
  const str = req.body.string;
  const searchResult = await search(page, str);

  res.json(searchResult);
});

app.post("/findThread", async (req, res) => {
  const id = req.body.id;
  const thread = await findThread(id);

  res.json(thread);
});

app.post("/createPost", async (req, res) => {
  const id = req.body.id;
  const user = req.body.user;
  const content = req.body.content;
  const thread = await createPost(id, user, content);

  res.json(thread);
});

// don't delete -> how to deal with returning Promise { <pending> }
async function workAround() {
  const num = await getthreadNumber();
  console.log(num);
}

async function testAllRead() {
  const num = await findThread(8);
  console.log(num);
}

// execute functions

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "simple-forum/build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
