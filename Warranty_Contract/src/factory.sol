// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./warranty.sol";

contract NFTFactory {

    address[] public s_deployedContracts;

    struct Info{
        string brandName;
        string productName;
        uint256 creationTime;
    }

    mapping (address => Info[]) public s_brandDetails;

    mapping(address => address[]) public s_brandOwnedCollections;

    event ContractDeployed(address indexed newContract, address indexed creator);

    function createContract(string memory brandName, string memory _productName, string memory collectionName, string memory collectionSymbol, uint256 warrantyPeriod) public returns(address){
        WarrantyNFT newContract = new WarrantyNFT(collectionName, collectionSymbol, msg.sender, warrantyPeriod);
        s_deployedContracts.push(address(newContract));
        Info memory newInfo;
        newInfo.brandName = brandName;
        newInfo.productName = _productName;
        newInfo.creationTime = block.timestamp;
    
        // Add the new Info struct to the array associated with the new contract address
        s_brandDetails[address(newContract)].push(newInfo);
        s_brandOwnedCollections[msg.sender].push( address(newContract));
        emit ContractDeployed(address(newContract), msg.sender);
        return address(newContract);
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return s_deployedContracts;
    }

    function getBrandOwnedCollections(address _address) external view returns(address[] memory){
        return s_brandOwnedCollections[_address];
    }

    function getBrandInfo(address _address) external view returns(Info[] memory){
        return s_brandDetails[_address];
    }


}

