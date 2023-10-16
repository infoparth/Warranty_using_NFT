// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract WarrantyNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, AccessControl {

    mapping(uint256 => uint256) public creationTime;
    bool public RepairWarranty = true;

    struct RepairHistory {
        uint256 timestamp;
        string description;
    }

    mapping(uint256 => RepairHistory[]) public repairHistory;

    bytes32 public constant RETAILERS = keccak256("Retailers");

    constructor(address _root) ERC721("WarrantyNFT", "WARR") {
        _setupRole(DEFAULT_ADMIN_ROLE, _root);
        _setRoleAdmin(RETAILERS, DEFAULT_ADMIN_ROLE);
    }

    function changeOwner(address _to) public onlyOwner {
        transferOwnership(_to);
    }

    modifier onlyManager() {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Restricted to Managers.");
        _;
    }

    modifier onlyRetailer() {
        require(hasRole(RETAILERS, msg.sender), "Restricted to Retailers.");
        _;
    }

    function addRetailer(address account) public virtual onlyManager {
        grantRole(RETAILERS, account);
    }

    function removeRetailer(address account) public virtual onlyManager {
        revokeRole(RETAILERS, account);
    }

    function addManager(address account) public virtual onlyOwner {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }

    function renounceManager() public virtual {
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address _to, string memory uri) public onlyRetailer returns (uint256) {
        uint256 tokenId = totalSupply() + 1;
        creationTime[tokenId] = block.timestamp;
        _mint(_to, tokenId);
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    function repairWarrantyVoid() public onlyRetailer {
        RepairWarranty = false;
    }

    function repairWarrantyNotVoid() public onlyRetailer {
        RepairWarranty = true;
    }

    function hasValidWarranty(address _owner) public view returns (bool) {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) return false;

        uint256 latestTokenId = tokenOfOwnerByIndex(_owner, tokenCount - 1);
        uint256 mintTimestamp = creationTime[latestTokenId];
        uint256 warrantyPeriod = 52 weeks;

        return block.timestamp < mintTimestamp + warrantyPeriod;
    }

    function transfer(address _to, uint256 _tokenId) public {
        require(_exists(_tokenId), "Token does not exist");
        require(hasValidWarranty(msg.sender), "Your Warranty has expired");
        require(_isApprovedOrOwner(msg.sender, _tokenId), "Caller is not the owner or approved to transfer the token");
        _transfer(msg.sender, _to, _tokenId);
    }

    function addRepair(uint256 _tokenId, string memory _description) public onlyRetailer {
        require(_exists(_tokenId), "Token does not exist");
        require(hasValidWarranty(msg.sender), "Your Warranty has expired");
        require(_isApprovedOrOwner(msg.sender, _tokenId) || hasRole(RETAILERS, msg.sender), "Caller is not the owner or approved to update the token");
        repairHistory[_tokenId].push(RepairHistory(block.timestamp, _description));
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
