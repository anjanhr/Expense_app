import React, { useState, useEffect } from "react";
import { startHomeAction } from "../actions/homeAction";
import { useSelector, useDispatch } from "react-redux";
import {
  startDeleteProfile,
  startPostProfile,
  startShowUser,
} from "../actions/userAction";
import piggy from "../piggy.jpeg";
import defaultpic from "../defaultpic.jpg";
import NavBar from "./NavBar";
import ParticlesBg from "particles-bg";

const UserProfile = (props) => {
  const userId = props.match.params.id;
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [occupation, setOccupation] = useState("");
  const [image, setImage] = useState("");
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    dispatch(startHomeAction(false));
  }, [dispatch]);

  useEffect(() => {
    dispatch(startShowUser());
  }, [dispatch]);

  const userData = useSelector((state) => {
    return state.userData;
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", name);
    formData.append("occupation", occupation);
    formData.append("image", image);

    dispatch(startPostProfile(formData, reDirect));
    function reDirect() {
      dispatch(startShowUser());
      setEdit(false);
    }
  };

  const handleDeleteProfile = () => {
    dispatch(startDeleteProfile(reDirect));
    function reDirect() {
      dispatch(startShowUser());
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const files = e.target.files;
    if (name === "name") {
      setName(value);
    } else if (name === "occupation") {
      setOccupation(value);
    } else if (name === "image") {
      setImage(files[0]);
    }
  };

  return (
    <div>
      <ParticlesBg type="square" bg={true} />
      {/* ball, circle, cobweb, square, fountain, random */}
      <NavBar />
      <div className="flex-container2" style={{ marginTop: "2rem" }}>
        <div className="flex-child2 green">
          <span>
            {userData.profile && userData.profile.image ? (
              <img
                style={{
                  marginTop: "-1rem",
                  marginLeft: "24rem",
                  cursor: "pointer",
                }}
                onClick={handleDeleteProfile}
                src="https://www.pngall.com/wp-content/uploads/6/Delete-Button-PNG-Photo.png"
                width={40}
                height={40}
                alt="not found"
              />
            ) : (
              <img
                style={{
                  marginTop: "-1rem",
                  marginLeft: "23rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setEdit(true);
                }}
                src="https://cdn-icons-png.flaticon.com/512/6324/6324826.png"
                width={35}
                height={35}
                alt="not found"
              />
            )}
          </span>
          <h1 style={{ marginTop: "-1rem" }}> My Profile </h1>
          <hr />
          <br />
          {userData.profile ? (
            <>
              {userData.profile.image ? (
                <img
                  style={{
                    border: "1px solid yellow",
                    marginLeft: "7.9rem",
                    borderRadius: "50%",
                  }}
                  src={`http://localhost:4030/${userData.profile.image}`}
                  width={185}
                  height={185}
                  alt="not found"
                />
              ) : (
                <img
                  style={{
                    border: "1px solid grey",
                    marginLeft: "6.8rem",
                    borderRadius: "50%",
                  }}
                  src={defaultpic}
                  width={185}
                  height={185}
                  alt="not found"
                />
              )}

              <h2 style={{ textAlign: "center", fontSize: "25px" }}>
                {userData.profile.name}
              </h2>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "25px",
                  marginTop: "-1rem",
                }}
              >
                {userData.profile.occupation}
              </h2>
            </>
          ) : (
            <img
              style={{
                border: "1px solid grey",
                marginLeft: "6.8rem",
                borderRadius: "50%",
              }}
              src={defaultpic}
              width={185}
              height={185}
              alt="not found"
            />
          )}
        </div>
        <div
          className="flex-child2 magenta "
          style={
            edit
              ? {
                  marginLeft: "7rem",
                  textAlign: "center",
                  boxShadow: "5px 5px",
                  border: "2px solid black",
                }
              : { marginLeft: "1rem", border: "0px" }
          }
        >
          {edit ? (
            <>
              <h1> Update Profile </h1> <hr />
              <br />
              <form onSubmit={handleSubmit}>
                <input
                  className="inputstyle"
                  type="text"
                  name="name"
                  value={name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                />
                <br />
                <br />
                <input
                  className="inputstyle"
                  type="text"
                  name="occupation"
                  value={occupation}
                  onChange={handleChange}
                  placeholder="Enter Your occupation"
                />
                <br />
                <br />
                <input
                  style={{ marginBottom: "2rem" }}
                  type="file"
                  name="image"
                  onChange={handleChange}
                />
                <br />
                <br />
                <input className="regcolor1" type="submit" value="Update" />
                <input
                  style={{ marginLeft: "1.2rem" }}
                  className="regcolor2"
                  onClick={() => {
                    setEdit(false);
                  }}
                  type="submit"
                  value="Close"
                />
              </form>
            </>
          ) : (
            <>
              <img
                style={{ marginTop: "2rem", marginLeft: "7rem" }}
                src={piggy}
                width={480}
                height={320}
                alt="not found"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
