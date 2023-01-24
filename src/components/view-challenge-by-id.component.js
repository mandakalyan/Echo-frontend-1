import React from 'react'
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from "../services/auth.service";
import { BiEditAlt } from 'react-icons/bi'
import "./view-challenge-by-id.component.css";
import ChallengeCommentsService from "../services/challenge-comments.service"
import BusinessChallengesService from '../services/business-challenge.service'
import { TbArrowBackUp } from 'react-icons/tb';
import Modal from "react-bootstrap/Modal";
import EditChallenge from './edit-challenge.component.js';
import EditChallengeComment from './edit-challenge-comment.component';
import { data } from 'jquery';
import fileService from "../services/file.service";
import {AiFillFileText} from "react-icons/ai"

function ViewChallengeById() {
    const { challengeId } = useParams();
    const [challenge, setChallenge] = useState({});
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState({});
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState("");
    const [currentUserId, setCurrentUserId] = useState("");
    const [commentshow, setCommentShow] = useState(false);
    const [comid, setComid] = useState("");
    const [comtext, setComtext] = useState("");
    const [admin, setAdmin] = useState(false);
    const [reOpen, setReOpen] = useState(false);
    const [extend, setExtend] = useState(false);
    const [file,setFile]=useState(false);
    const [newExpairyDate,setNewExpairyDate]=useState(new Date());
    const[extraOptionsMessage,setExtraOptionsMessage]=useState("");
    // const [challenid, setChallenid] = useState("");

    useEffect(() => {
        BusinessChallengesService.getBusinesssChallengeById(challengeId).then((res) => { 
            console.log(res.data.fileId+"hello world")
            if(res.data.fileId!=null){
                setFile(true);
            }
            setChallenge(res.data) 
        console.log(res.data)});
        const user = AuthService.getCurrentUser();
        setCurrentUserId(user.id)
        ChallengeCommentsService.getChallengeCommentsByChallengeId(challengeId).then((res) => { setComments(res.data); });

        if (user.role.authority.includes("ROLE_BCADMIN")) {
            setAdmin(true)
        }





    }, []);



    const handleSubmit = (e) => {
        // setCommentButton(false);
        ChallengeCommentsService.postComment(challengeId, commentText).then((res) => {
            console.log(res.data);
        })
    };

    const handleClose = () => {
        setShow(false);
        setEditId("");
    };

    const handleShow = (data) => {
        setShow(true);
        setEditId(data);
    };

    const handleCommentClose = () => {
        setCommentShow(false);
        setComid("");
        setComtext("");
        // setChallenid("");
    };

    const handleCommentShow = (d1, d2, d3) => {
        setCommentShow(true);
        setComid(d1);
        setComtext(d2);
        // setChallenid(d3);
    };

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(-1);
    };
    const reOpenHandler = () => {
        setReOpen(true);

    }
    const extendHandler = () => {
        setExtend(true);

    }
    const extraOptions=(e)=>{
        setNewExpairyDate(e.target.value);
        if(new Date(e.target.value)>=new Date()){
        
            setExtraOptionsMessage("");
        }
       

    }
    const submitExtraOptions=(e)=>{
        if(new Date(newExpairyDate)<new Date()){
            setExtraOptionsMessage("Past date can't be selected");
        }
        else{
            setReOpen(false)
            setExtend(false)
            let newChallenge=challenge;
            newChallenge.expiryDate=newExpairyDate;
            newChallenge.challengeStatus="OPENED"

            BusinessChallengesService.updateChallenge(newChallenge.id,newChallenge);

        }
    }
    const downloadFile=async(e)=>{
        await fileService.downloadFile(challenge.fileId).then((res)=>{
          console.log(res.data)
    
          const blob = new Blob([res.data], {type: res.data.type});
          const href = URL.createObjectURL(blob);
          const contentDisposition = res.headers.get("content-disposition");
          let fileName = 'unknown';
          if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2)
                fileName = fileNameMatch[1];
        }
          const link = document.createElement('a');
          link.href = href;
          link.setAttribute('download', fileName); 
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(href);
        })
      }

    return (
        <div>
            <div className="specific_idea">
                <button className="back-button btn btn-secondary" style={{ "float": "right" }} onClick={handleClick}>
                    <TbArrowBackUp size="30px" />
                    <h6>Back</h6>
                </button>
                <div className="idea">
                    {currentUserId === challenge.userId && (
                        <div style={{ "margin-left": "90%", "padding-top": "5px" }}>
                            <BiEditAlt className="edit_challenge_button" size={"45px"} onClick={() => { handleShow(challenge.id); }} />
                            <Modal show={show} onHide={handleClose} className="name">
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        <h1>Edit Business Challenge</h1>
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <EditChallenge id={editId} />
                                </Modal.Body>
                            </Modal>
                        </div>
                    )}
                    <div className="idea_header"></div>
                    <div className="idea_title"><h1>{challenge.challengeTitle}</h1></div>
                    <div className="idea_description"><p>{challenge.challengeDescription}</p></div>
                    <div className="postedby">
                        <div><strong>Posted By: </strong>{challenge.fname + " " + challenge.lname}</div>
                        <div className="expiryDate">

                            <p>
                                <strong>Expiry Date: </strong>
                                {
                                    new Date(challenge.expiryDate).toDateString().slice(8, 11) +
                                    // month eg: Dec
                                    new Date(challenge.expiryDate).toDateString().slice(4, 8) +
                                    // year eg: 2022
                                    new Date(challenge.expiryDate).toDateString().slice(11)
                                }
                            </p>
                        </div>

                    </div>
                    {admin && <div className='extra-options'>

                        {(new Date() > new Date(challenge.expiryDate)) ?
                            <div className='extra-button'>
                                <button className='extra-buttons-re-open btn btn-secondary ' onClick={reOpenHandler}><p>Re-Open</p></button>
                            </div> :
                            <div className='extra-button'>
                                <button className='extra-buttons-re-open btn btn-secondary' onClick={extendHandler}><p>Modify expiry date</p></button>

                            </div>
                        }

                    </div>}
                    {challenge.fileId!==null&& <div className="file_attachement" onClick={downloadFile}>
          {file!=false&&<p>file-attachment</p>}
          {file!=false&&<AiFillFileText className="file-icon"/>}
                    
        </div>}

                    <div className='reOpenComponant'>
                        {reOpen && <div className='reOpen'><div className='reOpen-layout' onClick={() => { setReOpen(false) }}>

                        </div>
                            <center>
                                <div className='reOpen-update'>
                                    <div className='reOpen-title'><h4>Set new expiry date</h4></div>
                                    <div className='reOpen-date'><input className='reOpen-date-input' type="date" onChange={extraOptions}></input> </div>
                                    <div className='reOpen-buttons'><button className='reOpen-submit btn btn-secondary' onClick={submitExtraOptions}><p>submit</p></button><button className='reOpen-cancel btn btn-secondary' onClick={()=>{setReOpen(false)}}><p>cancel</p></button></div>
                                    
                                </div></center>
                                <div className='extra-options-message'>{extraOptionsMessage}</div>
                               
                        </div>

                        }

                    </div>
                    <div className='extend Componant'>{
                        extend && <div className='reOpen'><div className='reOpen-layout' onClick={() => { setExtend(false) }}>

                        </div>
                            <center>
                                <div className='reOpen-update'>
                                    <div className='reOpen-title'><h4>Set new expiry date</h4></div>
                                    <div className='reOpen-date'><input className='reOpen-date-input' type="date" onChange={extraOptions}></input> </div>
                                    <div className='reOpen-buttons'><button className='reOpen-submit btn btn-secondary'onClick={submitExtraOptions}><p>submit</p></button><button className='reOpen-cancel btn btn-secondary' onClick={()=>{setExtend(false)}}><p>cancel</p></button></div>
                                   
                                </div></center>
                                <div className='extra-options-message'>{extraOptionsMessage}</div>
                        </div>
                    }

                    </div>


                </div>

                <div className="comments_section">
                    {comments.map(
                        comment => (
                            <div>
                                <div className="commentBody">
                                    <span className="commentedBy" key={comment.id}>
                                        <b>{comment.fname + " " + comment.lname} </b>
                                        {/* • */}
                                        <span className="commentedDate">~ {comment.commentedDate}</span>
                                        {currentUserId === comment.userId ? (
                                            <div
                                                className="CommentEdit"
                                                style={{ display: "inline-block", float: "right" }}
                                            >
                                                <button className="btn btn-secondary">
                                                    <BiEditAlt onClick={() => handleCommentShow(comment.id, comment.commentText, challenge.id)} size={"20px"} />
                                                </button>
                                                <Modal show={commentshow} onHide={handleCommentClose} className="name" >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>
                                                            <h1>Edit Comment</h1>
                                                        </Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        <EditChallengeComment
                                                            commentId={comid}
                                                            commentText={comtext}
                                                        // challengeId={challenge.id}
                                                        />
                                                    </Modal.Body>
                                                </Modal>
                                            </div>
                                        ) : (<div> </div>)
                                        }
                                    </span>
                                    <div className="commentText" key={comment.id}>{comment.commentText}</div>
                                </div>
                            </div>
                        )
                    )}
                </div>

                <div className="challenge-comment-box">
                    <p>Leave a Comment</p>
                    <form className="comment-form">
                        <textarea
                            className="comment-form textarea"
                            rows="3"
                            placeholder="Write your Comment"
                            onChange={(e) => setCommentText(e.target.value)}
                        ></textarea>
                        <div style={{ "textAlign": "center" }}>
                            <button className="comment-form button"
                                disabled={commentText.length < 1}
                                onClick={handleSubmit}>
                                Post Comment
                            </button>
                        </div>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default ViewChallengeById;