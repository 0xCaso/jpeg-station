// Find all our documentation at https://docs.near.org
import { NearBindgen, near, call, assert, NearPromise, PromiseIndex, view } from 'near-sdk-js';

class Order {
  id: number;

  owner: string;
  accepter: string;

  ownerAssetType: "NFT" | "Ordinal";
  ownerAssetId: string;
  ownerAssetCollectionName: string;
  accepterAssetType: "NFT" | "Ordinal";
  accepterAssetId: string;
  accepterAssetCollectionName: string;

  settled: boolean; // if true, it can be finalized
  finalized: boolean; // if true, the order is closed
}

const FIVE_TGAS = BigInt("50000000000000");
const NO_DEPOSIT = BigInt(0);
const NO_ARGS = JSON.stringify({});

@NearBindgen({})
class Escrow {

  constructor() {
    this.ordersCounter = 0;
    this.ordersVector = [];
  }

  ordersCounter: number = 0;
  ordersVector: Array<Order> = [];

  @call({})
  create_order({
    ownerAssetType,
    ownerAssetId,
    ownerAssetCollectionName,
    accepterAssetType,
    accepterAssetId,
    accepterAssetCollectionName,
  }: {
    ownerAssetType: "NFT" | "Ordinal";
    ownerAssetId: string;
    ownerAssetCollectionName: string;
    accepterAssetType: "NFT" | "Ordinal";
    accepterAssetId: string;
    accepterAssetCollectionName: string;
  }): void {
    // HERE THE CONTRACT SHOULD BE ABLE TO CHECK IF THE ASSET
    // HAS BEEN TRANSFERED TO THE CONTRACT DERIVED ADDRESS, TO BE DONE
    const order: Order = {
      id: this.ordersCounter,

      owner: near.predecessorAccountId(),

      accepter: "",

      ownerAssetType,
      ownerAssetId,
      ownerAssetCollectionName,

      accepterAssetType,
      accepterAssetId,
      accepterAssetCollectionName,

      settled: false,
      finalized: false,
    };

    this.ordersVector.push(order);
    this.ordersCounter++;
  }

  @call({})
  accept_order({ orderId }: { orderId: number }): void {
    // HERE THE CONTRACT SHOULD CHECK THAT THE ACCEPTER HAS THE ASSET, TO BE DONE
    assert(
      !this.ordersVector[orderId].finalized,
      "The order must not be finalized"
    );
    assert(
      this.ordersVector[orderId].accepter === "",
      "The order must not be accepted"
    );
    assert(
      this.ordersVector[orderId].owner !== near.predecessorAccountId(),
      "The owner cannot accept the order"
    );
    this.ordersVector[orderId].accepter = near.predecessorAccountId();
    this.ordersVector[orderId].settled = true;
  }

  @call({})
  mpc_call_transfer_jpeg({ payload, path, key_version }: {
    payload: any[],
    path: string,
    key_version: number
  }): NearPromise {
    near.log("payload", payload)
    const argsString = JSON.stringify({ payload, path, key_version })
    near.log("argsString", argsString)
    const promise = NearPromise.new("multichain-testnet-2.testnet")
    .functionCall("sign", argsString, NO_DEPOSIT, FIVE_TGAS)
    .then(
      NearPromise.new(near.currentAccountId())
      .functionCall("mpc_call_transfer_jpeg_callback", NO_ARGS, NO_DEPOSIT, FIVE_TGAS)
    )
    
    return promise.asReturn();
  }

  @call({privateFunction: true})
  mpc_call_transfer_jpeg_callback(): String {
    let {result, success} = promiseResult()

    if (success) {
      return result;
    } else {
      near.log("Promise failed...")
      return ""
    }
  }

  @view({})
  get_orders(): Array<Order> {
    return this.ordersVector;
  }
}

function promiseResult(): {result: string, success: boolean}{
  let result, success;
  
  try{ result = near.promiseResult(0 as PromiseIndex); success = true }
  catch{ result = undefined; success = false }
  
  return {result, success}
}