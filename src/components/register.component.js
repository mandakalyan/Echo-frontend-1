import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import AuthService from "../services/auth.service";



export default class Register extends Component {
  constructor(props) {
    super(props);

    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeFname = this.onChangeFname.bind(this);
    this.onChangeLname = this.onChangeLname.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onChangeAccount = this.onChangeAccount.bind(this);
    
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
      department: "FCI",
      role: "",
      account:"",
      successful: false,
      message: "",
      submitted: false,
      errors: {},
      departmentsList: [],
      rolesList: [],
      show: false
    };
  }

  componentDidMount() {
    AuthService.getDepartmentsList().then(res => {
      this.setState({ departmentsList: res.data }) })
      
   
  }
  
  formValidation = () => {
    const { fname, lname, email, password, department, account} = this.state;
    let isValid = true;
    const errors = {};
    
    if (fname.length <= 0 ) {
      errors.fname = "Please Enter Your First Name";
      isValid = false;
    }

    if (lname.length <= 0 ) {
      errors.lname = "Please Enter Your Last Name";
      isValid = false;
    }

    if (email.length <= 0 ) {
      errors.email = "Please Enter Your Email Adddress";
      isValid = false;
    }

    if (password.length <= 8|| password.length > 24 ) {
      errors.password = "Password must be in range of 8 to 24 character";
      isValid = false;
    }

    if (department.length <= 0 ) {
      errors.department = "Please Enter Your Department";
      isValid = false;
    }
    
    if (account.length <= 0 ) {
      errors.account = "Please Enter Your Account(Project Name)";
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  };
  
  onChangeFname(e) { this.setState({ fname: e.target.value }); }
  onChangeLname(e) { this.setState({ lname: e.target.value }); }
  onChangeEmail(e) { this.setState({ email: e.target.value }); }
  onChangePassword(e) { this.setState({ password: e.target.value }); }
  onChangeDepartment(e) { this.setState({ department: e.target.value }); }
   onChangeAccount(e) { this.setState({ account: e.target.value }); }

  handleRegister(e) {
    e.preventDefault();
    this.setState({
      message: "",
      successful: false
    });
    const isValid = this.formValidation();
    

    if (isValid) {
      AuthService.register(
        this.state.fname,
        this.state.lname,
        this.state.email,
        this.state.password,
        this.state.department,
        this.state.account
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        

        error => {
          const resMessage =
            (
              error.response &&
              error.response.data &&
              error.response.data.message
            ) || error.message || error.toString();
            
            this.setState({
            successful: false,
            message: resMessage
          });
          
        }
        
      );
    }
  }
  
  render() {

    return (
      <div className="col-md-12">
        <div className="card card-container" style={{"backgroundColor":"rgba(227, 213, 245, 0.632)"}}>
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form
            onSubmit={this.handleRegister}
            ref={c => { this.form = c; }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                <p className="error_class"style={{"color":"red"}}>{this.state.errors.fname}</p>
                  <label htmlFor="fname">First name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="fname"
                    value={this.state.fname}
                    onChange={this.onChangeFname}
                    
                  />
                </div>
                
                <div className="form-group">
                <p className="error_class" style={{"color":"red"}}>{this.state.errors.lname}</p>
                  <label htmlFor="lname">Last name</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="lname"
                    value={this.state.lname}
                    onChange={this.onChangeLname}
                   
                  />
                </div>
                
                <div className="form-group">
                <p className="error_class" style={{"color":"red"}}>{this.state.errors.email}</p>
                  <label htmlFor="email">Email</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    onChange={this.onChangeEmail}
                    
                  />
                </div>
                
                <div className="form-group">
                <p className="error_class" style={{"color":"red"}}>{this.state.errors.password}</p>
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                   
                    
                  />
                </div>

                <div class="form-group">
                <p className="error_class" style={{"color":"red"}}>{this.state.errors.department}</p>
                  <label>Department</label>
                  <select class="form-select" aria-label="Default select example"
                    value={this.state.department}
                    onChange={this.onChangeDepartment}
                  >
                    { this.state.departmentsList.map( dept =>
                      <option>
                        {dept.name}
                      </option>
                    )}

                  </select>
                </div>
				 <div className="form-group">
         <p className="error_class" style={{"color":"red"}}>{this.state.errors.account}</p>
                  
                  <label htmlFor="account">Account</label>
                  <Input
                    type="text"
                    className="form-control w-1/4"
                    name="account"
                    value={this.state.account}
                    onChange={this.onChangeAccount} 
                  />
                </div>

               
                
                <div className="form-group">
                  <br></br>
                  <button style={{"marginLeft":"100px"}} className="btn btn-primary btn-block"><span>Sign Up</span></button>
                </div>

              </div>

            )}
            
            {this.state.message && (
              <div className="form-group text-center">
                <div
                  className={
                    this.state.successful ? "alert alert-success" : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>

                <a href="/login" type="button" class="btn btn-secondary">Login</a>

              </div>
            )}

            <CheckButton
              style={{ display: "none" }}
              ref={c => { this.checkBtn = c; }}
            />

          </Form>

        </div>
      </div>
    );
  }
}