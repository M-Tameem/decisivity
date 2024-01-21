// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract Decisivity {
    address[] Owners;
    address[] middlePeople;
    address[] Distributors;

    uint ownerType = 0;
    uint middleType = 1;
    uint distriType = 2;
    uint noneType = 50;
    uint256 totalItems;

    constructor() {
        Owners.push(msg.sender);
    }


    event NewItem(address indexed creator, address indexed destination, address currentHolder, address nextHolder, uint256 indexed ItemID, uint256 value, string message, uint256 timestamp, bool complete);

    event updatedItem(uint itemID, bool complete);

    event changedItemHolder(uint itemID, address currentHolder, address nextHolder);


    function getOwners() public view returns (address[] memory) {
        return Owners;
    }

    function getMiddle() public view returns (address[] memory) {
        return middlePeople;
    }

    function getDistri() public view returns (address[] memory) {
        return Distributors;
    }

    function commentItem(uint _itemID, string memory _message) public {        
        if(getHolderType() == ownerType) {
            for (uint n = 0; n < totalItems; n++) {
                if(items[n].itemID == _itemID) {
                    items[n].message = _message;
                  
                    }
            }
        }
    }

    function completeItem(uint _itemID) public {
        if(getHolderType() == ownerType) {
            for (uint n = 0; n < totalItems; n++) {
                if(items[n].itemID == _itemID) {
                    items[n].complete = true;
                    items[n].lastUpdated = block.timestamp;
                    emit updatedItem(n, true);
                }
            }
        }
    }


    function getHolderType() public view returns (uint) {
        for (uint n = 0; n < Owners.length; n++) {
            if(Owners[n] == msg.sender) {
                return ownerType;
                }
        for (uint x = 0; x < middlePeople.length; x++) {
            if(middlePeople[x] == msg.sender) {
                return middleType;
            } }
        for (uint z = 0; z < Distributors.length; z++) {
            if(Distributors[z] == msg.sender) {
                return distriType;
            }
        }
        return noneType;
        }
    }

    
    function addAddress(address _adding, uint _arrayAdd) public {
        for (uint n = 0; n < Owners.length; n++) {
            if(Owners[n] == msg.sender) {
                if(_arrayAdd == ownerType) {
                    Owners.push(_adding);
                }
                if(_arrayAdd == middleType) {
                    middlePeople.push(_adding);
                }
                if(_arrayAdd == distriType) {
                    Distributors.push(_adding);
                }
            }
        }
    }

    struct Item {
        address creator;
        address destination;
        address currentHolder;
        address nextHolder;
        uint itemID;
        uint value;
        string message;
        uint256 lastUpdated;
        uint256 timestamp;
        bool complete;
    }

    Item[] public items;


    function wave(address _destination, address _currentHolder, address _nextHolder, uint _value, string memory _message) public {
        totalItems += 1;
        uint _itemID;
        _itemID = totalItems;
        console.log("%s created a new item w/ description %s", msg.sender, _message);


        items.push(Item(msg.sender, _destination, _currentHolder, _nextHolder, _itemID, _value, _message, block.timestamp, block.timestamp, false));


        emit NewItem(msg.sender, _destination, _currentHolder, _nextHolder, _itemID, _value, _message, block.timestamp, false);
    }


    function updateHolders(address _nextHolder, uint _itemID) public {
        for (uint n = 0; n < totalItems; n++) {
            if(items[n].itemID == _itemID) {
                if(items[n].nextHolder == msg.sender) {
                    items[n].currentHolder = msg.sender;
                    items[n].nextHolder = _nextHolder;
                    items[n].lastUpdated = block.timestamp;
                    emit changedItemHolder(n, msg.sender, _nextHolder);
                } 
            }
        }
    }


    function getAllItems() public view returns (Item[] memory) {
        return items;
    }

    function getTotalItems() public view returns (uint256) {
        console.log("We have %d total items!", totalItems);
        return totalItems;
    }
}