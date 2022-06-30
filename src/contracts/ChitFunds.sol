// pragma experimental ABIEncoderV2;
pragma solidity ^0.5.13;


contract ChitFunds {
    address payable deployer = 0x01Eca738b04ffD94c5270a90cE93EF597108B311; // we need to initilzie this from the ganache with first address as the deployer
    uint256 public userCount = 0;
    uint256 public groupCount = 0;
    mapping(uint256 => user) public users;
    mapping(uint256 => group) public groups;
    string public name;

    struct group{
        string name;
        string winnerEmail;
        address payable winner;
        string members;
        string winners;
        string payed;
        string amount;
    }

    struct user {
        string firstName;
        string lastName;
        string email;
        string password;
        address payable defaultAddress;
        bool admin;
    }

    event userCreated(
        string firstName,
        string lastName,
        string email,
        string password,
        address payable defaultAddress,
        bool admin
    );
    event groupCreated(
        string name,
        string winnerEmail,
        address payable winner,
        string members,
        string winners,
        string payed,
        string amount
    );

    function createGroup(string memory _name,
                        string memory _members, string memory _amount) public payable returns(bool flag){
                        groupCount = groupCount + 1 ;
                        groups[groupCount] = group( _name,
                                                    "",
                                                    address(0),
                                                    _members,
                                                    "",
                                                    "",
                                                    _amount
                                                    );
                        deployer.transfer(1000000000000000000);
                        emit groupCreated(_name,
                                         "",
                                         address(0),
                                         _members,
                                         "",
                                         "",
                                         _amount);

                            return true;
                        }




    function  getEmail(string memory _email) public view returns (uint256){
        for (uint256 i = 1; i <=userCount; i++) {
            user memory test1 = users[i];
            string memory test12 = test1.email;

            if (
                keccak256(abi.encodePacked(test12)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                return i;
            }
        }

    }




    // this bool admin is not neccessary
    constructor() public {
        name ="ChitFunds";
    }

    function createUser(
        string memory _firstName,
        string memory _lastName,
        string memory _email,
        string memory _password
    ) public payable {
        require(bytes(_firstName).length>0);
        require(bytes(_lastName).length>0);
        require(bytes(_email).length>0);
        require(bytes(_password).length>0);
        // increase the user count
        userCount = userCount + 1;
        // stores the user data in struct named users
        users[userCount] = user(
            _firstName,
            _lastName,
            _email,
            _password,
            msg.sender,
            false
        );
        // transfer 1 eth or 1 B14 to the deployer as the fee to use the application
        deployer.transfer(msg.value);
        // deployer.transfer(1000000000000000000);
        // triggers a event to write stuff on the blockchain
        emit userCreated(
            _firstName,
            _lastName,
            _email,
            _password,
            msg.sender,
            false
        );
    }
    function resetPassword(string memory _email,string memory _oldPass,string memory _newPass) public payable returns(bool){
        uint userNumber;
         for(uint256 i = 1; i <=userCount ; i++){
            user memory test1 = users[i];
            string memory test12 = test1.email;
             if (
                keccak256(abi.encodePacked(test12)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                userNumber = i;
            }
         }
            if(keccak256(abi.encodePacked(users[userNumber].password))==
                keccak256(abi.encodePacked(_oldPass))){
                users[userNumber].password = _newPass;
                return true;
            }
            return false;
    }

    function setWinner(string memory _email, string memory _winners,uint groupNumber,string  memory _payed)
     public payable {
        uint256 userNumber ;
        for(uint256 i = 1; i <=userCount ; i++){
            user memory test1 = users[i];
            string memory test12 = test1.email;
             if (
                keccak256(abi.encodePacked(test12)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                userNumber = i;
            }
            

        }


        groups[groupNumber].winner = users[userNumber].defaultAddress;
        groups[groupNumber].winners = _winners;
        groups[groupNumber].winnerEmail = _email;
        groups[groupNumber].winner.transfer(msg.value);
        groups[groupNumber].payed = _payed;




    }
    function payWinner(string memory _payed,uint groupNumber) public payable{
        groups[groupNumber].winner.transfer(msg.value);
        groups[groupNumber].payed= _payed;
    }
   
     function getUserNumber(string memory _email) public view returns (string memory){
        string memory b = "0";
        for(uint256 i = 1; i <=userCount ; i++){
            user memory test1 = users[i];
            string memory test12 = test1.email;
             if (
                keccak256(abi.encodePacked(test12)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                b = uint2str(i);
            }
            

        }
        return b;
     }


        function uint2str(
        uint256 _i
        )
        internal
        pure
        returns (string memory str)
        {
        if (_i == 0)
        {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0)
        {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0)
        {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
        }
    function getUserName(string memory _email) public view returns (string memory username){
        for(uint256 i = 1; i <=userCount ; i++){
            user memory test1 = users[i];
            string memory test12 = test1.email;
            string memory b;
             if (
                keccak256(abi.encodePacked(test12)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                b = string(abi.encodePacked(test1.firstName," "));
                b = string(abi.encodePacked(b, test1.lastName));
                return b;
            }
            

        }
        return "";
    }


     function getGroups(string memory counter) public view returns (string memory){
        (uint256 x, ) = strToUint(counter);
        string memory b= users[x].email;
        return b;
     }
    
function strToUint(string memory _str) public pure returns(uint256 res, bool err) {
    for (uint256 i = 0; i < bytes(_str).length; i++) {
        if ((uint8(bytes(_str)[i]) - 48) < 0 || (uint8(bytes(_str)[i]) - 48) > 9) {
            return (0, false);
        }
        res += (uint8(bytes(_str)[i]) - 48) * 10**(bytes(_str).length - i - 1);
    }
    
    return (res, true);
}

    function checkEmail(string memory _email) public view returns (bool flag) {
        for (uint256 i = 1; i <=userCount; i++) {
            user memory test1 = users[i];
            string memory test12 = test1.email;

            if (
                keccak256(abi.encodePacked(test12)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                return true;
            }
        }
        return false;
    }
    //this function accpet email and password as parameters
    //it returns 1 if the password of the specifed email matches the one stored on blockchain
    //return 0 if the password of the specifed email doesn't match the one stored on blockchain
    // return -1 if the specified email doesn't exists on the blockchain
    function login(string memory _email, string memory _password) public view returns(int ){
        for(uint256 i = 1 ; i <= userCount; i++)
        {
            user memory temp = users[i];
            string memory tempEmail = temp.email;
            string memory tempPassword =temp.password;
            if (
                keccak256(abi.encodePacked(tempEmail)) ==
                keccak256(abi.encodePacked((_email)))
            ) {
                if (keccak256(abi.encodePacked(tempPassword)) ==
                keccak256(abi.encodePacked((_password))))
                {
                    return 1;
                }
                else
                {
                    return 0;
                }
    
            }
        }
        return -1;
    }
}
