// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import {ERC721Burnable, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

contract WarrantyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable, AccessControl {
    

    mapping (uint256 => uint256) public creationTime;

    bool RepairWarranty = true ;

  // Struct to hold repair/replacement history for an NFT

     struct RepairHistory 
     {
        uint256 timestamp;
        string description;
    }


     // Mapping from NFT ID to repair/replacement history

    mapping(uint256 => RepairHistory[]) public repairHistory;

    bytes32 public constant Retailers = keccak256("Retailers");
    
    constructor(
        address _root)
        ERC721("WarrantyNFT", "WARR") 
        Ownable(_root) 
        {

        grantRole(DEFAULT_ADMIN_ROLE, _root);
        _setRoleAdmin(Retailers, DEFAULT_ADMIN_ROLE);

    }

     modifier onlyManager() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to Managers.");
        _;
    }

    modifier onlyRetailer() {
        require(hasRole(Retailers, msg.sender), "Restricted to Retailers.");
        _;
    }

         // Changing the Owner of the Contract

    function changeOwner(
        address _to)
        public 
        onlyOwner
        {
        transferOwnership(_to);
    }

    // Adding a retailer, who can mint NFT's

    function addRetail(
        address _retailer) 
        public 
        virtual 
        onlyManager 
        {
        grantRole(Retailers, _retailer);
    }
    
    // Removing the person from the assigned the retailer role

     function removeRetai(
        address _retailer) 
        public 
        virtual 
        onlyManager 
        {
        revokeRole(Retailers, _retailer);
    }

    // Setting up a new Role Admin/ Manager

    function addManager(
        address _manager) 
        public
        virtual 
        onlyOwner 
        {
        grantRole(DEFAULT_ADMIN_ROLE, _manager);
    }

    //Renouncing the Manager perks

    function renounceManager(
        address _manager) 
        public 
        virtual 
        onlyOwner() 
        returns(bool)
        {
        renounceRole(DEFAULT_ADMIN_ROLE, _manager);
        return (hasRole(DEFAULT_ADMIN_ROLE, _manager));
    }

    // This function is used to mint a new NFT and assign it to a specific address.

    function mint(
        address _to, 
        string memory uri)
        public  
        onlyRetailer  
        returns(uint256)
        {

        // Generate a new, unique token ID for the NFT.

        uint256 tokenId = totalSupply() + 1;

        creationTime[tokenId] = block.timestamp;

        // ownerOf(tokenId)  = _to;

        // Mint the NFT and assign it to the specified address.

        _mint(_to, tokenId);
        _setTokenURI(tokenId, uri);

        return tokenId;
    }

    // Makes he Warranty void 

    function repairWarrantyVoid() 
    private   
    onlyRetailer  
    {
        RepairWarranty = false;
    }

    // Brings the Warranty back
        function repairWarrantyNotVoid() 
        private  
        onlyRetailer 
        {
        RepairWarranty = true;
    }

    function _exists(uint256 _tokenId)
    internal 
    view
    returns(bool){

        return (_tokenId <  totalSupply());
    }

    // This function is used to check whether a specific address has a valid warranty NFT.

    function hasValidWarranty(
        address _owner) 
        public 
        view 
        returns (bool) 
        {

        // Check if the specified address has any NFTs of the "WAR" symbol.

        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) return false;

        // Check if the most recent NFT minted for this address is still within the warranty period.

        uint256 latestTokenId = tokenOfOwnerByIndex(_owner, tokenCount - 1);

        uint256 mintTimestamp = creationTime[latestTokenId];

        uint256 warrantyPeriod = 52 weeks; 

        if (block.timestamp < mintTimestamp + warrantyPeriod) 
       
        return true;

        // If the address has a valid NFT, return true.

        return false;
    }

    function transfer(
        address _to, 
        uint256 _tokenId) 
        public 
        {
        address nftOwner = ownerOf(_tokenId);

        // Ensure that the NFT exists and is owned by the caller

        require(_exists(_tokenId), "Token does not exist");

        require(hasValidWarranty(msg.sender),"Your Warranty has expired");

        require(_isAuthorized(nftOwner, msg.sender, _tokenId), "Caller is not the owner or approved to transfer the token");

        // Transfer ownership of the NFT to the new owner

        _transfer(msg.sender, _to, _tokenId);
    }

    function addRepair(
        uint256 _tokenId, 
        string memory _description) 
        public 
        onlyRole(Retailers)
        {

        address nftOwner = ownerOf(_tokenId);

        // Ensure that the NFT exists and is owned by the caller

        require(_exists(_tokenId), "Token does not exist");

        require(hasValidWarranty(msg.sender),"Your Warranty has expired");

        require(_isAuthorized(nftOwner, msg.sender, _tokenId) || hasRole(Retailers, msg.sender), "Caller is not the owner or approved to update the token");


        // Add a new entry to the repair/replacement history for the NFT

        repairHistory[_tokenId].push(RepairHistory(block.timestamp, _description));
    }

    //Function overrides

    function _update(address to, uint256 tokenId, address zero)
    internal
    virtual
    override(ERC721, ERC721Enumerable)
    returns(address)
    {

        return super._update(to, tokenId, zero);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _increaseBalance(address account, uint128 value) internal virtual override(ERC721, ERC721Enumerable){
    return super._increaseBalance(account, value);
    }
}
