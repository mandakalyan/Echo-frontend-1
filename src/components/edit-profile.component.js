import React, { Component } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import "./edit-profile.component.css";

export default class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userReady: false,
      currentUser: [],
      userDetails: {},
      role: "",
      fname:"",
      lname:"",
      email:"",
      department:"",
      account:"",
      url: "",
      errors: {},
      departmentsList: [],
      status: false
    };

    this.onChangeLname = this.onChangeLname.bind(this);
    this.onChangeFname = this.onChangeFname.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangeDepartment = this.onChangeDepartment.bind(this);
    this.onChangeRole = this.onChangeRole.bind(this);
    this.onChangeAccount = this.onChangeAccount.bind(this);
    this.saveProfile = this.saveProfile.bind(this);
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    AuthService.getDepartmentsList().then(res => {
      this.setState({ departmentsList: res.data }) })
    if (user) {
      UserService.getUserByEmail(user.email).then((res) => {
        this.setState({
          userDetails: res.data,
          status: res.data.active,
          fname:res.data.fname,
          lname:res.data.lname,
          email:res.data.email,
          department:res.data.department,
          role:res.data.role.name,
          account:res.data.account,
          url: "/profile" 
        });
      });
      this.setState({ currentUser: user, });
    }
  }

  formValidation = () => {
    const { fname, lname,department, account } = this.state;
    let isValid = true;
    const errors = {};
    if (fname.length <=0 ) {
      errors.fname = "Please Enter Your First Name";
      isValid = false;
    }
    if (lname.length <=0) {
      errors.lname = "Please Enter Your Last Name";
      isValid = false;
    }
    if (department.length <=0 ) {
      errors.department = "Please Enter Your Department Name";
      isValid = false;
    }
    if (account.length <=0 ) {
      errors.account= "Please Enter Your Account Name";
      isValid = false;
    }
    this.setState({ errors });
    return isValid;
  };
  
  onChangeFname(e) {
    this.setState({ fname: e.target.value, });
  }
  onChangeLname(e) {
    this.setState({ lname: e.target.value, });
  }
  
  onChangeEmail(e) {
    this.setState({ email: e.target.value, });
  }
  onChangeDepartment(e) {
    this.setState({ department: e.target.value, });
  }

  onChangeRole(e) {
    this.setState({ role: e.target.value, });
  }

  onChangeAccount(e) {
    this.setState({account: e.target.value, });
  }

  saveProfile() {
    const isValid = this.formValidation();
    var id1 = this.props.id;
    if (isValid) {
      var d=this.state.department.name;
      //console.log("hello"+d)
      var profile = {
        id:id1,
        fname:this.state.fname,
        lname:this.state.lname,
        email:this.state.email,
        department:d,
        account:this.state.account
      };
     // console.log(profile)
      var user = AuthService.getCurrentUser();
      UserService.updateUserByEmail(profile.email, profile, user).then(() => { this.setState({ submitted: true }); });
    }
  }

  render() {
    return (
      <div>
        {this.state.submitted ? (
          <div style={{ textAlign: "center" }}>
            <h4>Profile edited successfully!</h4>
            <a href={this.state.url}>
              {" "}
              <button className="btn btn-secondary" style={{ width: "20%" }}>
                ok
              </button>
            </a>
          </div>
        ) : (
          <div class="name">   
            <div className="form-group">
              <p className="error_class">{this.state.errors.fname}</p>
              <label htmlFor="fname">FirstName</label>
              <input
                type="text"
                className="form-control"
                id="fname"
                required
                value={this.state.fname}
                onChange={this.onChangeFname}
                name="fname"
              />
            </div>
            <div className="form-group">
              <p className="error_class">{this.state.errors.lname}</p>
              <label htmlFor="lname">LastName</label>
              <input
                type="text"
                className="form-control"
                id="lname"
                required
                value={this.state.lname}
                onChange={this.onChangeLname}
                name="lname"
              />
            </div>
            <div className="form-group">
              {/* <p className="error_class">{this.state.errors.title}</p> */}
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                required
                value={this.state.email}
                onChange={this.onChangeEmail}
                name="email"
                disabled
              />
            </div>

            <div className="form-group">
              <p className="error_class">{this.state.errors.department}</p>
              <label htmlFor="department">Department</label>
              <select class="form-select" aria-label="Default select example"
                value={this.state.department.name}
                onChange={this.onChangeDepartment}
              >
                { this.state.departmentsList.map( dept =>
                <option>
                  {dept.name}
                </option> )}
              </select>
            </div>

            <div className="form-group">
              <p className="error_class">{this.state.errors.account}</p>
              <label htmlFor="account">Account</label>
              <input
                type="text"
                className="form-control"
                id="account"
                required
                value={this.state.account}
                onChange={this.onChangeAccount}
                name="account"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="ROle">Role</label>
              <input
                type="text"
                className="form-control"
                id="role"
                required
                value={this.state.role}
                onChange={this.onChangeRole}
                name="role"
                disabled
              />
            </div>
            <div style={{"textAlign":"center"}}>
              <button onClick={this.saveProfile} style={{ marginTop: "20px"}} className="btn btn-secondary">
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}
