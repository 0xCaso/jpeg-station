import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Wallet } from "./services/near-wallet";
import { EthereumView } from "./components/Ethereum";
import { BitcoinView } from "./components/Bitcoin";

import ethSvg from "/eth-logo.svg"
import btcSvg from "/btc-logo.svg"
import arrowsSvg from "/transfer.png"
import miladyPng from "/milady.png"
import puppetPng from "/puppet.png"

// CONSTANTS
const MPC_CONTRACT = 'multichain-testnet-2.testnet';

const OUR_CONTRACT_ID = 'cagnazz6.testnet';

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

    if (!selectedOrder || !selectedOrder.ownerAssetId || !selectedOrder.ownerAssetCollectionName || !selectedOrder.accepterAssetId || !selectedOrder.accepterAssetCollectionName) {
      console.error("createOrder: missing fields");
      return;
    }

    console.log("Creating order...");
    const createOrder = await wallet.callMethod({ contractId: OUR_CONTRACT_ID, method: "create_order", args: {
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
    const newOrdersList = await wallet.viewMethod({ contractId: OUR_CONTRACT_ID, method: "get_orders", args: {}});
    console.log("orders: ", newOrdersList);
    setOrdersList(newOrdersList);
  }

  return (
    <>
      <Navbar wallet={wallet} isSignedIn={isSignedIn}></Navbar>

      <div className="container-fluid py-8 px-4" style={{backgroundColor: "#C7FF02", minHeight: "50vh"}}>
        <div className="row align-items-center">
          <div className="col-6 text-center text-black h-fit">
            <h1 style={{fontFamily: "Space Grotesk Variable", fontSize: "4.5rem" }}>
              <b>JPEG</b> station
            </h1>
            <p style={{fontFamily: "Space Grotesk Variable", fontSize: "2rem" }}>Cross-chain swaps<br/> between NFTs and Ordinals</p>
          </div>
          <div className="col-6 text-center">
            <img src="/landing-img.png" alt="JPEG station" style={{maxWidth: "50%"}} />
          </div>
        </div>
      </div>

      <div className="container-sm my-5 px-4">
        <div className="row">
          {/* <!-- List of orders --> */}
          <div className="col-6 bg-black" style={{ padding: "2em" }}>
            <h4 className="h4" style={{fontFamily: "Space Grotesk Variable", fontSize: "2rem", color: "#F64740" }}>Orders</h4>
            <div className="overflow-auto px-1 " style={{ maxHeight: "80vh", scrollbarColor: "#C7FF02 #324002" }}>
              {ordersList ? ordersList.map((order, index) => (
                <div className="mt-6 card text-white bg-black" key={order.id+index}  style={{ border: "4px solid #C7FF02", borderRadius: "20px" }} >
                  <div className="card-body">
                    <div className="row">
                      <div className="col">
                        <h5 className="card-title"><span style={{ color: "#C7FF02" }}>{order.owner}</span> has</h5>
                      </div>
                      <div className="col text-center">
                      <h5 className="card-title"></h5>
                      </div>
                      <div className="col">
                        <h5 className="card-title" style={{paddingLeft: "40px"}}>wants</h5>
                      </div>
                      <div className="row align-middle text-center">
                        <div className="col text-center">
                          <img src={order.ownerAssetType === "NFT" ? ethSvg : btcSvg} alt="Ethereum" className="mb-2" style={{ width: "24px"}} />
                        </div>
                        <div className="col text-center"></div>
                        <div className="col text-center text-center">
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
                          <button className="btn btn-primary" style={{ backgroundColor: "#F64740", color: "#000", fontWeight: 700, fontSize: "1rem" }} onClick={() => onAcceptOrder(order)}>
                            Accept
                          </button>
                        </div>
                        <div className="col text-right">
                          <p className="card-text" style={{paddingLeft: "27px"}}>{order.accepterAssetCollectionName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : null}
            </div>
          </div>
          {/* <!-- Create Order form --> */}
          <div className="col-6" style={{ padding: "2em" }}>
            <h4 className="h4" style={{fontFamily: "Space Grotesk Variable", fontSize: "2rem", color: "#F64740" }}>Create Order</h4>
            <form className="" onSubmit={onSubmit}>
              <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" role="switch" id="switchCheckChecked" onChange={() => setSwapType(s => !s)} />
                <label className="form-check-label" htmlFor="switchCheckChecked" style={{color: "#fff"}}>
                  <b>{swapType ? "ETH x BTC: " : "BTC x ETH: "}</b>
                  {swapType ? "Exchange NFT (eth) for Ordinal (btc)" : "Exchange Ordinal (btc) for NFT (eth)"}
                </label>
              </div>
              <div className="mt-4">
                <b style={{ color: "#fff"}}>{swapType ? "NFT" : "Ordinal"}</b>
                <div className="input-group input-group-sm" style={{border: "2px solid #C7FF02", borderRadius: "8px", marginTop: "10px", marginBottom: "10px" }}>
                  <span className="input-group-text" id="inputCollectionId" style={{ border: "0px", backgroundColor: "#C7FF02", color: "#000" }}>
                    Input{swapType ? " NFT " : " Ordinal "}ID
                  </span>
                  <input
                    type="text" name="inputCollectionId" className="form-control" aria-describedby="inputCollectionId"
                    style={{ backgroundColor: "#000", color: "#fff"}}
                    defaultValue={selectedOrder ? selectedOrder.ownerAssetId : ""}
                    onChange={e => onChangeOrder("ownerAssetId", e.target.value)}
                    />
                </div>
                <div className="input-group input-group-sm mb-3" style={{border: "2px solid #C7FF02", borderRadius: "8px", marginTop: "10px", marginBottom: "10px" }}>
                  <span className="input-group-text" id="inputCollectionName" style={{ border: "0px", backgroundColor: "#C7FF02", color: "#000" }}>
                    Input{swapType ? " NFT " : " Ordinal "}Name
                  </span>
                  <input
                    type="text" name="inputCollectionName" className="form-control" aria-describedby="inputCollectionName"
                    style={{ backgroundColor: "#000", color: "#fff"}}
                    defaultValue={selectedOrder ? selectedOrder.ownerAssetCollectionName : ""}
                    onChange={e => onChangeOrder("ownerAssetCollectionName", e.target.value)}
                    />
                </div>

                <b className="mt-3" style={{ color: "#fff"}}>{swapType ? "Ordinal" : "NFT"}</b>
                <div className="input-group input-group-sm" style={{border: "2px solid #C7FF02", borderRadius: "8px", marginTop: "10px", marginBottom: "10px" }}>
                  <span className="input-group-text" id="outputCollection" style={{ border: "0px", backgroundColor: "#C7FF02", color: "#000" }}>
                    Receive{swapType ? " Ordinal " : " NFT "}ID
                  </span>
                  <input
                    type="text" name="outputCollection" className="form-control" aria-describedby="outputCollection"
                    style={{ backgroundColor: "#000", color: "#fff"}}
                    defaultValue={selectedOrder ? selectedOrder.accepterAssetId : ""}
                    onChange={e => onChangeOrder("accepterAssetId", e.target.value)}
                    />
                </div>
                <div className="input-group input-group-sm mb-3" style={{border: "2px solid #C7FF02", borderRadius: "8px", marginTop: "10px", marginBottom: "10px" }}>
                  <span className="input-group-text" id="outputCollection" style={{ border: "0px", backgroundColor: "#C7FF02", color: "#000" }}>
                    Receive{swapType ? " Ordinal " : " NFT "}Name
                  </span>
                  <input
                    type="text" name="outputCollection" className="form-control" aria-describedby="outputCollection"
                    style={{ backgroundColor: "#000", color: "#fff"}}
                    defaultValue={selectedOrder ? selectedOrder.accepterAssetCollectionName : ""}
                    onChange={e => onChangeOrder("accepterAssetCollectionName", e.target.value)}
                    />
                </div>

              </div>

              <button type="submit" className="btn btn-primary mt-5"
                style={{ fontWeight: 700, fontSize: "1rem", color: "#000", backgroundColor: "#F64740", border: "3px solid #F64740" }}>Create Order</button>
            </form>
          </div>
        </div>
      </div>

      {!true && (<div className="container">
        <h4> 🔗 NEAR Multi Chain </h4>
        <p className="small">
          Safely control accounts on other chains through the NEAR MPC service. Learn more in the <a href="https://docs.near.org/abstraction/chain-signatures"> <b>documentation</b></a>.
        </p>

        {isSignedIn &&
          <div style={{ width: '50%', minWidth: '400px' }}>

            <div className="input-group input-group-sm mt-3 mb-3">
              <input className="form-control text-center" type="text" value={`MPC Contract: ${MPC_CONTRACT}`} disabled  style={{ backgroundColor: "var(--fg)", color: "#fff" }}/>
            </div>

            <div className="input-group input-group-sm my-2 mb-4">
              <span className="input-group-text" id="chain" style={{ backgroundColor: "var(--fg)", color: "#fff" }}>Chain</span>
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
      </div>)}
      
      <Footer />
    </>
  )
}

export default App
