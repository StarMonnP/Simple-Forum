import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { useNavigate, useParams } from "react-router-dom";

function SearchPage() {
  /**
   * threads -> array of threads received from server
   * pageNum -> how many pages total in the database, received as number but transform into a array(for later map function)
   * dataReceived -> check whether the data is received, load the component only after the data is recevied
   * navigate -> use to navigate to other path
   * p -> page number of current url
   */
  const [threads, setThreads] = React.useState([]);
  const [pageNum, setPageNum] = React.useState([]);
  const [dataReceived, setdataReceived] = React.useState(false);
  const navigate = useNavigate();
  let { p, string } = useParams();

  // calling getAllData() when the page is load and only call it once wiht empty bracket
  useEffect(() => {
    getAllData();
  }, []);

  // force to refresh the page when clicking the back button on browser
  window.onpopstate = function (event) {
    window.location.reload();
  };

  /**
   * get all the data when this path is being access
   * use two fetch to get 1. total page number 2. the 12 threads for a specific page
   * set all corresponding values using setState functions
   */
  async function getAllData() {
    try {
      await fetch("/search", {
        method: "POST",
        body: JSON.stringify({
          page: p,
          string: string,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setThreads(res.threads);

          // pNum -> how many page numbers
          // using forloop to push into array for later map functon
          const pNum = Math.ceil(res.length / 12);
          const pageArr = [];
          for (let i = 1; i <= pNum; i++) {
            pageArr.push(i);
          }
          setPageNum(pageArr);
        });

      setdataReceived(true);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  /**
   *
   * @param {*} page page number enter to reload the page
   * this function will navigate the same path with different page number
   * function will trigger when clicked on page button
   * simply navigate to a page and then reload the page
   */
  async function changePage(page) {
    navigate("/search/" + string + "/" + page);
    window.location.reload();
  }

  /**
   * returning two parts, one with a list of threads, and another one with a list of button
   */
  return (
    <div className="search_page">
      {dataReceived
        ? threads.map((id, index) => {
            if (index % 2 === 0) {
              return (
                <Card className="Card_setting_1" key={index}>
                  <Link
                    className="link"
                    style={{ textDecoration: "none", color: "black" }}
                    to={"/ThreadPage/id=" + threads[index].threadId}
                  >
                    {threads[index].topic}
                  </Link>
                </Card>
              );
            } else {
              return (
                <Card className="Card_setting_2" key={index}>
                  <Link
                    className="link"
                    style={{ textDecoration: "none", color: "black" }}
                    to={"/ThreadPage/id=" + threads[index].threadId}
                  >
                    {threads[index].topic}
                  </Link>
                </Card>
              );
            }
          })
        : null}

      <div>
        {dataReceived
          ? pageNum.map((id, index) => {
              return (
                <button
                  className="page_btn"
                  key={index}
                  onClick={() => changePage(index + 1)}
                >
                  {index + 1}
                </button>
              );
            })
          : null}
      </div>
    </div>
  );
}

export default SearchPage;
