import React from "react";
import { useCallback } from "react";
import { BiEditAlt } from 'react-icons/bi'
import { useState } from "react";
import IdeaService from "../services/idea.service";
import UserService from "../services/user.service";
import { useEffect } from "react";

const AllUser = ({ data }) => {
  const [currentData, setCurrentData] = useState([]);
  const [status,setStatus]=useState(false)

  useEffect(() => {
    // UserService.getAllUsers().then((res) => {
    setCurrentData(data);
    //   });
  }, []);
  

  return (
    <table className="table">
      {/* {console.log(currentData)} */}
      <thead style={{ textAlign: "center", verticalAlign: "middle" }}>
        <tr>
          <th>First Name</th>
          <th> Last Name</th>
          <th>Email</th>
          <th>Account</th>
          <th>Department</th>
          <th>Role</th>
          <th>Status</th>
          <th>Edit</th>
         
        </tr>
      </thead>
      <tbody>
        <br></br>

        {data.map(
          // currentData.map(
          (user) => (
            <tr key={user.id}>
             
              <td style={{ verticalAlign: "middle" }}>{user.fname}</td>
              <td style={{ verticalAlign: "middle" }}>{user.lname}</td>
              <td style={{ verticalAlign: "middle" }}>{user.email}</td>
              <td style={{ verticalAlign: "middle" }}>{user.account}</td>
              
              {/* <td style={{ verticalAlign: "middle" }}>{user.department.name}</td> */}
              <td style={{ verticalAlign: "middle" }}>{user.department.name}</td>
              <td style={{ verticalAlign: "middle" }}>
              {user.role.name === "ROLE_USER" && "User"}
                {user.role.name === "ROLE_FIADMIN" && "Fresh Ideas Admin"}
                {user.role.name === "ROLE_BCADMIN" && "Business Challenges Admin"}
              </td>
             
              <td style={{ verticalAlign: "middle" }}>{user.active?"Active":"Inactive"}</td>
              <td>
                                            <BiEditAlt
                                                size={"30px"}
                                                color={"#527293"}
                                                // onClick={() => {
                                                // handleShow(challenge.id);
                                                // }}
                                            />
                                        </td> 
              
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default AllUser;
