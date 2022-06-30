import { Component } from "react";

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async resetPassword() {
    if(this.oldPassword.value === this.newPassword.value){
      alert("New Password can't be same as Old password");
      return;
    }
    let y = false;
    let flag = await this.props.chitfunds.methods
      .login(this.props.email, this.oldPassword.value)
      .call();
    if (Number(flag) === 1) {
      let x = await this.props.chitfunds.methods
        .resetPassword(
          this.props.email,
          this.oldPassword.value,
          this.newPassword.value
        )
        .send({ from: this.props.account })
        .once("reciept", (reciept) => {
          y = true
          window.location.reload(true);
        })
        .catch((err)=>{
          alert("Please complete the transaction");
        });
        if(y){
          
        alert("Password Changed");
        this.props.setReset(false);
        
        }
        
    } else {
      alert("Wrong Old password");
    }
  }

  render() {
    return (
      <center><div>
        
          <h2>Reset Password</h2>
          <label>Old Password:</label>
          <input
            type="password"
            ref={(input) => {
              this.oldPassword = input;
            }}
            placeholder="Old Password"
            required
          ></input>
          <br></br>
          <label>New Password:</label>
          <input
            type="password"
            ref={(input) => {
              this.newPassword = input;
            }}
            placeholder="New Password"
            required
          ></input>
          <br></br>
          <button
            type="submit"
            onClick={() => {
              this.resetPassword();
            }}
          >
            Reset
          </button>
        
        <button onClick={()=>
        {
          this.props.setReset(false);
        }}>Cancel</button>
      </div></center>
    );
  }
}

export default ResetPassword;
