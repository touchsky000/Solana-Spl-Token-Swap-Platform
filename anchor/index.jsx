"use client"
import axios from "axios"
import {
    Keypair,
    Connection,
    Transaction,
    ComputeBudgetProgram,
    LAMPORTS_PER_SOL,
    VersionedTransaction
} from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import dotenv from 'dotenv';
import bs58 from 'bs58';
import { swapList } from "../constant/index"
dotenv.config()

export const createProvider = (wallet, connection) => {
    const provider = new anchor.AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });
    anchor.setProvider(provider);
    return provider;
}

export const createTransaction = () => {
    const transaction = new Transaction();
    transaction.add(
        ComputeBudgetProgram.setComputeUnitLimit({
            units: 200000
        })
    );
    return transaction;
}

export const rpc_connection = () => {
    const newConnection = new Connection(
        `https://mainnet.helius-rpc.com/?api-key=${process.env.NEXT_PUBLIC_HELIUS_RPC_URL_KEY}`,
        "confirmed"
    )
    return newConnection
};

const getResponse = async (
    tokenA,
    tokenB,
    amount,
    slippageBps,
    anchorWallet
) => {
    const response = await axios.get(
        `https://quote-api.jup.ag/v6/quote?inputMint=${tokenA}&outputMint=${tokenB}&amount=${amount}&slippageBps=${slippageBps}`
    );
    const quoteResponse = response.data;
    const swapResponse = await axios.post(`https://quote-api.jup.ag/v6/swap`, {
        quoteResponse,
        userPublicKey: anchorWallet.publicKey.toString(),
        wrapAndUnwrapSol: true,
        dynamicComputeUnitLimit: true, // allow dynamic compute limit instead of max 1,400,000
        prioritizationFeeLamports: 200000, // or custom lamports: 1000
    });
    return swapResponse.data;
};

const executeTransaction = async (
    connection,
    swapTransaction,
    anchorWallet,
) => {
    if (!anchorWallet || !anchorWallet.publicKey) {
        throw new Error('Invalid anchorWallet: keypair is undefined');
    }

    const swapTransactionBuf = Buffer.from(swapTransaction, "base64");
    const latestBlockHash = await connection.getLatestBlockhash();
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf);

    // transaction.sign([anchorWallet.keypair]);
    transaction = await anchorWallet.signTransaction(transaction)

    // Execute the transaction
    const rawTransaction = transaction.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight: false,
        maxRetries: 5,
    });

    const signature = await connection.confirmTransaction({
        blockhash: latestBlockHash.blockhash,
        lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
        signature: txid,
    });

    return {
        confirm: true,
        signature: txid,
    };
}

export const getBalance = async () => {
    const connection = rpc_connection();
    const walletInstance = await loadwallet();
    const balance = await connection.getBalance(walletInstance.publicKey);
    console.log("balance =>", balance / LAMPORTS_PER_SOL, "SOL");
};

export const swap = async (
    tokenA,
    tokenB,
    fixamount,
    slippage,
    wallet
) => {
    const anchorWallet = wallet;
    const connection = rpc_connection();
    let slippageBps = slippage;
    let success = false;
    const amount = fixamount * LAMPORTS_PER_SOL

    console.log(`Swapping ${amount} of ${tokenA} for ${tokenB}...`);
    // Get Route for swap
    let confirm = false;
    let signature;
    let txid;
    const { swapTransaction } = await getResponse(
        tokenA,
        tokenB,
        amount,
        slippageBps,
        anchorWallet
    );
    // deserialize the transaction
    const result = await executeTransaction(
        connection,
        swapTransaction,
        anchorWallet
    );
    // console.log("result", result);
    confirm = result.confirm;
    txid = result.signature;

    success = confirm;
    if (success == true) {
        console.log(`Swap successful!\n${anchorWallet.publicKey.toBase58()}`);
        console.log(`https://solscan.io/tx/${txid}`);
    }
    return txid
}

export const getMintAddress = (tokenId) => {
    return swapList.find(item => item.id == tokenId)?.address
}