import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { startHomeAction } from "../actions/homeAction";
import {
  startGetCategory,
  startcategoryWiseSplit,
} from "../actions/categoryAction";
import "../style.css";
import { Table } from "antd";
import { Button, Modal } from "antd";
import {
  startGetExpense,
  startPostExpense,
  startPutExpense,
  startGetBudgetOverView,
} from "../actions/expenseAction";
import { startGetBudget } from "../actions/budgetAction";
import { Chart } from "react-google-charts";
import { Progress, Space } from "antd";
import nodata from "../no data.jpg";
import deleteicon from "../delete icon.jpg";
import NavBar from "./NavBar";
import { startDeleteHard } from "../actions/expenseAction";
import ExpenseHoverModal from "./ExpenseHoverModal";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as yup from "yup";

const Home = (props) => {
  const dispatch = useDispatch();

  const [itemName, setItemName] = useState("");
  const [editIsOn, setEditIsOn] = useState(false);
  const [expenseId, setExpenseId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetOverView, setBudgetOverView] = useState({});
  const [categoryWiseSplit, setCategoryWiseSplit] = useState([]);
  const [limitError, setLimitError] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [hoverData, setHoverData] = useState([]);
  const [deleteModOpen, setDeleteModOpen] = useState(false);
  const [deleteModData, setDeleteModData] = useState({});

  useEffect(() => {
    dispatch(startHomeAction(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(startGetCategory());
  }, [dispatch]);

  useEffect(() => {
    dispatch(startGetExpense());
  }, [dispatch]);

  useEffect(() => {
    dispatch(startGetBudget());
  }, [dispatch]);

  useEffect(() => {
    dispatch(startGetBudgetOverView(reDirectTotal));
    function reDirectTotal(data) {
      setBudgetOverView(data);
    }
  }, [dispatch]);

  useEffect(() => {
    dispatch(startcategoryWiseSplit(reDirectSplitData));
    function reDirectSplitData(data) {
      setCategoryWiseSplit(data);
    }
  }, [dispatch]);

  const [categoryData, expenseData, budgetData] = useSelector((state) => {
    return [state.categoryData, state.expenseData, state.budgetData];
  });

  useEffect(() => {
    if (
      budgetData.length !== 0 &&
      Object.keys(budgetOverView).length !== 0 &&
      budgetOverView.length !== 0 &&
      budgetOverView.totalExpense > budgetData[0].amount
    ) {
      setLimitError("Budget limit is Exceeded");
    } else {
      setLimitError("");
    }
  }, [dispatch, budgetData, budgetOverView]);

  const chartData = categoryWiseSplit.map((ele) => {
    return [ele.name, ele.amount];
  });

  chartData.unshift(["Task", "category split"]);

  const validationSchema = yup.object({
    title: yup
      .string()
      .required()
      .min(5, "Title is too Short!")
      .max(10, "Title is too Long!"),
    category: yup.string().required().required("Please select a category"),
    amount: yup.number().positive().required(),
    expenseDate: yup.date(),
  });

  const onSubmit = (values) => {
    const { ...data } = values;
    setIsModalOpen(false);

    if (editIsOn === false) {
      dispatch(startPostExpense(data, reDirect));
      function reDirect() {
        dispatch(startGetExpense());
        dispatch(startGetBudgetOverView(reDirectTotal));
        function reDirectTotal(resData) {
          setBudgetOverView(resData);
        }
        dispatch(startcategoryWiseSplit(reDirectSplitData));
        function reDirectSplitData(resData) {
          setCategoryWiseSplit(resData);
        }
        setEditIsOn(false);
        formik.resetForm();
      }
    } else {
      dispatch(startPutExpense(expenseId, data, reDirect));
      function reDirect() {
        dispatch(startGetExpense());
        dispatch(startGetBudgetOverView(reDirectTotal));
        function reDirectTotal(resData) {
          setBudgetOverView(resData);
        }
        dispatch(startcategoryWiseSplit(reDirectSplitData));
        function reDirectSplitData(resData) {
          setCategoryWiseSplit(resData);
        }
        setEditIsOn(false);
        formik.resetForm();
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      category: "",
      amount: "",
      expenseDate: "",
    },
    validateOnBlur: true,
    validationSchema: validationSchema,
    onSubmit,
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const mouseEnterShowItems = (data) => {
    setHoverData(data);
    setIsHovering(true);
  };

  const mouseOutShowItems = () => {
    setIsHovering(false);
  };

  const handleCancel = () => {
    setEditIsOn(false);
    setIsModalOpen(false);
    formik.resetForm();
  };

  const handleSearch = (e) => {
    setItemName(e.target.value);
  };

  const handleEdit = (data) => {
    // Note category is populated, so that categoryId has nested object
    setIsModalOpen(true);
    setEditIsOn(true);
    formik.setValues({
      title: data.title,
      category: data.category._id,
      amount: data.amount,
      expenseDate: data.expenseDate.slice(0, 10),
    });
    setExpenseId(data._id);
  };

  const handleHardDelete = (record) => {
    setDeleteModOpen(true);
    setDeleteModData(record);
  };

  const deleteFunction = () => {
    (async () => {
      const { value: password } = await Swal.fire({
        title: "Enter your password",
        input: "password",

        inputPlaceholder: "Enter your password",
        inputAttributes: {
          autocapitalize: "off",
          autocorrect: "off",
        },
        showCancelButton: true,
      });

      if (password) {
        dispatch(
          startDeleteHard(
            deleteModData._id,
            password,
            reDirectError,
            reDirectSuccess
          )
        );
        function reDirectSuccess() {
          Swal.fire(`Expense deleted is successful`);
          setDeleteModOpen(false);
          setDeleteModData({});
          dispatch(startGetExpense());
          dispatch(startGetBudgetOverView(reDirectTotal));
          function reDirectTotal(data) {
            setBudgetOverView(data);
          }
          dispatch(startcategoryWiseSplit(reDirectSplitData));
          function reDirectSplitData(data) {
            setCategoryWiseSplit(data);
          }
        }
        function reDirectError() {
          Swal.fire(`Password is Incorrect`);
          setDeleteModOpen(false);
          setDeleteModData({});
        }
      } else {
        setDeleteModOpen(false);
      }
    })();
  };

  const columns = [
    {
      title: "Category",
      render: (record) => {
        return (
          <>
            <p
              style={{
                textDecoration: record.deleted === true && "line-through",
              }}
            >
              {record.category.name}
            </p>
          </>
        );
      },
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "ExpenseDate",
      render: (record) => {
        return (
          <>
            <p>{record.expenseDate.slice(0, 10)}</p>
          </>
        );
      },
    },
    {
      title: "Edit",
      render: (record) => {
        return (
          <>
            <img
              onClick={() => {
                handleEdit(record);
              }}
              src="https://cdn-icons-png.flaticon.com/512/6324/6324968.png"
              width="30px"
              height="30px"
              alt="internet error"
              style={{ cursor: "pointer" }}
            />
          </>
        );
      },
    },
    {
      title: "Hard Delete",
      render: (record) => {
        return (
          <>
            <img
              onClick={() => {
                handleHardDelete(record);
              }}
              src={deleteicon}
              width="35px"
              height="35px"
              alt="internet error"
              style={{ cursor: "pointer" }}
            />
          </>
        );
      },
    },
  ];

  let NoDataLocale = {
    emptyText: (
      <span>
        <p style={{ color: "red", fontSize: "20px" }}>Currently No Data</p>
      </span>
    ),
  };

  let NoSearchLocale = {
    emptyText: (
      <span>
        <p style={{ color: "red", fontSize: "20px" }}>No Items Found</p>
      </span>
    ),
  };

  const chartColumns = [
    {
      title: "Category Name",
      render: (record) => {
        return (
          <>
            <p
              style={{
                textDecoration: record.deleted === true && "line-through",
              }}
            >
              {record.name}
            </p>
          </>
        );
      },
    },
    {
      title: "Expenses Amount",
      dataIndex: "amount",
      key: "amount",
      render: (record, dataIndex) => {
        return (
          <>
            <p
              style={{ cursor: "pointer" }}
              onMouseOver={() => {
                mouseEnterShowItems(dataIndex);
              }}
              onMouseOut={mouseOutShowItems}
            >
              {record}
            </p>
          </>
        );
      },
    },
    {
      title: "Cat Created At",
      render: (record) => {
        return (
          <>
            <p>{record.date.slice(0, 10)}</p>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <NavBar />
      {isHovering && (
        <ExpenseHoverModal hoverData={hoverData} typeData={expenseData} />
      )}

      {deleteModOpen && deleteFunction()}

      <div className="flex-container2" style={{ marginTop: "2rem" }}>
        <div className="flex-child2 green boxshadow">
          <h2> Budget Overview</h2>
          <>
            <div
              className="container2"
              style={{ marginRight: "2.5rem", marginTop: "4rem" }}
            >
              <div>
                <Space wrap>
                  <Progress
                    type="circle"
                    percent={
                      budgetOverView.overAll !== null && budgetOverView.overAll
                    }
                    strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                    width={150}
                  />
                </Space>
              </div>
              <div className="text" style={{ marginLeft: "-0.5rem" }}>
                <h2>
                  {limitError.length !== 0 ? (
                    <span style={{ color: "red" }}>{limitError}</span>
                  ) : (
                    <span style={{ color: "green" }}>
                      Budget Limit is Maintained
                    </span>
                  )}
                </h2>
                <h2>
                  Total Budget - &nbsp;
                  {budgetData.length !== 0 && budgetData[0].amount}
                </h2>
                <h2>
                  Total Expense - &nbsp;
                  {Object.keys(budgetOverView).length !== 0 &&
                    budgetOverView.totalExpense}
                </h2>
              </div>
            </div>
          </>
        </div>

        <div
          className="flex-child2 magenta boxshadow"
          style={{ marginLeft: "1rem" }}
        >
          <>
            <h2> Category Splitwise Overview</h2>
            {categoryWiseSplit.length < 6 ? (
              <>
                {categoryWiseSplit.length === 0 ? (
                  <img
                    style={{ marginLeft: "9rem", marginTop: "2rem" }}
                    src={nodata}
                    width={150}
                    height={150}
                    alt="not found"
                  />
                ) : (
                  <Chart
                    chartType="PieChart"
                    data={chartData.length !== 0 && chartData}
                    width={"100%"}
                    height={"240px"}
                  />
                )}
              </>
            ) : (
              <Table
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  marginLeft: "-0.1rem",
                  width: "100%",
                }}
                dataSource={categoryWiseSplit}
                columns={chartColumns}
                pagination={{
                  defaultPageSize: 2,
                  showSizeChanger: true,
                  pageSizeOptions: ["2"],
                }}
                rowKey="_id"
              />
            )}
          </>
        </div>
      </div>

      <br />

      <Button
        type="primary"
        style={{ cursor: "pointer", marginLeft: "3rem", marginTop: "5rem" }}
        onClick={showModal}
      >
        Add Expense
      </Button>

      <input
        type="text"
        className="inputstyle4"
        style={{ marginLeft: "43rem" }}
        name="itemname"
        value={itemName}
        onChange={handleSearch}
        placeholder="Search Via Item"
      />

      <Modal open={isModalOpen} onCancel={handleCancel} footer={null}>
        <form onSubmit={formik.handleSubmit}>
          <label style={{ color: "red" }}>
            {formik.touched.title && formik.errors.title ? (
              <span>
                {formik.errors.title} <br />
              </span>
            ) : (
              ""
            )}
          </label>
          <input
            type="text"
            className="inputstyle"
            name="title"
            value={formik.values.title}
            placeholder="Enter title"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          <br />
          <label style={{ color: "red" }}>
            {formik.touched.category && formik.errors.category ? (
              <span>
                {formik.errors.category} <br />
              </span>
            ) : (
              ""
            )}
          </label>
          <select
            style={{ cursor: "pointer" }}
            className="inputstyle"
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            {editIsOn === false ? (
              <>
                <option selected={formik.values.category === ""}>
                  Select Category
                </option>
                {categoryData.map((ele) => {
                  return (
                    <Fragment key={ele._id}>
                      <option value={ele._id}>{ele.name}</option>
                    </Fragment>
                  );
                })}
              </>
            ) : (
              <>
                {categoryData.map((ele) => {
                  return (
                    <Fragment key={ele._id}>
                      <option
                        value={ele._id}
                        selected={
                          ele._id === formik.values.category ? true : false
                        }
                      >
                        {ele.name}
                      </option>
                    </Fragment>
                  );
                })}
              </>
            )}
          </select>
          <br />
          <br />
          <label style={{ color: "red" }}>
            {formik.touched.amount && formik.errors.amount ? (
              <span>
                {formik.errors.amount} <br />
              </span>
            ) : (
              ""
            )}
          </label>
          <input
            type="text"
            className="inputstyle"
            name="amount"
            value={formik.values.amount}
            placeholder="Enter Amount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          <br />
          <label style={{ color: "red" }}>
            {formik.touched.expenseDate && formik.errors.expenseDate ? (
              <span>
                {formik.errors.expenseDate} <br />
              </span>
            ) : (
              ""
            )}
          </label>
          <input
            type="date"
            className="inputstyle"
            name="expenseDate"
            value={formik.values.expenseDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <br />
          {editIsOn === false ? (
            <input
              style={{ marginTop: "2rem" }}
              type="submit"
              className="regcolor1"
              value="Add Expense"
            />
          ) : (
            <input
              style={{ marginTop: "2rem" }}
              type="submit"
              className="regcolor5"
              value="Update Expense"
            />
          )}
        </form>
        <button
          style={{ marginTop: "1rem", marginLeft: "25rem" }}
          type="text"
          className="regcolor2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </Modal>
      <div
        style={{
          display: "block",
          width: 1004,
          padding: 30,
        }}
      >
        {expenseData.length >= 0 && (
          <>
            {itemName.length === 0 ? (
              <Table
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  border: "2px solid purple",
                  borderRadius: "8px",
                  marginLeft: "1rem",
                  width: "100%",
                }}
                locale={NoDataLocale}
                dataSource={expenseData}
                columns={columns}
                pagination={{
                  defaultPageSize: 3,
                  showSizeChanger: true,
                  pageSizeOptions: ["2", "4", "6", "10", "20"],
                }}
                rowKey="_id"
              />
            ) : (
              <Table
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  border: "2px solid purple",
                  borderRadius: "8px",
                  marginLeft: "1rem",
                  width: "100%",
                }}
                locale={NoSearchLocale}
                dataSource={expenseData.filter((ele) => {
                  return ele.title
                    .toLowerCase()
                    .includes(itemName.toLowerCase());
                })}
                columns={columns}
                pagination={{
                  defaultPageSize: 2,
                  showSizeChanger: true,
                  pageSizeOptions: ["2", "4", "6", "10", "20"],
                }}
                rowKey="_id"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
