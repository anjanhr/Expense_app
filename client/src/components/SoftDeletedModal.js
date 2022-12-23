import React, { Fragment } from "react";
import cancel from "../cancel.png";

const SoftDeletedModal = (props) => {
  const { modalclosefun, softDeletedData, handleUndoDelete } = props;

  return (
    <div>
      <div className="overlay4">
        <div
          className="modal4"
          style={{ border: "1px solid green", borderRadius: "20px" }}
        >
          <header className="modal_header4" style={{ borderRadius: "20px" }}>
            <div>
              <h1 className="list4"> Softed Categories </h1>
            </div>

            <span
              style={{ marginLeft: "3.4rem" }}
              onClick={modalclosefun}
              className="close_button"
            >
              <img
                style={{ cursor: "pointer" }}
                src={cancel}
                width={33}
                height={33}
                alt="not found"
              />
            </span>
          </header>
          <br />
          {softDeletedData.length === 0 ? (
            <p style={{ marginLeft: "2rem" }}> No Data </p>
          ) : (
            <ul>
              {softDeletedData.map((ele, i) => {
                return (
                  <Fragment key={i}>
                    <li>
                      {ele.name} &nbsp;&nbsp;
                      <img
                        onClick={() => {
                          handleUndoDelete(ele);
                        }}
                        src="https://findicons.com/files/icons/2146/realistik_reloaded/128/undo.png"
                        width="25px"
                        height="25px"
                        alt="internet error"
                        style={{ cursor: "pointer" }}
                      />
                    </li>
                    <br />
                  </Fragment>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftDeletedModal;
