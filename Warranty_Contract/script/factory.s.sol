/// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/factory.sol";

contract MyScript is Script {

    NFTFactory _contract;


    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        NFTFactory _warranty = new NFTFactory();
        _contract = _warranty;

        vm.stopBroadcast();

    }

    function returnContract() external view returns (NFTFactory){

        return _contract;
        
    }
}
