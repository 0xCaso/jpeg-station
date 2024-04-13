import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"
import { Wallet } from "./services/near-wallet";
import { EthereumView } from "./components/Ethereum";
import { BitcoinView } from "./components/Bitcoin";

import ethSvg from "/eth-logo.svg"
import btcSvg from "/btc-logo.svg"
import arrowsSvg from "/arrows.svg"
import miladyPng from "/milady.png"
import puppetPng from "/puppet.png"

// CONSTANTS
const MPC_CONTRACT = 'multichain-testnet-2.testnet';

const OUR_CONTRACT_ID = 'cagnazz2.testnet';

// NEAR WALLET
const wallet = new Wallet({ network: 'testnet', createAccessKeyFor: MPC_CONTRACT });

  // type Order = {
  //   id: number;

  //   owner: string; // Lisa NEAR-ETH account
  //   accepter: string; // Bart NEAR-BTC account
  
  //   ownerAssetType: string;
  //   ownerAssetId: string;
  //   ownerAssetCollectionName: string;

  //   accepterAssetType: string;
  //   accepterAssetId: string;
  //   accepterAssetCollectionName: string;
  // };

function App() {
  // const queryParams = new URLSearchParams(window.location.search);
  // const txHashes = queryParams.get("transactionHashes");
  // console.log("queryParams", txHashes);

  const [selectedOrder, setSelectedOrder] = useState(); // [order: Order]
  const [swapType, setSwapType] = useState(true); // [true == "eth-2-btc", false == "btc-2-eth"]
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [status, setStatus] = useState("Please login to request a signature");
  const [chain, setChain] = useState('eth');
  const [ordersList, setOrdersList] = useState([]);

  useEffect(() => {
    const initFunction = async () => {
      const isSignedIn = await wallet.startUp();
      setIsSignedIn(isSignedIn);
      await getContractOrders();
    }

    initFunction();
  }, []);

  const onAcceptOrder = (order) => {
    console.log("Accepting order...");
    setSelectedOrder(order);
  } 

  const onSubmit = async (e) => {
    e.preventDefault();

    console.log("Creating order...");
    const createOrder = await wallet.callMethod({ contractId: OUR_CONTRACT_ID, method: "createOrder", args: {
      ownerAssetType: swapType ? "NFT" : "Ordinal",
      ownerAssetId: selectedOrder.ownerAssetId,
      ownerAssetCollectionName: selectedOrder.ownerAssetCollectionName,
      accepterAssetType: swapType ? "Ordinal" : "NFT",
      accepterAssetId: selectedOrder.accepterAssetId,
      accepterAssetCollectionName: selectedOrder.accepterAssetCollectionName,
    }});
    console.log("result call", createOrder);

    await getContractOrders();
    
  }

  const onChangeOrder = (field, value) => {
    setSelectedOrder(selectedOrder => ({
      ...selectedOrder,
      [field]: value
    }));
  }

  const getContractOrders = async () => {
    console.log("Getting orders...");
    const newOrdersList = await wallet.viewMethod({ contractId: OUR_CONTRACT_ID, method: "getOrders", args: {}});
    console.log("orders: ", newOrdersList);
    setOrdersList(newOrdersList);
  }

  return (
    <>
      <Navbar wallet={wallet} isSignedIn={isSignedIn}></Navbar>

      <div className="container-fluid mt-5 px-4">
        <div className="row">
          {/* <!-- List of orders --> */}
          <div className="col-6">
            <h4 className="h4">Orders</h4>
            <div className="overflow-auto" style={{maxHeight: "80vh"}}>
              {ordersList ? ordersList.map((order, index) => (
                <div className="card" key={order.id+index}>
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h5 className="card-title"><i className="fs-6">{order.owner}</i> has</h5>
                      </div>
                      <div className="col"></div>
                      <div className="col">
                        <h5 className="card-title">Wants</h5>
                      </div>
                      <div className="row align-middle">
                        <div className="col text-center">
                          <img src={order.ownerAssetType === "NFT" ? ethSvg : btcSvg} alt="Ethereum" className="mb-2" style={{ width: "24px"}} />
                        </div>
                        <div className="col text-center"></div>
                        <div className="col text-center">
                          <img src={order.accepterAssetType === "NFT" ? ethSvg : btcSvg} alt="Bitcoin" className="mb-2" style={{width: "24px"}} />
                        </div>
                      </div>
                      <div className="row align-middle">
                        <div className="col text-center">
                          <img src={order.ownerAssetType ==="NFT" ? miladyPng : puppetPng} alt="NFT input image" className="card-img-top mb-2" style={{maxWidth: "100px"}} />
                        </div>
                        <div className="col text-center align-middle">
                          <img src={arrowsSvg} alt="Swap arrows img" style={{ width: "50px" }} className="align-middle" />
                        </div>
                        <div className="col text-center">
                          <img src={order.accepterAssetType ==="NFT" ? miladyPng : puppetPng} alt="NFT input image" className="card-img-top mb-2" style={{maxWidth: "100px"}} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col text-center">
                          <p className="card-text">{order.ownerAssetCollectionName}</p>
                        </div>
                        <div className="col text-center">
                          <button className="btn btn-primary" onClick={() => onAcceptOrder(order)}>
                            Accept
                          </button>
                        </div>
                        <div className="col text-right">
                          <p className="card-text">{order.accepterAssetCollectionName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
          {/* <!-- Create Order form --> */}
          <div className="col-6">
            <h4 className="h4">Create Order</h4>
            <form className="" onSubmit={onSubmit}>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" onChange={() => setSwapType(s => !s)} />
                <label className="form-check-label" htmlFor="switchCheckChecked">
                  <b>{swapType ? "ETH x BTC: " : "BTC x ETH: "}</b>
                  {swapType ? "Exchange NFT (eth) for Ordinal (btc)" : "Exchange Ordinal (btc) for NFT (eth)"}
                </label>
              </div>
              <div className="mt-4">
                <b className="mt-4">{swapType ? "NFT" : "Ordinal"}</b>
                <div className="input-group input-group-sm">
                  <span className="input-group-text" id="inputCollectionId">
                    Input{swapType ? " NFT " : " Ordinal "}ID
                  </span>
                  <input
                    type="text" name="inputCollectionId" className="form-control" aria-describedby="inputCollectionId"
                    defaultValue={selectedOrder ? selectedOrder.ownerAssetId : ""}
                    onChange={e => onChangeOrder("ownerAssetId", e.target.value)}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                  <span className="input-group-text" id="inputCollectionName">
                    Input{swapType ? " NFT " : " Ordinal "}Name
                  </span>
                  <input
                    type="text" name="inputCollectionName" className="form-control" aria-describedby="inputCollectionName"
                    defaultValue={selectedOrder ? selectedOrder.ownerAssetCollectionName : ""}
                    onChange={e => onChangeOrder("ownerAssetCollectionName", e.target.value)}
                    />
                </div>

                <b className="mt-3">{swapType ? "Ordinal" : "NFT"}</b>
                <div className="input-group input-group-sm">
                  <span className="input-group-text" id="outputCollection">
                    Receive{swapType ? " Ordinal " : " NFT "}ID
                  </span>
                  <input
                    type="text" name="outputCollection" className="form-control" aria-describedby="outputCollection"
                    defaultValue={selectedOrder ? selectedOrder.accepterAssetId : ""}
                    onChange={e => onChangeOrder("accepterAssetId", e.target.value)}
                    />
                </div>
                <div className="input-group input-group-sm mb-3">
                  <span className="input-group-text" id="outputCollection">
                    Receive{swapType ? " Ordinal " : " NFT "}Name
                  </span>
                  <input
                    type="text" name="outputCollection" className="form-control" aria-describedby="outputCollection"
                    defaultValue={selectedOrder ? selectedOrder.accepterAssetCollectionName : ""}
                    onChange={e => onChangeOrder("accepterAssetCollectionName", e.target.value)}
                    />
                </div>

              </div>

              <button type="submit" className="btn btn-primary">Create Order</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container">
        <h4> 🔗 NEAR Multi Chain </h4>
        <p className="small">
          Safely control accounts on other chains through the NEAR MPC service. Learn more in the <a href="https://docs.near.org/abstraction/chain-signatures"> <b>documentation</b></a>.
        </p>

        {isSignedIn &&
          <div style={{ width: '50%', minWidth: '400px' }}>

            <div className="input-group input-group-sm mt-3 mb-3">
              <input className="form-control text-center" type="text" value={`MPC Contract: ${MPC_CONTRACT}`} disabled />
            </div>

            <div className="input-group input-group-sm my-2 mb-4">
              <span className="text-primary input-group-text" id="chain">Chain</span>
              <select className="form-select" aria-describedby="chain" value={chain} onChange={e => setChain(e.target.value)} >
                <option value="eth"> Ξ Ethereum </option>
                <option value="btc"> ₿ BTC </option>
              </select>
            </div>

            {chain === 'eth' && <EthereumView props={{ setStatus, wallet, MPC_CONTRACT }} />}
            {chain === 'btc' && <BitcoinView props={{ setStatus, wallet, MPC_CONTRACT }} />}
          </div>
        }

        <div className="mt-3 small text-center">
          <span> {status} </span>
        </div>
      </div>
    </>
  )
}

export default App
