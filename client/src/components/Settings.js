import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startHomeAction } from "../actions/homeAction";
import { startGetBudget, startPutBudget } from "../actions/budgetAction";
import { startPostCategory } from "../actions/categoryAction";
import { startGetCategory } from "../actions/categoryAction";
import { startDeleteCategory } from "../actions/categoryAction";
import { startUndoCategoryDelete } from "../actions/categoryAction";
import "../style.css";
import NavBar from "./NavBar";
import deleteicon3 from "../delete icon3.jpg";
import SoftDeletedModal from "./SoftDeletedModal";
import "animate.css";

const Settings = (props) => {
  const dispatch = useDispatch();
  const [budgetValue, setBudgetValue] = useState("");
  const [categoryValue, setCategoryValue] = useState("");
  const [currentCategoryData, setCurrentCategoryData] = useState([]);
  const [softDeletedData, setSoftDeletedData] = useState([]);
  const [isOpen, setIsopen] = useState(false);

  useEffect(() => {
    dispatch(startHomeAction(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(startGetBudget());
  }, [dispatch]);

  useEffect(() => {
    dispatch(startGetCategory());
  }, [dispatch]);

  const budgetData = useSelector((state) => {
    return state.budgetData;
  });

  const categoryData = useSelector((state) => {
    return state.categoryData;
  });

  useEffect(() => {
    const nonDeleted = categoryData.filter((ele) => {
      return ele.deleted === false;
    });
    const deleted = categoryData.filter((ele) => {
      return ele.deleted === true;
    });
    setCurrentCategoryData(nonDeleted);
    setSoftDeletedData(deleted);
  }, [categoryData]);

  const modalclosefun = () => {
    setIsopen(false);
  };

  const handleFirstSubmit = (e) => {
    e.preventDefault();
    if (budgetValue) {
      const formData = {
        amount: budgetValue,
      };
      dispatch(startPutBudget(budgetData[0]._id, formData));
      setBudgetValue("");
    }
  };

  const handleSecondSubmit = (e) => {
    e.preventDefault();
    if (categoryValue) {
      const formData = {
        name: categoryValue,
      };
      dispatch(startPostCategory(formData, reDirect));
      setCategoryValue("");
      function reDirect() {
        dispatch(startGetCategory());
      }
    }
  };

  const handleSeeSoftedCats = () => {
    setIsopen(true);
    dispatch(startGetCategory());
  };

  const handleDelete = (id) => {
    dispatch(startDeleteCategory(id, reDirect));
    function reDirect() {
      dispatch(startGetCategory());
    }
  };

  const handleUndoDelete = (record) => {
    dispatch(startUndoCategoryDelete({ id: record._id }, reDirect));
    function reDirect() {
      dispatch(startGetCategory());
      setIsopen(true);
    }
  };

  const handleChange = (e) => {
    let name = e.target.name;
    const value = e.target.value;
    if (name === "budgetvalue") {
      setBudgetValue(value);
    } else if ((name = "categoryvalue")) {
      setCategoryValue(value);
    }
  };

  return (
    <>
      {isOpen && (
        <SoftDeletedModal
          modalclosefun={modalclosefun}
          softDeletedData={softDeletedData}
          handleUndoDelete={handleUndoDelete}
        />
      )}
      <NavBar />
      <div className="box5 center boxshadow2" style={{ marginTop: "4rem" }}>
        <form onSubmit={handleFirstSubmit}>
          <label style={{ fontSize: "20px", fontFamily: "fanstasy" }}>
            Total Budget
          </label>
          <input
            className="inputstyle"
            style={{ marginLeft: "3rem", fontSize: "16px" }}
            type="text"
            name="budgetvalue"
            value={budgetValue}
            onChange={handleChange}
            placeholder={budgetData.length !== 0 ? budgetData[0].amount : 0}
          />
          &nbsp;&nbsp;&nbsp;
          <input
            className="regcolor1"
            style={{ marginLeft: "3rem" }}
            type="submit"
            value="Update"
          />
        </form>
      </div>

      <div className="box5 center boxshadow2" style={{ marginTop: "3rem" }}>
        <form onSubmit={handleSecondSubmit}>
          <label style={{ fontSize: "20px", fontFamily: "fanstasy" }}>
            Categories
          </label>
          <input
            className="inputstyle"
            style={{ marginLeft: "3rem" }}
            type="text"
            name="categoryvalue"
            value={categoryValue}
            onChange={handleChange}
            placeholder="Category Name Here"
          />
          &nbsp;&nbsp;&nbsp;
          <input
            className="regcolor1"
            style={{ marginLeft: "3rem" }}
            type="submit"
            value="Add"
          />
        </form>
      </div>
      <br />

      <div
        className="box6 boxshadow3"
        style={{ marginTop: "2.5rem", marginLeft: "23.5rem" }}
      >
        <h2>
          List of Categories
          <span
            className="animate__animated animate__flash animate__fast	800ms animate__infinite infinite"
            style={{ fontSize: "15px", marginLeft: "4rem" }}
          >
            Click for &nbsp;
          </span>
          <button
            className="regcolor1"
            style={{
              backgroundColor: "#F5B50C",
              color: "black",
              fontWeight: "bold",
              textDecoration: "bold",
            }}
            onClick={handleSeeSoftedCats}
          >
            Soft Deleted Data
          </button>
        </h2>
        <ol>
          {currentCategoryData.length === 0 ? (
            <>
              <hr style={{ marginRight: "3rem", marginTop: "1.5rem" }} />
              <h2 style={{ marginLeft: "10rem", color: "GrayText" }}>
                No Data
              </h2>
            </>
          ) : (
            currentCategoryData.map((ele) => {
              return (
                <Fragment key={ele._id}>
                  <li>
                    <span style={{ fontSize: "20px" }}>
                      {ele.name}
                      <img
                        style={{ marginLeft: "1rem", cursor: "pointer" }}
                        onClick={() => {
                          handleDelete(ele._id, ele.name);
                        }}
                        src={deleteicon3}
                        width="35px"
                        height="35px"
                        alt="internet error"
                      />
                    </span>
                  </li>
                  <br />
                </Fragment>
              );
            })
          )}
        </ol>
      </div>
    </>
  );
};

export default Settings;
