import React, { Component } from "react";
import { useNavigate, Link } from "react-router-dom";
import Web3 from "web3";
import ChitFunds from "../abis/ChitFunds.json";
import signIn from "./signIn.css";

class SignIn extends Component {
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

  async checkEmailReact(email, password) {
    let flag = true;
    flag = await this.state.chitfunds.methods.checkEmail(email).call();
    if (flag) {
      return true;
    } else {
      console.log("email doesn't exists");
      return false;
    }
  }
  async login(email, password) {
    this.setState({ loading: true });
    let flag = false;
    flag = this.checkEmailReact(email, password);

    let flag1 = await this.state.chitfunds.methods
      .login(email, password)
      .call();
    if (!flag) {
      return;
    }

    if (flag1 == 1) {
      // let username = await this.state.chitfunds.methods.getUserName(email).call();
      let x = "/dashBoard/" + email;
      this.props.nav(x);
    } else {
      alert("Wrong Password");
    }

    this.setState({ loading: false });
  }

  render() {
    return (
      <body>
        <div>
          <h1>Welcome to ChitFunds</h1>
          <div className={signIn.qw}>
            <center>
              <form
                onSubmit={(event) => {
                  event.preventDefault();

                  const email = this.email.value;
                  const password = this.password.value;
                  this.login(email, password);
                }}
              >
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
            </center>
          </div>
          {/* <div style={{display:'flex',
                      alignContent:'center',
                      alignItems:'center'}}>
            New User?
            <div>
              <Link to="/">
                <button>Sign Up</button>
              </Link>
            </div>
          </div> */}
          <br></br>
          <center><h3>
            <div>
              New User?
              <div>
                <Link to="/">
                  <button>Sign Up</button>
                </Link>
              </div>
            </div>
          </h3></center>
        </div>
      </body>
    );
  }
}

export default function SignInFunction() {
  const nav = useNavigate(); // extract navigation prop here

  return <SignIn nav={nav} />; //pass to your component.
}
