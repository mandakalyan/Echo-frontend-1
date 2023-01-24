import React, { Component } from "react";
import IdeaService from "../services/idea.service";
import "./add-idea.component.css"
import FileService from "../services/file.service";


export default class AddIdea extends Component {
  constructor(props) {
    super(props);
    this.onChangeTitle = this.onChangeTitle.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeBenefitCategory = this.onChangeBenefitCategory.bind(this);
    this.onChangeCategory = this.onChangeCategory.bind(this);
    this.saveidea = this.saveidea.bind(this);
    this.newidea = this.newidea.bind(this);
    this.onChangeFile=this.onChangeFile.bind(this);

    this.state = 
    {
      id: null,
      title: "",
      description: "", 
      benefitCategory: "",
      category: "", 
      published: false,
      submitted: false,
      benefitCategoriesList: [],
      categoriesList: [],
      currentFile:'',
      errors: {},
      progress:0,
      message:''
    };
  }

  componentDidMount() {
    IdeaService.getBenefitCategoriesList().then(res => {
      this.setState({ benefitCategoriesList: res.data }) })

    IdeaService.getCategoriesList().then(res => {
      console.log(res.date+"hello")
      this.setState({ categoriesList: res.data }) })
  }

  onChangeTitle(e) {
    this.setState({
      title: e.target.value
    });
  }

  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }

  onChangeBenefitCategory(e) {
    this.setState({
      benefitCategory: e.target.value
    });
  }

  onChangeCategory(e) {
    this.setState({
      category: e.target.value
    });
  }
  onChangeFile(e){
    e.preventDefault();
    this.setState({
     currentFile:e.target.files[0],
     progress:0
    });
  }
  formValidation=()=>{
    const {title,description,benefitCategory,category,currentFile}=this.state;
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
    if(benefitCategory===""){
      errors.benefitCategory="Please Enter BenefitCategory";
      isValid=false;
  }
  if(category===""){
    errors.category="Please Enter Category";
    isValid=false;
}
if(currentFile.size>5242880){
  errors.currentFile="File size exceeded. Upload file size limit is 5MB";
  isValid=false;
}


    console.log(errors)
    this.setState({errors});
    return isValid;

}  

  
    async saveidea() {
      const isValid=this.formValidation();
       if(this.state.currentFile.size<5242880||this.state.currentFile===''){
        let fileId;
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
       var idea = {
         ideaTitle: this.state.title,
         ideaDescription: this.state.description,
         benefitCategory: this.state.benefitCategory,
         category: this.state.category,
         fileId:fileId
       };
   if(isValid){
   await IdeaService.addIdea(idea)
     .then(response => {
       this.setState({
         id: response.data.id,
         title: response.data.title,
         description: response.data.description,
         benefitCategory: response.data.benefitCategory,
         category: response.data.category,
         published: response.data.published,
         submitted: true
       });
       console.log(response.data);
     })
        }
      }
      
  }

  newidea() 
  {
    this.setState({
      id: null,
      title: "",
      description: "",
      benefitCategory: "",
      category: "",
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
    

      <div className="submit-form add-idea-card
      ">
        
        {this.state.submitted ? (
          <div style={{"textAlign":"center"}}>
            <h4>Idea submitted successfully!</h4>
            <a href="/ideas"> <button className="btn btn-secondary" style={{"width":"20%"}}>Ok</button></a>
          </div>
        ) : (
          <div>
            <h1>Fresh Ideas</h1>
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
                rows="2"
                value={this.state.description}
                onChange={this.onChangeDescription}
                name="description"
              >
              </textarea>
            </div>

            <div class="form-group">
            <p className="error_class">{this.state.errors.benefitCategory
            }</p>
              <label>Benefit Category</label>
              <select class="form-select" aria-label="Default select example"
              value={this.state.benefitCategory}
              onChange={this.onChangeBenefitCategory}>
                <option selected hidden>Select a Benefit category</option> 
                { this.state.benefitCategoriesList.map( bc =>
                  <option>
                    {bc.name}
                  </option>
                )}
              </select>
            </div>

            <div class="form-group">
            <p className="error_class">{this.state.errors.category}</p>
              <label>Category</label>
                <select class="form-select" aria-label="Default select example"
                value={this.state.category}
                onChange={this.onChangeCategory}>
                  <option selected hidden>Select a category</option>
                  { this.state.categoriesList.map( c =>
                    <option
                    >
                      {c.name}
                    </option> 
                  )}
                </select>
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
              <button onClick={this.saveidea} style={{"marginTop":"20px"}} className="btn btn-secondary"
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

