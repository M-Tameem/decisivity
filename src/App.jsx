import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/decisivity.json';


const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const [userID, setUserID] = useState("");

  /*
   * All state property to store all waves
   */
  const [allItems, setAllItems] = useState([]);
  const contractAddress = "0x60d9ce4A6c65aE03196838c6a96F0748c74D059D";

  /*
  * Create a variable here that references the abi content!
  */
  const contractABI = abi.abi;

  /*
   * Create a method that gets all waves from your contract
   */

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  const getAllItems = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const items = await decisivityContract.getAllItems();


        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let itemsCleaned = [];
        items.forEach(item => {
          itemsCleaned.push({
            creator: item.creator,
            destination: item.destination,
            currentHolder: item.currentHolder,
            nextHolder: item.nextHolder,
            itemID: item.itemID,
            value: item.value,
            message: item.message,
            lastUpdated: new Date(item.lastUpdated * 1000),
            timestamp: new Date(item.timestamp * 1000),
            complete: item.complete
          });
        });

        /*
         * Store our data in React State
         */
        setAllItems(itemsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  //end of new function

  const wave = async (destination, currentHolder, nextHolder, value, message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await decisivityContract.getTotalItems();
        console.log("Retrieved total shipment count...", count.toNumber());

        const waveTxn = await decisivityContract.wave(destination, currentHolder, nextHolder, value, message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await decisivityContract.getTotalItems();
        console.log("Retrieved total shipment count...", count.toNumber());

        count = await decisivityContract.getAllItems();
        getAllItems();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const commentingItem = async (itemID, message) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const commentItemTxn = await decisivityContract.commentItem(itemID, message, { gasLimit: 300000 })

        console.log("Commenting the item...", commentItemTxn.hash);

        await commentItemTxn.wait();
        console.log("Commented!", commentItemTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const completingItem = async (itemID) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const completeItemTxn = await decisivityContract.completeItem(itemID, { gasLimit: 300000 })

        console.log("Completing the item...", completeItemTxn.hash);

        await completeItemTxn.wait();
        console.log("Completed!", completeItemTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const addAddress = async (adding, arrayAdd) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const addAddressTxn = await decisivityContract.addAddress(adding, arrayAdd, { gasLimit: 300000 });

        console.log("Adding the address..", addAddressTxn.hash);

        await addAddressTxn.wait();
        console.log("Added!", addAddressTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  const updateHolder = async (nextHolder, itemID) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);
        const updateTxn = await decisivityContract.updateHolders(nextHolder, itemID, { gasLimit: 300000 });

        console.log("Updating the holder..", updateTxn.hash);

        await updateTxn.wait();
        console.log("Updated!", updateTxn.hash);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const userHolder = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        const userID = await decisivityContract.getHolderType();
        console.log("Getting user type", userID.hash);

        console.log("User type is found: ", userID.toString(), userID.hash);

        setUserID(userID.toString());

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getAddies = async (ownerAccountsList) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);

        // Get the array of values returned from Solidity
        var distri = await decisivityContract.getDistri();

        // Get the array of values returned from Solidity
        var owners = await decisivityContract.getOwners();

        // Get the array of values returned from Solidity
        var middle = await decisivityContract.getMiddle();

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
    getAllItems();
    userHolder();

    let decisivityContract;

    const onNewItem = (destination, currentHolder, nextHolder, value, message) => {
      console.log("NewItem", destination, currentHolder, nextHolder, value, message)
      setAllItems(prevState => [
        ...prevState,
        {
          destination: destination,
          currentHolder: currentHolder,
          nextHolder: nextHolder,
          value: value,
          message: message
        }
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      decisivityContract = new ethers.Contract(contractAddress, contractABI, signer);
      decisivityContract.on("NewItem", onNewItem);
    }

    return () => {
      if (decisivityContract) {
        decisivityContract.off("NewItem", onNewItem);
      }
    };
  }, []);

  return (
    <div><h1>Your userID is {userID}</h1>
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
            <img src="src/logo.png" />
            <div></div>
            Welcome to Decisivity
          </div>

          <div className="spacing"></div>

          <div className="subheader">
            A coherent, end-end donation tracing system
          </div>

          <div className="bio">
            Created by Muhammad-Tameem Mughal
          </div>

          {!currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}

          <div className="spacing"></div>

          {allItems.map((item, index) => {
            return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Creator: {item.creator}</div>
                <div>Destination: {item.destination.toString()}</div>
                <div>Current holder: {item.currentHolder.toString()}</div>
                <div>Next holder: {item.nextHolder.toString()}</div>
                <div>itemID: {item.itemID.toString()}</div>
                <div>Value: {item.value.toString()}</div>
                <div>Comments: {item.message.toString()}</div>
                <div>lastUpdated: {item.lastUpdated.toString()}</div>
                <div>Time: {item.timestamp.toString()}</div>
                <div>Completed: {item.complete.toString()}</div>
              </div>)
          })}
          <div>

            <form onSubmit={(e) => {
              e.preventDefault(); // Prevents your page from reloading

              console.log(e.target.destination.value, e.target.currentHolder.value, e.target.nextHolder.value, e.target.value.value, e.target.message.value)

              wave(e.target.destination.value, e.target.currentHolder.value, e.target.nextHolder.value, e.target.value.value, e.target.message.value)
            }}>

              <div className="spacing"></div>

              <div>
                <div>Create a new shipment</div>
              </div>
              <input type="number" id="value" placeholder="Input the value here"></input>
              <div></div>
              <input type="textarea" id="currentHolder" placeholder="Address of current holder"></input>
              <div></div>
              <input type="text" id="nextHolder" placeholder="Address of next holder"></input>
              <div></div>
              <input type="text" id="message" placeholder="Additional message"></input>
              <div></div>
              <input type="text" id="destination" placeholder="Address of destination"></input>
              <div></div>

              <div>
                <button className="supportButton" type="submit">
                  Add shipment
                </button>
              </div>
            </form>

            <form onSubmit={(e) => {
              e.preventDefault(); // Prevents your page from reloading

              console.log(e.target.address.value, e.target.array.value)

              addAddress(e.target.address.value, e.target.array.value)
            }}>

              <div className="spacing"></div>

              <div>Add an address!</div>
              <input type="text" id="address" placeholder="Address of next holder"></input>
              <div></div>
              <datalist id="array">
                <option value="0">Owner</option>
                <option value="1">Middleman</option>
                <option value="2">Distributor</option>
              </datalist>
              <input id="array" list="array" placeholder="The type of address you'll be adding"></input>
              <div></div>
              <button className="supportButton" type="submit">
                Add address
              </button>
            </form>

            <div class="spacing" />

            <form onSubmit={(e) => {
              e.preventDefault(); // Prevents your page from reloading

              console.log(e.target.itemID.value)

              completingItem(e.target.itemID.value)
            }}>
              <div>Complete Item</div>
              <input type="number" id="itemID" placeholder="Input the value here"></input>
              <div></div>
              <button className="supportButton" type="submit">
                Complete!
              </button>
            </form>

            <div class="spacing" />

            <form onSubmit={(e) => {
              e.preventDefault(); // Prevents your page from reloading

              console.log(e.target.itemID.value, e.target.message.value)
              console.log()

              commentingItem(e.target.itemID.value, e.target.message.value)
            }}>
              <div>Comment an item</div>
              <input type="number" id="itemID" placeholder="the Item's ID"></input>
              <div></div>
              <input type="text" id="message" placeholder="The comment you'd like to add" />
              <div></div>
              <button className="supportButton" type="submit">
                Comment!
              </button>
            </form>

            <div class="spacing" />

            <form onSubmit={(e) => {
              e.preventDefault(); // Prevents your page from reloading

              console.log(e.target.itemID.value, e.target.nextHolder.value)

              updateHolder(e.target.nextHolder.value, e.target.itemID.value)

            }}>
              <div>Update the next holder of a shipment</div>
              <input type="number" id="itemID" placeholder="the itemID" />
              <div></div>
              <input type="text" id="nextHolder" placeholder="The address of the next holder" />
              <div></div>
              <button className="supportButton" type="submit">
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App