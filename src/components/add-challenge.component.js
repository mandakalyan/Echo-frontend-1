import React, { Component } from "react";
import BusinessChallengesService from "../services/business-challenge.service";
import "./add-challenge.component.css"
import FileService from "../services/file.service"

export default class AddChallenge extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBusinessArea = this.onChangeBusinessArea.bind(this);
    this.onChangeExpiryDate=this.onChangeExpiryDate.bind(this);
    this.saveChallenge = this.saveChallenge.bind(this);
    this.newChallenge = this.newChallenge.bind(this);
    this.onChangeFile=this.onChangeFile.bind(this);

    this.state =
    {
      id: null,
      title: "",
      description: "",
      businessArea: "",
      expiryDate:"",
      submitted: false,
      businessAreasList :[],
      tv:false,
      errors:{},
      dv:false,
      dav:false,
      currentFile:'',
      progress:0,
      message:''
    };
  }

  componentDidMount() {
    BusinessChallengesService.getBusinessAreasList().then(res => {
      this.setState({businessAreasList : res.data }) })
  }

  onChangeTitle(e) {
    this.setState({tv:true})
    this.setState({ title: e.target.value });
  }

  onChangeDescription(e) {
    this.setState({dv:true})
    this.setState({ description: e.target.value });
  }

  onChangeBusinessArea(e) {
    this.setState ({ businessArea: e.target.value });
  }

  onChangeExpiryDate(e) {
    this.setState({dav:true})
    this.setState({ expiryDate: e.target.value });
  }
  onChangeFile(e){
    e.preventDefault();
    this.setState({
     currentFile:e.target.files[0],
     progress:0
    });
  }
  formValidation=()=>{
    const {title,description,businessArea,currentFile,expiryDate}=this.state;
    let isValid= true;
    const errors={};
    console.log(title.length)
    if(title.length<10||title.length>50 ) {
        errors.title="Title must be in range of 10 to 50 Character";
        isValid=false;
    }
    
    console.log(description.length)
    if(description.length>200 || description.length<25){
        errors.description="Description must be in range of 25 to 200 Character";
        isValid=false;
    }
    // console.log(expiryDate)
    if(businessArea===""){
      errors.businessArea="Please Enter businessArea";
      isValid=false;
  }
  if(currentFile.size>5242880){
    errors.currentFile="File size exceeded. Upload file size limit is 5MB";
    isValid=false;
}
if(expiryDate===""){
  errors.expiryDate="Please Enter Expiry Date";
  isValid=false;
}
    console.log(errors)
    this.setState({errors});
    return isValid;

}  


 async saveChallenge() {
  const isValid=this.formValidation();
    if(this.state.currentFile.size<5242880||this.state.currentFile===''){
      let fileId=null;
     if(this.state.currentFile!==''){
      
      await FileService.uploadFile(this.state.currentFile, (event) => {
       this.setState({
         progress: Math.round((100 * event.loaded) / event.total),
       });
     })
       .then((response) => {
         fileId=response.data;
         this.setState({
           fileId:response.data
         });
       })
         .catch(() => {
           this.setState({
             progress: 0,
             message: "Could not upload the file!",
             currentFile: undefined,
           });
         });
        }
    if( isValid){
      var challenge = {
        challengeTitle: this.state.title,
        challengeDescription: this.state.description,
        businessArea: this.state.businessArea,
        expiryDate:this.state.expiryDate,
        fileId:fileId
      };
    await  BusinessChallengesService.addBusinessChallenge(challenge)
      .then((res)=>{ 
        this.setState({
          id: res.data.id,
          title: res.data.challengeTitle,
          description:res.data.challengeDescription ,
          businessArea: res.data.businessArea,
          expiryDate:res.data.expiryDate,
          submitted:true
        })
      })
    }
  }
  // else{
  //   this.setState({
  //     message:"File size exceeded. Upload file size limit is 5MB"
  //   })
 // }
  }

  newChallenge() 
  {
    this.setState({
      id: null,
      title: "",
      description: "",
      businessArea: "",
      published: false,
      submitted: false
    });
  }

  render() {
    const {
      currentFile,
      progress,
      message,
    } = this.state;
    return (
      <div className="submit-form add-challenge-card
      ">
        {this.state.submitted ? (
          <div style={{"textAlign":"center"}}>
            <h4>Business Challenge submitted successfully!</h4>
            <a href="/challenges"> <button className="btn btn-secondary" style={{"width":"20%"}}>Ok</button></a>
          </div>
        ) : (
          <div>
            <h1>Add Business Challenge</h1>
            <div className="form-group">
            <p className="error_class">{this.state.errors.title}</p>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                className="form-control"
                id="title"
                required
                value={this.state.title}
                onChange={this.onChangeTitle}
                name="title"
              />
            </div>

            <div class="form-group">
            <p className="error_class">{this.state.errors.description}</p>
              <label for="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                required
                rows="5"
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              >
              </textarea>

              <div class="form-group">
              <p className="error_class">{this.state.errors.businessArea}</p>
                <label>Business Area</label>
                <select class="form-select" aria-label="Default select example"
                value={this.state.businessArea}
                onChange={this.onChangeBusinessArea}>
                  <option selected hidden>Select a Business Area</option>
                  { this.state.businessAreasList.map( bc => <option>{bc.name}</option> )}
                </select>
              </div>
              <p className="error_class">{this.state.errors.expiryDate}</p>
              <label htmlFor="date">Expiry Date</label>
              <input
                type="date"
                className="form-control challenge-date-input"
                id="expiryDate"
                required
                // value=" "
                value={this.state.expiryDate}
                onChange={this.onChangeExpiryDate}
                name="expiryDate"
              />
            </div>
            <div class="form-group">
            <p className="error_class">{this.state.errors.currentFile}</p>
              <label for="description">Attach Document</label>
             
                <input className="form-control" type="file" onChange={this.onChangeFile} name="currentFile"  id="file" /></div>
                {currentFile && (
            <div className="progress">
              <div
                className="progress-bar progress-bar-info progress-bar-striped"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
                style={{ width: progress + "%" }}
              >
                {progress}%
              </div>
            </div>
        )}
         {message!=='' &&<div className="alert alert-light" role="alert">
          {message}
        </div>}

            <div style={{"textAlign":"center"}}>
              <button onClick={this.saveChallenge} style={{"marginTop":"20px"}} className="btn btn-secondary"
             >
                Submit
              </button>
            </div>

          </div>
        )}
      </div>
    );
  }
}
