import React, { Component } from "react";
import { useNavigate, Link } from "react-router-dom";
import Web3 from "web3";
import ChitFunds from "../abis/ChitFunds.json";

import signUp from './signUp.css';
//login
class Login extends Component {
  async componentWillMount() {
    
    await this.loadWeb3();
    await this.loadBlockchainData();
    console.clear();
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
    };
  }

  async checkEmailReact(fname, lname, email, password) {
    let flag = true;
    flag = await this.state.chitfunds.methods.checkEmail(email).call();
    if (flag) {
      alert("Email already exists");
    } else {
      await this.createUser(fname, lname, email, password);
     
    }
  }
  async createUser(fname, lname, email, password) {
    this.setState({ loading: true });

    await this.state.chitfunds.methods
      .createUser(fname, lname, email, password)
      .send({ from: this.state.account, value: 1000000000000000000 })
      .once("receipt", (receipt) => {
        this.setState({ loading: false })
        this.props.nav("/signIn");
      }).catch(err=>{
        console.clear();
        alert("Please complete the transcation")
      });
  }
  async createGroupCheck(){
    let flag = this.state.chitfunds.methods.createGroup("1","1","1","1")
                .send({from:this.state.account, value : 1000000000000000000})
                .once("receipt", (receipt) => {
                  this.setState({ loading: false })
                  this.props.nav("/signIn");
                }).catch(err=>{
                  console.clear();
                  alert("Please complete the transcation")
                });
  }

  render() {
    return (
    <body><div>
      <div><h1>Welcome to ChitFunds</h1></div>
      <center><div className={signUp.qw}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const fname = this.fname.value;
            const lname = this.lname.value;
            const email = this.email.value;
            const password = this.password.value;
            this.checkEmailReact(fname, lname, email, password);
          }}
        >
          
          <div>
            <input
              id="fname"
              type="text"
              ref={(input) => {
                this.fname = input;
              }}
              placeholder="firstname"
              required
            />
          </div>
          <div>
            <input
              id="lname"
              type="text"
              ref={(input) => {
                this.lname = input;
              }}
              placeholder="last name"
              required
            />
          </div>
          <div>
            <input
              id="email"
              type="email"
              ref={(input) => {
                this.email = input;
              }}
              placeholder="email"
              required
            />
          </div>
          <div>
            <input
              id="password"
              type="password"
              ref={(input) => {
                this.password = input;
              }}
              placeholder="password"
              required
            />
          </div>

          <button type="submit">Submit</button>
          
        </form>
        <br></br>
        
      </div></center>
      <center><h3><div className={signUp.ee}>
          Already have a Account?
          <Link to="/signIn">
            <div>
              <h3><button class={signUp.re}>Login</button></h3>
            </div>
          </Link>
          </div>
          </h3></center>
        </div>
        </body>
    );
  }
}

export default function LoginFunction() {
  const nav = useNavigate(); // extract navigation prop here

  return <Login nav={nav} />; //pass to your component.
}
