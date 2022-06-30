import React, { Component, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Web3 from "web3";
import ChitFunds from "../abis/ChitFunds.json";
import CreateGroup from "./components/createGroup";
import Group from "./components/group";
import ResetPassword from "./components/resetPassword";
import dashBoard from "./dashBoard.css";
import { slide as Menu } from "react-burger-menu";

class DashBoard extends Component {
  async componentWillMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.setUserName();
    // console.clear();
    // console.log(this.state.openCreateUi);
    await this.getGroupCount();
    await this.getGroups();

    // await this.getUserNumber();
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();

    this.setState({ account: accounts[0] });
    const networkId = await web3.eth.net.getId();
    const networkData = ChitFunds.networks[networkId];
    if (networkData) {
      const chitfunds = new web3.eth.Contract(
        ChitFunds.abi,
        networkData.address
      );
      this.setState({ chitfunds });
      this.setState({ loading: false });
    } else {
      window.alert("ChitFunds contract not deployed to detected network.");
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      account: "",
      loading: true,
      email: this.props.userName,
      emails: [],
      showResults: false,
      group: "",
      members: "",
      createui: false,
      groupNumbers: [],
    };
  }
  async setUserName() {
    let x = await this.state.chitfunds.methods
      .getUserName(this.state.email)
      .call();
    this.setState({ userName: x });
  }
  async checkEmailReact(email) {
    let flag = true;
    flag = await this.state.chitfunds.methods.checkEmail(email).call();
    if (flag) {
      alert("User added to group");
      this.state.emails.push(this.email.value);
    } else {
      alert("User doesn't have account");
    }
  }

  async getUserNumber() {
    let x = await this.state.chitfunds.methods
      .getUserNumber(this.state.email)
      .call();

    this.setState({ userNumber: Number(x) });
  }
  async reloadGroups() {
    console.log("Hello");
    await this.getGroupCount();
    await this.getGroups();
  }
  async getGroups() {
    let groupNumbers = [];
    let emails;
    for (let i = 1; i <= this.state.groupCount; i++) {
      emails = await this.state.chitfunds.methods.groups(`${i}`).call();
      emails = emails.members;
      let flag = emails.includes(this.state.email);

      if (flag) {
        groupNumbers.push(i);
      }
    }

    this.setState({ groupNumbers: groupNumbers });
  }

  async getGroupCount() {
    let x = await this.state.chitfunds.methods.groupCount().call();
    this.setState({ groupCount: Number(x) });
    this.props.setloading(false);
  }
  async resetPassword() {}

  render() {
    return (
      <div>
        <Menu>
          <button
            className="menu-item"
            onClick={() => {
              this.props.setOpenCreateUi(true);
            }}
          >
          

            Create Group
          </button>
          
          <button
            style={{ alignSelf: "center" }}
            onClick={(event) => {
              this.props.setReset(true);
            }}
          >
            Reset Password
          </button>
          <button
            style={{ alignSelf: "center" }}
            onClick={(event) => {
              this.props.nav("/signIn");
            }}
          >
            Sign Out
          </button>

          {/* <a className="menu-item" href="/desserts">
            Desserts
          </a> */}
        </Menu>
        <div className={dashBoard.pageWrap}>
          <i><h1>Welcome {this.state.userName}</h1></i>

          <div>
            {/* {!this.props.openCreateUi && (
              <button
                onClick={() => {
                  this.props.setOpenCreateUi(true);
                }}
              >
                {" "}
                Create Group{" "}
              </button>
            )} */}
            {this.props.openCreateUi && (
              <CreateGroup
                chitfunds={this.state.chitfunds}
                setOpenCreateUi={this.props.setOpenCreateUi}
                email={this.state.email}
                account={this.state.account}
                loading={this.props.setloading}
              />
            )}
            {this.props.openCreateUi && (
              <h4><center><button
                onClick={() => {
                  this.props.setOpenCreateUi(false);
                }}
              >
                Cancel
              </button></center></h4>
            )}
          </div>
          <div>
            {!this.props.loading &&
              !this.props.openReset &&
              this.state.groupNumbers.map((i, key) => {
                return (
                  <Group
                    groupNumber={i}
                    key={key}
                    email={this.state.email}
                    chitfunds={this.state.chitfunds}
                    account={this.state.account}
                    reloadGroups={this.reloadGroups}
                  />
                );
              })}
          </div>
          <div>
            <br></br>
            {/* {!this.props.openReset && (
              <button
                style={{ alignSelf: "center" }}
                onClick={(event) => {
                  this.props.setReset(true);
                }}
              >
                Reset Password
              </button>
            )} */}

            {this.props.openReset && (
              <ResetPassword
                chitfunds={this.state.chitfunds}
                account={this.state.account}
                setReset={this.props.setReset}
                email={this.state.email}
                openReset={this.props.openReset}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default function ErrorFunction() {
  const nav = useNavigate(); // extract navigation prop here
  let { userName } = useParams();
  const [openCreateUi, setOpenCreateUi] = useState(false);
  const [loading, setloading] = useState(true);
  const [openReset, setReset] = useState(false);
  return (
    <DashBoard
      nav={nav}
      userName={userName}
      openCreateUi={openCreateUi}
      setOpenCreateUi={setOpenCreateUi}
      loading={loading}
      setloading={setloading}
      openReset={openReset}
      setReset={setReset}
    />
  ); //pass to your component.
}
