import React from 'react';
import fileService from '../services/file.service';
import IdeaService from '../services/idea.service';
import "./add-idea.component.css"
import {AiFillFileText} from "react-icons/ai"
import{RiDeleteBin2Fill} from "react-icons/ri"

export default class EditIdea extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      id: '',
      title: '',
      description: '',
      status: '',
      url: '',
      redirect: false,
      currentFile:'',
      progress:0,
      message:'',
      fileId:null,
      fileName:''
    }

    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.saveIdea = this.saveIdea.bind(this); 
    this.onChangeFile=this.onChangeFile.bind(this); 
    this.fileDownload=this.fileDownload.bind(this);
    this.handleDelete=this.handleDelete.bind(this);
  }
  
  componentDidMount(){
    var id = this.props.id
    IdeaService.getIdeaByIdeaId(id).then((res)=>{
      this.setState({
        title: res.data.ideaTitle,
        description: res.data.ideaDescription,
        status: res.data.ideaStatus,
        fileId:res.data.fileId,
        
        
      });
      console.log(res.data)
      if(res.data.fileId!==null){
       
        fileService.getFile(res.data.fileId).then((resp)=>{
          
          this.setState({
            fileName:resp.data
          })
          
        })
  
      }
      
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

  async saveIdea() {
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

    var idea = {
      id: id,
      ideaTitle: this.state.title,
      ideaDescription: this.state.description,
      ideaStatus: this.state.status,
      fileId:fileId
    };
   
    await IdeaService.updateIdea(id, idea).then(()=>{ this.setState({submitted:true}) })
   

    
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
  async handleDelete(){
    await fileService.deleteFile(this.state.fileId);
    this.setState({
      fileId:null,
      fileName:''
    })

  }

  render() 
  { const {
    currentFile,
    progress,
    message,
  } = this.state;
      return (
        <div>
          <div>
            {this.state.submitted ? (
              <div style={{"textAlign":"center"}}>
                <h4>Fresh Idea Edited successfully!</h4>
                <a href = {this.state.url}><button className="btn btn-secondary" style={{"width":"20%"}}>Ok</button></a>
              </div>
            ) : (
              <div>
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

                <div className="form-group">
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
                  <button onClick={this.saveIdea} style={{"marginTop":"20px"}} className="btn btn-secondary" disabled={this.state.title.length<2||this.state.description.length<1}>
                    Submit
                  </button>
                </div>

              </div>
            )}
          </div>
        </div>
      );
    }
}