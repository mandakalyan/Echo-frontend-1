import React from "react";
import "./userprofile.component.css";

import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider } from '@coreui/react'
import { FaUserCircle } from "react-icons/fa";
import { useState } from "react";
import AuthService from "../services/auth.service";

function Userprofile(props){
  const [isAdmin, setIsAdmin] = useState(props.showAdminBoard);
  const [currentUser, setCurrentUser] = useState(props.currentUser);
  const [userDetails, setUserDetails] = useState(props.userDetails);

  const handleLogout = () => {
    AuthService.logout();
    setIsAdmin(false);
    setCurrentUser(undefined);
    setUserDetails([]);
  }

  return(
  <CDropdown variant="btn-group">
    <CDropdownToggle color="white" size="lg"> <FaUserCircle color="#231f20" fontSize="1.9em" /></CDropdownToggle>
    <CDropdownMenu>
      <CDropdownItem href="/profile">My Profile</CDropdownItem>
      <CDropdownDivider/>
      <CDropdownItem href="/login" onClick={handleLogout}>Logout</CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
  );
}

export default Userprofile;