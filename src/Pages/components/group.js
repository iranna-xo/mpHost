import React, { Component } from "react";

class Group extends Component {
  async componentWillMount() {
    await this.groupName(this.props.groupNumber);

    this.setState({ loading: false });
  }
  constructor(props) {
    super(props);

    this.state = {
      chitfunds: this.props.chitfunds,
      account: this.props.account,
      email: this.props.email,
      groupName: "",
      loading: true,
      members: undefined,
      winners: undefined,
      amount: undefined,
      winnerSet: false,
      winnerId: "",
      payed: undefined
    };
  }
  async groupName(groupNumber) {
    this.setState({ loading: true });
    let x = await this.state.chitfunds.methods.groups(groupNumber).call();

    this.setState({ groupName: x.name });

    let y = x.members;
    y = y.split("|");
    y.pop();
    this.setState({ members: y });
    this.setState({ admin: y[0] });
    this.setState({ amount: Number(x.amount) });
    y = x.winners;
    y = y.split("|");
    y.pop();
    this.setState({ winners: y });
    this.setState({ amount: Number(x.amount) });
    if (x.winner !== "0x0000000000000000000000000000000000000000") {
      this.setState({ winnerSet: true });
      // console.log();
      this.setState({
        winnerId: this.state.winners[this.state.winners.length - 1],
      });
    }
    y = x.payed;
    y = y.split("|");
    y.pop();
    this.setState({ payed: y });
    if(this.state.members.length === this.state.payed.length){
      this.setState({winnerSet : false});
      //making use of winnerSet only to redraw the lucky draw.
    }
    
  }
  async luckyDraw() {
    let tempMembers = [];

    if (this.state.winners.length !== 0) {
      for (let i = 0; i < this.state.members.length; i++) {
        let flag = false;

        for (let j = 0; j < this.state.winners.length; j++) {
          if (this.state.members[i] === this.state.winners[j]) {
            flag = true;
          }
        }
        if (!flag) {
          tempMembers.push(this.state.members[i]);
        }
      }
    } else {
      tempMembers = this.state.members;
    }
    if (this.state.members.length === this.state.winners.length) {
      alert("Everyone has won once");
      return;
    }

    const min = 0;
    const max = tempMembers.length;
    const rand = Math.floor(min + Math.random() * (max - min));

    const userNumber = await this.state.chitfunds.methods
      .getUserNumber(tempMembers[rand])
      .call();
    let x = await this.state.chitfunds.methods.users(userNumber).call();
    const winnerAddress = x.defaultAddress;
    console.log(winnerAddress);
    this.state.winners.push(tempMembers[rand]);
    this.state.winners.push("");
    x = this.state.winners.join("|");
    console.log();
    let winnerUserName = await this.state.chitfunds.methods
      .getUserName(tempMembers[rand])
      .call();
    // string memory _email, string memory _winners,uint groupNumber
    // let y = await this.state.chitfunds.methods.setWinner(tempMembers[rand],x,this.props.groupNumber).call();
    // let z = await this.state.chitfunds.methods.groups(this.props.groupNumber).call();
    // console.log(z);
    await this.state.chitfunds.methods
      .setWinner(tempMembers[rand], x, this.props.groupNumber, this.state.email+"|")
      .send({
        from: this.state.account,
        value: this.state.amount * 1000000000000000000,
      })
      .once("receipt", (receipt) => {
        alert("The Winner is " + winnerUserName);
        this.props.reloadGroups();
        window.location.reload(true);
      })
      .catch((err) => {
        console.log(err);
      });
    // await this.state.chitfunds.methods.createGroup(this.groupName.value,this.state.email
    //   ,members,this.amount.value).send({from : this.state.account , value: 1000000000000000000})
    //   .once("receipt", (receipt) =>{
    //     alert("Group is created");
    //     this.props.setOpenCreateUi(false);

    //   }).catch((err) =>{
    //     alert("Please complete the transcation");
    //   });
  }


  async payTheWinner(){
    
    this.state.payed.push(this.state.email);
     this.state.payed.push("");
    let x = this.state.payed.join("|");
    // payWinner(string memory _payed,uint groupNumber)
    // await this.state.chitfunds.methods
    //   .setWinner(tempMembers[rand], x, this.props.groupNumber, this.state.email+"|")
    //   .send({
    //     from: this.state.account,
    //     value: this.state.amount * 1000000000000000000,
    //   })
    //   .once("receipt", (receipt) => {
    //     alert("The Winner is " + winnerUserName);
    //     this.props.reloadGroups();
    //     window.location.reload(true);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    await this.state.chitfunds.methods.payWinner(x,this.props.groupNumber)
    .send({from:this.state.account,value : this.state.amount * 1000000000000000000})
    .once("receipt",(receipt)=>{
      alert("Payed the winner");
      window.location.reload(true);
    })
    .catch((err) =>{
      console.log(err);
    });

  }
  checkIfAdmin() {
    let x = this.state.admin === this.state.email;
    let y = !this.state.winnerSet;
    return x && y;
  }

  checkIfPayed() {
    if(this.state.winnerSet){

    }
    else{
      return true;
    }
    
    if(this.state.payed === undefined){
      return true;
    }
    for (let i = 0; i < this.state.payed.length; i++) {
      if (this.state.email === this.state.payed[i]) {
        return true;
      }
    }
    return false;
  }
  render() {
    return (
      <div>
        <center><div><h3>
        <fieldset>
          {!this.state.loading && <h2>Group Name: {this.state.groupName}</h2>}
          <h3><u>Members</u></h3>
          {!this.state.loading &&
            this.state.members.map((i, key) => {
              let y = "";

              if (this.state.winnerSet) {
                if (this.state.winnerId === i) {
                  y = "(Winner)";
                }
              }
              return (
                <li key={key}>
                  {i} {y}
                </li>
              );
            })}
          <br></br>
          {this.checkIfAdmin() && (
            <button
              onClick={() => {
                this.luckyDraw();
              }}
            >
              Lucky Draw
            </button>
          )}
          {!this.checkIfPayed() && (<button onClick={()=> {
            this.payTheWinner();
          }}>Pay the winner</button>)}
          
        </fieldset>
        </h3></div></center>
      </div>
    );
  }
}

export default Group;
