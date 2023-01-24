import React from 'react'
import { BiEditAlt } from 'react-icons/bi'

import EditChallengeById from "./edit-challenge.component.js";
import Modal from "react-bootstrap/Modal";
import "./add-challenge.component.css";
import { useState } from "react";

const Challenges = ({data, showAdminBoard}) => {
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState("");
    
    const handleClose = () => {
      setShow(false);
      setEditId("");
    };
  
    const handleShow = (data) => {
      setShow(true);
      setEditId(data);
    };

    return (
        <div>
            <table className = "table">
                <thead style={{"textAlign":"center", "verticalAlign":"middle"}}>
                    <tr>
                        <th> ID </th>
                        <th> Challenge</th>
                        <th> Status</th>
                        <th> Created by</th>
                        <th> Created date</th>
                        <th> Expiry date</th>
                        {showAdminBoard && ( <th> Edit</th> )}
                    </tr>
                </thead>
                <tbody>
                    <br></br>
                    {
                        data.map(
                            challenge =>
                            <tr key = {challenge.id} > 
                                    <td style={{"verticalAlign":"middle"}}>
                                        <b> <i> {challenge.challengeId} </i> </b>
                                        </td>
                                    <td style={{"textAlign" : "left"}}>
                                        <a href={'/viewChallenge/' + challenge.id}>
                                            <div className='idea-title' style={{"fontWeight":"bold"}}> {challenge.challengeTitle} </div>
                                            <p style={{"width" : "500px", "height" : "4.3em", "overflowY":"hidden", "textOverflow": "ellipsis", "fontSize":"14px"}}>
                                                {challenge.challengeDescription}
                                            </p>
                                        </a>
                                    </td>
                                    <td style={{"fontSize":"14px"}}> {challenge.challengeStatus}</td>
                                    <td style={{"fontSize":"14px"}}> {challenge.fname + " " + challenge.lname}</td>
                                    <td style={{"fontSize":"14px"}}>
                                        {/* { challenge.creaatedDate|date:'d M Y' } */}
                                        {/* {challenge.createdDate} */}
                                        {/* {new Date(challenge.createdDate).toUTCString()} */}
                                        {/* {challenge.createdDate.slice(0, 10)} */}
                                        {/* {new Date(challenge.createdDate).toISOString().slice(4, 16)} */}
                                        {
                                            // date eg: 14
                                            new Date(challenge.createdDate).toDateString().slice(8, 11) +
                                            // month eg: Dec
                                            new Date(challenge.createdDate).toDateString().slice(4, 8) + 
                                            // year eg: 2022
                                            new Date(challenge.createdDate).toDateString().slice(11)
                                        }
                                    </td>
                                    <td style={{"fontSize":"14px"}}> 
                                        {
                                            new Date(challenge.expiryDate).toDateString().slice(8, 11) +
                                            new Date(challenge.expiryDate).toDateString().slice(4, 8) + 
                                            new Date(challenge.expiryDate).toDateString().slice(11)
                                        }
                                    </td>

                                    {showAdminBoard && (
                                        <td>
                                            <BiEditAlt
                                                size={"30px"}
                                                color={"#527293"}
                                                onClick={() => {
                                                handleShow(challenge.id);
                                                }}
                                            />
                                        </td>
                                  )}  
                                    
                            </tr>
                            // </a>
                        )
                    }
                </tbody>
            </table>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1>Edit Business Challenge</h1>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <EditChallengeById id={editId} />
                </Modal.Body>

            </Modal>
        </div>
    ) 
}

export default Challenges