import { Component } from "react";

class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account:this.props.account,
      loading: true,
      email: this.props.email,
      emails: [this.props.email],
      showResults: false,
      group: "",
      members: "",
      chitfunds: this.props.chitfunds,
    };
  }

  async checkEmailReact(email) {

    if(email === this.state.email){
      alert("You Are already apart of the group");
      return;


    }
    for(let i = 0 ; i< this.state.emails.length; i++){
      if(email === this.state.emails[i]){
        alert("This email is already apart of the group");
        return ;
      }
    }
    let flag = true;
    flag = await this.props.chitfunds.methods.checkEmail(email).call();
    if (flag) {
      alert("User added to group");
      this.state.emails.push(this.email.value);
    } else {
      alert("User doesn't have account");
    }
  }
  async createGroup() {
    
    let members = "";
    for (let i = 0; i < this.state.emails.length; i++) {
      members = members + this.state.emails[i] + "|";
    }
    // console.log(members);

    await this.state.chitfunds.methods.createGroup(this.groupName.value,members,this.amount.value).send({from : this.state.account , value: 1000000000000000000})
      .once("receipt", (receipt) =>{
        alert("Group is created");
        
      this.props.setOpenCreateUi(false);
        window.location.reload(true);
        
        
      }).catch((err) =>{
        alert("Please complete the transcation");
        
      });
      
  }
  render() {
    return (
      <div>
       
        <div>
          <center><h2>Create Group</h2></center>
        </div>
        <center>
        <form
          onSubmit={(event) => {
            event.preventDefault();

            this.createGroup();
            
          }}
        >
          
            <div>
              <input
                id="groupName"
                type="text"
                ref={(input) => {
                  this.groupName = input;
                }}
                placeholder="Group Name"
                label
                required
              />
              <br></br>
              <input type="number" id ="amount"
                ref={(input)=>{
                  this.amount = input;
                }}
                placeholder= "Amount"></input><span style={{fontWeight: "bolder",
                fontSize: "20px"}}></span>
               <br></br>
              <input
                type="email"
                id="email"
                ref={(input) => {
                  this.email = input;
                }}
                placeholder="Email"
              ></input>
             <br></br>
              <center><button
                onClick={(event) => {
                  event.preventDefault();
                  this.checkEmailReact(this.email.value);
                }}
              >
                Add
              </button>
              

              <button type="submit" disabled={this.state.groupName}>
                Create Group
              </button></center>
            </div>
          
        </form></center>
      </div>
    );
  }
}
export default CreateGroup;
