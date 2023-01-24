import React from 'react';
import BusinessChallengesService from "../services/business-challenge.service"
import "./add-challenge.component.css"
import fileService from '../services/file.service';
import {AiFillFileText} from "react-icons/ai"
import{RiDeleteBin2Fill } from "react-icons/ri"

export default class EditChallenge extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id:'',
      title: '',
      description: '',
      expiryDate: '',
      status: '',
      url:'',
      redirect: false,
      currentFile:'',
      progress:0,
      message:'',
      fileId:null,
      fileName:''
    }

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeExpiryDate=this.onChangeExpiryDate.bind(this);
    this.saveChallenge = this.saveChallenge.bind(this);
    this.onChangeFile=this.onChangeFile.bind(this); 
    this.fileDownload=this.fileDownload.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
  }

  componentDidMount(){
    var id = this.props.id
    BusinessChallengesService.getBusinesssChallengeById(id).then((res)=>{
      this.setState({
          title: res.data.challengeTitle,
          description: res.data.challengeDescription,
          expiryDate: res.data.expiryDate,
          status: res.data.challengeStatus,
          fileId:res.data.fileId
        });
        if(res.data.fileId!==null){
       
          fileService.getFile(res.data.fileId).then((resp)=>{
            
            this.setState({
              fileName:resp.data
            })
            
          })
        }
   })
  }
  async handleDelete(){
    await fileService.deleteFile(this.state.fileId);
    this.setState({
      fileId:null,
      fileName:''
    })

  }

  onChangeTitle(e){
    this.setState({
      title: e.target.value
    })
  }

  onChangeDescription(e){
    this.setState({
      description: e.target.value
    })
  }

  onChangeExpiryDate(e){
    this.setState({
      expiryDate: e.target.value
    })
  }
  async fileDownload(){
    await fileService.downloadFile(this.state.fileId).then((res)=>{
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

  async saveChallenge() {
    var id = this.props.id
    if(this.state.currentFile.size<5242880||this.state.currentFile===''){
      let fileId;
      if(this.state.currentFile!==''){
        if(this.state.fileId!==null){
          await fileService.deleteFile(this.state.fileId);
          }
         
      await fileService.uploadFile(this.state.currentFile, (event) => {
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
    var challenge = {
      id: id,
      challengeTitle: this.state.title,
      challengeDescription: this.state.description,
      expiryDate: this.state.expiryDate,
      challengeStatus: this.state.status,
      fileId:fileId
    };
    BusinessChallengesService.updateChallenge(id, challenge).then(()=>{ this.setState({submitted:true}) })
  }
  else{
    this.setState({
      message:"File size exceeded. Upload file size limit is 5MB"
    })
   }
}
onChangeFile(e){
  e.preventDefault();
  this.setState({
   currentFile:e.target.files[0],
   progress:0
  });
}


  render() {
    const {
      currentFile,
      progress,
      message,
    } = this.state;
    const { expiryDate } = this.state;
    return (
      <div className="submit-form">
        {this.state.submitted ? (
          <div style={{"textAlign":"center"}}>
            <h4>Business Challenge Edited successfully!</h4>
            <a href = {this.state.url}><button className="btn btn-secondary" style={{"width":"20%"}}>Ok</button></a>
          </div>
        ) : (
          <div class="name">
            <div className="form-group">
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
              <label for="description">Description</label>
              <textarea
                className="form-control"
                id="description"
                required
                rows="7"
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              >
              </textarea>
              
            
              <label htmlFor="date">Expiry Date</label>
              {/* {console.log(expiryDate.slice(0, 10))} */}
              <input
                type="date"
                className="form-control"
                id="closingDate"
                required
                value={expiryDate.slice(0, 10)}
                onChange={this.onChangeExpiryDate}
                name="expryDate"
              />
            </div>
            {this.state.fileId!==null&&<div className='form-group'>
                <label>Existing file</label>
                  <div className='form-group-existing-file'>
               
                  <div className='existing-file' onClick={this.fileDownload}>
                  
                  <AiFillFileText className='file-icon'></AiFillFileText>
                  <p>{this.state.fileName}</p>
                
                  </div>
                  <RiDeleteBin2Fill class='file-delete-icon' onClick={this.handleDelete}/>
                  </div>
                  </div>
                }
                <div class="form-group">
              <label for="description">Update document</label>
             
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
              <button onClick={this.saveChallenge} style={{"marginTop":"20px"}} className="btn btn-secondary" disabled={this.state.title.length<2||this.state.description.length<1}>
                Submit
              </button>
            </div>

          </div>
        )}
      </div>
    );
  }
}