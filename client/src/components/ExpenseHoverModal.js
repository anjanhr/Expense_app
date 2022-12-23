import React, { Fragment } from "react";
import "../style.css";

const ExpenseHoverModal = (props) => {
  const { hoverData, typeData } = props;

  const allItems = typeData.filter((ele) => {
    return ele.category.name === hoverData.name;
  });

  return (
    <div>
      <div className="overlay3">
        <div
          className="modal3"
          style={{ border: "1px solid green", borderRadius: "20px" }}
        >
          <header className="modal_header3" style={{ borderRadius: "20px" }}>
            <div>
              <h2 className="list3">&nbsp;&nbsp;Items</h2>
            </div>
          </header>
          <br />
          <ul>
            {allItems.map((ele) => {
              return (
                <Fragment key={ele._id}>
                  <li> {ele.title}</li> <br/>
                </Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExpenseHoverModal;
