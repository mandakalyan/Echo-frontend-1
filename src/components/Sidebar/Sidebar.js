import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import './Sidebar.css';

import { FcAddDatabase, FcAddRow, FcIdea } from "react-icons/fc";
import { FcTimeline } from "react-icons/fc";
import { CgCardHearts } from "react-icons/cg";
import {FcCollaboration} from "react-icons/fc";


const Sidebar = (props) => {
  return (
      <Menu>
        {props.currentUser && (
          <>
            <a className="bm-item" href="/ideas">
              <FcIdea style={{"fontSize":"30px"}} />
              <div>Fresh Ideas</div>
            </a>

            <a className="bm-item" href="/challenges">
              <FcTimeline style={{"fontSize":"30px"}} />
              <div>Business Challenges</div>
            </a>

            <a className="bm-item" href="/addIdea" style={{"padding":"20px"}}>
              <FcAddRow color='rgba(103, 192, 103, 0.75)' style={{"fontSize":"30px"}} />
              <div>Add Idea</div>
            </a>

            { props.isAdmin && (
              <a className="bm-item" href="/addChallenge">
                <FcAddDatabase color='rgba(103, 192, 103, 0.75)' style={{"fontSize":"30px"}} />
                <div>Add Business Challenge</div>
              </a>

            )}

            <a
            // onMouseEnter={}
            className="bm-item" href="/myFavorites">
              <CgCardHearts color='rgb(181, 72, 72)' style={{"fontSize":"30px"}} />
              <div>My Favorites</div>
            </a>
            <a
            // onMouseEnter={}
            className="bm-item" href="/Allusers">
              <FcCollaboration  style={{"fontSize":"30px"}} />
              <div>All Users</div>
            </a>
          </>
        )}
    </Menu>
  );
};

export default Sidebar;