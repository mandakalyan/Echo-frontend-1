import React from 'react'
import { useCallback } from 'react';
import { useState } from 'react';

import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import IdeaService from '../services/idea.service';
import UserService from '../services/user.service';

import { BiUpArrow, BiDownArrow } from "react-icons/bi"
import { VscFilterFilled, VscFilter } from "react-icons/vsc"
import { useEffect } from 'react';

const AllIdeas = ({data}) => {
    const [currentData, setCurrentData] = useState([])
    const [isFavorite, setIsFavorite] = useState(false)
    console.log(data)
    useEffect(() => {
        setCurrentData(data)
    }, []);

    const checkFavorite = useCallback((id) => {
        IdeaService.isFavoriteIdeaOfCurrentUser(id).then(
            (res) => setIsFavorite(res.data)
        )
        console.log(isFavorite)
    }, [isFavorite]);

    const handleIdSort = async()=>{
        
        await IdeaService.getIdeasSortedById().then((res) => { 
           
            setCurrentData(res.data) });
    }
    UserService.getAllUsers().then((res)=>{
        console.log(res.data.role);
    })

    return (
        <table className = "table">
            {console.log(currentData)}
            <thead style={{"textAlign":"center", "verticalAlign":"middle"}}>
                <tr>
                    <th>
                        ID
                        {/* <span style={{"float":"right"}}><BiUpArrow textAlign="end" onClick={() => {handleIdSort()}}/></span> */}
                    </th>
                    <th>
                        Idea
                    </th>
                    <th> Response</th>
                    <th>
                        Status
                        {/* <span style={{"float":"right"}}><VscFilter textAlign="end" /></span> */}
                    </th>

                    <th>
                        Created by
                        {/* <span style={{"float":"right"}}><BiUpArrow textAlign="end" /></span> */}
                    </th>
                    <th width="150px">
                        Created date
                        {/* <span style={{"float":"right"}}><BiDownArrow textAlign="end" /></span> */}
                    </th>
                    {/* <th> Favourite</th> */}
                    <th> Rewards</th>
                </tr>
            </thead>
            <tbody>
                <br></br>

                {
                    data.map(
                    // currentData.map(
                        idea =>
                        <tr key = {idea.id} >
                            <td style={{"verticalAlign":"middle"}}>
                                {/* <b> <i>  */}
                                    {idea.ideaId} 
                                {/* </i> </b> */}
                            </td>
                            <td style={{"textAlign" : "left"}}>
                                <a href={'/viewIdea/' + idea.id}>
                                    <div className='idea-title' style={{"fontWeight":"bold"}}> {idea.ideaTitle} </div>
                                    <p style={{"width" : "500px", "height" : "4.3em", "overflowY":"hidden", "textOverflow": "ellipsis", "fontSize":"14px"}}>
                                        {idea.ideaDescription}
                                    </p>
                                </a>
                            </td>
                            <td>
                                <span style={{"display":"inline-block", "paddingInline":"13px"}}>
                                    <AiOutlineLike size={"25px"} color={"DodgerBlue"} />
                                    <div>{idea.likesCount}</div>
                                </span>
                                <span style={{"display":"inline-block"}}>
                                    <AiOutlineComment size={"25px"} color={"Tomato"} />
                                    <div>{idea.commentsCount}</div>
                                </span>
                            </td>
                            <td style={{"fontSize":"14px"}}> {idea.ideaStatus}</td>
                            <td style={{"fontSize":"14px"}}> {idea.fname + " " + idea.lname}</td>
                            <td style={{"fontSize":"14px"}}>
                                {
                                    new Date(idea.createdDate).toDateString().slice(8, 11) +
                                    new Date(idea.createdDate).toDateString().slice(4, 8) + 
                                    new Date(idea.createdDate).toDateString().slice(11)
                                }
                            </td>

                            {/* <td */}
                            {/* onClick={checkFavorite(idea.id)} */}
                            {/* > */}
                                {/* {checkFavorite(idea.id)} */}
                                {/* {console.log(isFavorite)} */}
                                {/* {isFavorite ? (<span>Favorite</span>) : (<span>Not favorite</span>)} */}

                            {/* </td> */}

                            <td>{idea.rewards} </td>
                                
                        </tr>
                        // </a>
                    )
                }
            </tbody>
        </table>
    ) 
}

export default AllIdeas