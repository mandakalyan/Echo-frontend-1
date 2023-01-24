import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import IdeaService from "../services/idea.service";
import "./view-idea-by-id.component.css";
import { AiOutlineAlignCenter, AiOutlineLike, AiTwotoneLike } from "react-icons/ai";
import { TbArrowBackUp } from "react-icons/tb";
import { BiEditAlt, BiMedal } from "react-icons/bi";
import flowImage from "./images/flowStatus.jpg";
import IdeaCommentsService from "../services/idea-comments.service";
import { useNavigate} from "react-router-dom";
import LikesService from "../services/likes.service";
import AuthService from "../services/auth.service";
import Modal from "react-bootstrap/Modal";
import EditIdea from "./edit-idea.component";
import UserService from "../services/user.service";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import EditIdeaComment from "./edit-idea-comment.component";
import fileService from "../services/file.service";
import {AiFillFileText} from "react-icons/ai"


function ViewIdeaById() {
  const [idea, setIdea] = useState({});
  const [Status, setStatus] = useState({});

  const [benefitCategory, setBenefitCategory] = useState({});
  const [category, setCategory] = useState({});
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [flow, toggleFlow] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [likeId, setLikeId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [rewards,setRewards]=useState(0);
  const [show, setShow] = useState(false);
  const [ideaCommentShow, setIdeacommentshow]=useState(false);
  const [cid, setCid]=useState("");
  const [ideacomment, setIdeaComment]=useState("");
  const [editId, setEditId] = useState("");
  const [localLiked, setLocalLiked] = useState(false);

  useEffect(() => {
    IdeaService.getIdeaByIdeaId(id).then((res) => {
      setIdea(res.data);
      setBenefitCategory(res.data.benefitCategory)
      setCategory(res.data.category)
    });
    IdeaCommentsService.getCommentsByIdeaId(id).then((res) => { setComments(res.data); })
    LikesService.getLikeOfCurrentUser(id).then((res)=>{ setLikeId(res.data); })
    IdeaService.isFavoriteIdeaOfCurrentUser(id).then((res) => { setLocalLiked(res.data); })
    setRewards(idea.rewards)
    const user = AuthService.getCurrentUser();
    setCurrentUserId(user.id)
    if (user.role.authority.includes("ROLE_FIADMIN")) { setAdmin(true); }
  }, []);

  const handleSubmit = async(e) => {
    let ideaId = idea.id;
    await IdeaCommentsService.postComment(ideaId, commentText);
    await IdeaService.getIdeaByIdeaId(id).then((res) => { setIdea(res.data); });
    await IdeaCommentsService.getCommentsByIdeaId(id).then((res) => { setComments(res.data); })
  };

  const handleUpdate = async(e) => {
    setStatus(e.target.value);
    let myIdea = idea;
    myIdea.ideaStatus = e.target.value;
    await IdeaService.updateIdea(idea.id, myIdea);
  };

  const handleShow = (data) => {
    setShow(true);
    setEditId(data);
  };

  const handleClose = () => {
    setShow(false);
    setEditId("");
  };

  const handleLike = async()=>{
    if(likeId === "") {
      let data={ ideaId: idea.id }
      await LikesService.like(data);
    }

    else{
      await LikesService.unLike(likeId)
    }
    await IdeaService.getIdeaByIdeaId(id).then((res) => { setIdea(res.data); });
    await LikesService.getLikeOfCurrentUser(id).then((res)=>{ setLikeId(res.data); })
  }

  const handleFavorite = async()=>{
    if(!localLiked) { await UserService.addFavorite(id) }
    else{ await UserService.removeFavorite(id) }
    await IdeaService.getIdeaByIdeaId(id).then((res) => { setIdea(res.data); });
    await IdeaService.isFavoriteIdeaOfCurrentUser(id).then((res) => { setLocalLiked(res.data); }) 
  }

  const handleRewards=(e)=>{
    if(e.target.value==="100"){ setRewards(100); }
    else if(e.target.value==="50"){ setRewards(50); }
    else if(e.target.value==="30"){ setRewards(30); }
    else if(e.target.value==="20"){ setRewards(20); }
    else if(e.target.value==="10"){ setRewards(10); }
    else{ setRewards(0); }
  }

  const handleSave = async()=>{
    let myIdea = idea;
    myIdea.rewards=rewards;
    await IdeaService.updateIdea(idea.id, myIdea);
    await IdeaService.getIdeaByIdeaId(id).then((res) => { setIdea(res.data); });
  }

  const handleIdeacommentShow=(d1,d2)=>{
    setIdeacommentshow(true);
    setCid(d1);
    setIdeaComment(d2); 
  }
  5
  const ideaCommenthandleClose = () => {
    setIdeacommentshow(false);
    setCid("");
    setIdeaComment("");
  };

  const navigate = useNavigate();
  const handleClick = () => { navigate(-1); };
  const downloadFile=async(e)=>{
    await fileService.downloadFile(idea.fileId).then((res)=>{
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
    <div className="specific_idea">
      <button className="back-button btn btn-secondary" style={{"float":"right"}} onClick={handleClick}>
        <TbArrowBackUp size="30px" />
        <h6>Back</h6>
      </button>
      
      <div className="idea">
        {currentUserId === idea.userId && (
          <div style={{"margin-left":"90%", "padding-top":"5px"}}>
            <BiEditAlt className="edit_idea_button" size={"45px"} onClick={() => { handleShow(idea.id) }} />
            <Modal show={show} onHide={handleClose} className="name">
              <Modal.Header closeButton>
                <Modal.Title>
                  <h1>Edit Fresh Idea</h1>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <EditIdea id={editId}/>
              </Modal.Body>
            </Modal>
          </div>
        )}
        <div className="idea_header">
          <div className="idea_title"><h1>{idea.ideaTitle}</h1></div>
        </div>

        <div className="idea_description"> <p>{idea.ideaDescription}</p> </div>
        <div className="Postedby">
          <div><strong>Posted By: </strong>{idea.fname + " " + idea.lname}</div>
          <div><strong>Benefit category: </strong>{benefitCategory.name}</div>
          <div><strong>Category: </strong>{category.name}</div>
        </div>

        <div className="idea_status_rewards">
          <div className="status">
            <strong>Status:</strong>
            <div className="status_bar">
              {idea.ideaStatus === "RAISED" && ( <div className="raised"><p>Raised</p> </div> )}
              {idea.ideaStatus === "REVIEWED" && ( <div className="reviewed"><p>Reviewed</p> </div> )}
              {idea.ideaStatus === "REJECTED" && ( <div className="rejected"><p>Rejected</p> </div> )}
              {idea.ideaStatus === "ACCEPTED" && ( <div className="accepted"><p>Accepted</p> </div> )}
              {idea.ideaStatus === "IMPLEMENTED" && ( <div className="implemented"><p>Implemented</p> </div> )}

              <div className="workflow" onClick={() => { toggleFlow(true); }} > <p>workflow</p> </div>

              {flow && (
                <div className="workflow_overlay" onClick={() => { toggleFlow(false); }} >
                  <div className="workflow_img scale-up-center"> <img src={flowImage} alt="" /> </div>
                </div>
              )}
            </div>
          </div>

          {admin &&
            <div className="idea_rewards">
              <div className="idea-rewards">
                <p>Rewards:</p>
                <select className="rewards_drop" onChange={handleRewards} name="rewards" >
                  <option value="0" hidden><p>select rewards</p></option>
                  <option value="100">100 points</option>
                  <option value="50">50 points</option>
                  <option value="30">30 points</option>
                  <option value="20">20 points</option>
                  <option value="10">10 points</option>
                </select>

                <button onClick={handleSave} className="rewards_button">
                  Submit
                </button>
              </div>
            </div>
          }

        </div>
        
        {admin && (
          <div className="change_status">
            <strong><p>Want to change status of Idea</p></strong>
            <div className="update__container">
              {idea.ideaStatus === "RAISED" && (
              //   <button className="update__container_buttons" value="REVIEWED" onClick={handleUpdate} >Reviewed</button>
              // )}

              // {idea.ideaStatus === "REVIEWED" && (
                <div>
                  <button className="update__container_buttons" value="ACCEPTED" onClick={handleUpdate} >Accepted</button>
                  <button className="update__container_buttons_r" value="REJECTED" onClick={handleUpdate} >Rejected</button>
                </div>
              )}

              {idea.ideaStatus === "ACCEPTED" && (
                <div>
                  <button className="update__container_buttons" value="IMPLEMENTED" onClick={handleUpdate} >Implemented</button>
                </div>
              )}
            </div>
          </div>
        )}
        {idea.fileId!==null&& <div className="file_attachement" onClick={downloadFile}>
          <p>file-attachment</p>
          <AiFillFileText className="file-icon"/>
        </div>}


        <div className="idea_likes">
          {likeId !== "" ?
            <div className="idea_like-icon">
              <AiTwotoneLike size={"40px"} className="like_icon" onClick={handleLike}/ >
              <div style={{"textAlign":"center"}} >{idea.likesCount}</div>
            </div> :
            <div className="idea_like-icon">
              <AiOutlineLike size={"40px"} className="like_icon_inactive" onClick={handleLike}/>
              <div style={{"textAlign":"center"}} >{idea.likesCount}</div>
            </div>
          }

          <div>
            {localLiked ?
              <FcLike size={"40px"} color="red" onClick={handleFavorite} />
              :
              <FcLikePlaceholder size={"40px"} color="red" onClick={handleFavorite} />
            }
          </div>

          <div className="badge">
            {idea.rewards===100&& <div className="badge_points"><BiMedal className="ruby_badge" /><p>{idea.rewards}</p></div>}
            {idea.rewards===50&& <div className="badge_points"><BiMedal className="diamond_badge" /><p>{idea.rewards}</p></div>}
            {idea.rewards===30&& <div className="badge_points"><BiMedal className="gold_badge" /><p>{idea.rewards}</p></div>}
            {idea.rewards===20&& <div className="badge_points"><BiMedal className="silver_badge" /><p>{idea.rewards}</p></div>}
            {idea.rewards===10&& <div className="badge_points"><BiMedal className="bronze_badge" /><p>{idea.rewards}</p></div>}
          </div>
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
                    <div className="commentEdit" style={{ display: "inline-block", float: "right" }} >
                      <button className="btn btn-secondary">
                        <BiEditAlt
                          onClick={() => {
                            handleIdeacommentShow(
                              comment.id,
                              comment.commentText
                            );
                          }}
                          size={"20px"}
                        />
                      </button>
                      <Modal show={ideaCommentShow} onHide={ideaCommenthandleClose} className="name">
                        <Modal.Header closeButton>
                          <Modal.Title>
                            <h1>Edit Comment</h1>
                          </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          <EditIdeaComment commentId={cid} commentText={ideacomment}/>
                        </Modal.Body>
                      </Modal>
                    </div>
                    ) : ( <div> </div>)
                  }
                </span>
                <div className="commentText" key={comment.id}>
                  {comment.commentText}
                </div>

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
          <div style={{"textAlign":"center"}}>
            <button className="comment-form button"
            disabled={commentText.length < 1}
            onClick={handleSubmit}>
              Post Comment
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default ViewIdeaById;