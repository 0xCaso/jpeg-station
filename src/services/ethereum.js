import { Web3 } from "web3"
import { bytesToHex } from '@ethereumjs/util';
import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx';
import { deriveChildPublicKey, najPublicKeyStrToUncompressedHexPoint, uncompressedHexPointToEvmAddress } from '../services/kdf';
import { Common } from '@ethereumjs/common'
import { erc721abi } from "./erc721abi";

export class Ethereum {
  constructor(chain_rpc, chain_id) {
    this.web3 = new Web3(chain_rpc);
    this.chain_id = chain_id;
    this.queryGasPrice();
  }

  async deriveAddress(accountId, derivation_path) {
    const publicKey = await deriveChildPublicKey(najPublicKeyStrToUncompressedHexPoint(), accountId, derivation_path);
    const address = await uncompressedHexPointToEvmAddress(publicKey);
    return { publicKey: Buffer.from(publicKey, 'hex'), address };
  }

  async queryGasPrice() {
    const maxFeePerGas = await this.web3.eth.getGasPrice();
    const maxPriorityFeePerGas = await this.web3.eth.getMaxPriorityFeePerGas();
    return { maxFeePerGas, maxPriorityFeePerGas };
  }

  async getBalance(accountId) {
    const balance = await this.web3.eth.getBalance(accountId)
    const ONE_ETH = 1000000000000000000n;
    return Number(balance * 100n / ONE_ETH) / 100;
  }

  async createPayload(sender) {
    const common = new Common({ chain: this.chain_id });

    // Get the nonce & gas price
    const nonce = await this.web3.eth.getTransactionCount(sender);
    const { maxFeePerGas, maxPriorityFeePerGas } = await this.queryGasPrice();

    const method = "safeTransferFrom"
    const from = "0xedff2fed02aebe0ba1f15b071b8f43b9eac83caf"
    const to = "0x0f7c560fd7014cbbaf7a9c41565d1d8cf718a112"
    const nftId = 4
    const nftContractAddy = "0xAEF7A38B35277B3060321A1A1044CCe53585B59a"

    // I want to encode the function calldata for the ERC721 contract
    const contract = new this.web3.eth.Contract(erc721abi, nftContractAddy);
    const data = contract.methods[method](from, to, nftId).encodeABI();

    console.log("data", data)
    
    // Construct transaction
    const transactionData = {
      nonce,
      gasLimit: 21000,
      maxFeePerGas,
      maxPriorityFeePerGas,
      value: 0,
      chain: this.chain_id,
      to: nftContractAddy,
      data
    };

    // Return the message hash
    const transaction = FeeMarketEIP1559Transaction.fromTxData(transactionData, { common });
    const payload = transaction.getHashedMessageToSign();
    return { transaction, payload };
  }

  async requestSignatureToMPC(wallet, ethPayload) {
    // Ask the MPC to sign the payload
    const payload = Array.from(ethPayload.reverse());
    // contractId is my contract
    // payload will have trasnferFrom
    // path is the derivation path of contract (ETH or BTC account)
    // method will be the function that will call the MPC in my contract
    await wallet.callMethod({
      contractId: "cagnazz5.testnet",
      method: 'mpc_call_transfer_jpeg',
      args: { payload, path: "test", key_version: 0 },
      gas: '250000000000000'
    });
  }

  async buildSignature(wallet, big_r, big_s, transaction, sender) {
    // const [big_r, big_s] = await wallet.getTransactionResult(txHash);
    // console.log("big_r", big_r)
    // console.log("big_s", big_s)

    // reconstruct the signature
    const r = Buffer.from(big_r.substring(2), 'hex');
    const s = Buffer.from(big_s, 'hex');

    const candidates = [0n, 1n].map((v) => transaction.addSignature(v, r, s));
    // log the addresses of candidates
    console.log("candidates", candidates)
    const signature = candidates.find((c) => c.getSenderAddress().toString().toLowerCase() === sender.toLowerCase());

    if (!signature) {
      throw new Error("Signature is null");
    }

    if (signature.getValidationErrors().length > 0) throw new Error("Transaction validation errors");
    if (!signature.verifySignature()) throw new Error("Signature is not valid");

    return signature;
  }

  // This code can be used to actually relay the transaction to the Ethereum network
  async relayTransaction(signedTransaction) {
    const serializedTx = bytesToHex(signedTransaction.serialize());
    const relayed = await this.web3.eth.sendSignedTransaction(serializedTx);
    return relayed.transactionHash
  }
}