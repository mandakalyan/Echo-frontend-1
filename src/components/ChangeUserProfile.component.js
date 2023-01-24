import React, { Component } from 'react'
import BusinessChallengesService from '../services/business-challenge.service'

// import "./business-challenges-page.component.css"
import Pagination from './pagination.component';
import Challenges from './user.component';
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';
import axios from 'axios';


class ChangeUserProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showAdminBoard: false,
            challenges: [],
            userDetails: [],
            currentPage: 1,
            recordsPerPage: 10,
        }
    }

    setCurrentPage = (page) => {
        this.setState(
            {
                currentPage : page
            }
        );
    }
    
   

    componentDidMount(){
        

        UserService.getAllUsers().then((res)=>{
            this.setState({challenges: res.data,});
        });
    }

    render() {
        const { showAdminBoard, currentPage, recordsPerPage,challenges } = this.state;
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = challenges.slice(indexOfFirstRecord, indexOfLastRecord);
        const nPages = Math.ceil(challenges.length / recordsPerPage)

        return (
            <div>
                <div className="heading-line">
                    <h2 className="d-inline-flex display-5" style={{"left":"640px"}}>All Users</h2>

                    

                </div>

                <div className = "row" id='all'>
                    <Challenges data={currentRecords} showAdminBoard = {showAdminBoard}/>
                    <Pagination
                        nPages={nPages}
                        currentPage={currentPage}
                        setCurrentPage={this.setCurrentPage}
                    />
                </div>
            </div>
        )
    }
}

export default ChangeUserProfile;