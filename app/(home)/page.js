'use client'

import axios from "axios"
import TokenSelector from "@/components/TokenSelector";
import WalletButton from "@/components/WalletButton";
import { useEffect, useState } from "react";
import { FaArrowRight, FaRegCircleCheck, FaRegCircleXmark, FaSpinner } from "react-icons/fa6";
import { getDecimal, getMintAddress, swap } from "@/anchor";
import { useWallet, useConnection, useAnchorWallet } from "@solana/wallet-adapter-react"
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState('Solana');
  const [selectedBuy, setSelectedBuy] = useState('USDT');
  const [selectedSell, setSelectedSell] = useState('SOL');
  const [sellAmount, setSellAmount] = useState(5);
  const [buyAmount, setBuyAmount] = useState(0);
  const [tolerance, setTolerance] = useState(0.1);
  const [buttonTolerance, setButtonTolerance] = useState(0.1);
  const [customTolerance, setCustomTolerance] = useState('');
  const wallet = useAnchorWallet()

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState();
  const [successText, setSuccessText] = useState("");

  const formatNumber = (number) => {
    if (typeof number !== 'number') {
      return number;
    }
    return number.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 6,
    });
  }

  const handleSwap = async () => {
    if (!wallet) {
      setIsSuccess(false);
      setSuccessText("Wallet not connected");
      setIsModalOpen(true);
      setIsModalVisible(true);
      return;
    }
    setIsLoading(true);
    setIsSuccess(undefined);
    setSuccessText("");
    try {
      const sellTokenAddress = getMintAddress(selectedSell)
      const buyTokenAddress = getMintAddress(selectedBuy)

      if (sellTokenAddress == buyTokenAddress) {
        setBuyAmount(0)
        console.log("Can not estimated")
        setSuccessText("Same tokens selected");
        setIsSuccess(false);
        return
      }

      const amount = parseFloat(sellAmount)
      if (isNaN(amount) || amount <= 0) {
        setSuccessText('Invalid sell amount');
        setIsSuccess(false);
        return;
      }

      const decimal = await getDecimal(sellTokenAddress)
      const tx = await swap(sellTokenAddress, buyTokenAddress, amount, tolerance * 100, decimal, wallet)
      console.log("Tx =>", tx)
      setIsSuccess(true)
      setSuccessText("Swap Successful!")
    } catch (err) {
      setIsSuccess(false)
      setSuccessText("Swap Failed!")
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalVisible(false);
        setTimeout(() => {
          setIsModalOpen(false);
        }, 300)
      }, 3000)
    }
  }

  useEffect(() => {
    const getEstimatedTokenAmount = async () => {
      try {
        const sellTokenAddress = getMintAddress(selectedSell)
        const buyTokenAddress = getMintAddress(selectedBuy)
        const amount = sellAmount
        const sellTokenDecimal = await getDecimal(sellTokenAddress)
        const buyTokenDecimal = await getDecimal(buyTokenAddress)
        if (sellTokenAddress == buyTokenAddress) {
          setBuyAmount("Can not estimated")
          return
        }
        const response = await axios.get(
          `https://quote-api.jup.ag/v6/quote?inputMint=${sellTokenAddress}&outputMint=${buyTokenAddress}&amount=${amount * (10 ** sellTokenDecimal)}&slippageBps=${tolerance * 100}`
        );
        const estimatedAmount = response.data.outAmount / (10 ** buyTokenDecimal)
        setBuyAmount(estimatedAmount)
      } catch (err) {
        setBuyAmount("Can not estimated")
      }
    }

    getEstimatedTokenAmount()
  }, [selectedBuy, selectedSell, sellAmount, tolerance])

  return (
    <main className="flex flex-col items-center mt-[70px] font-display -z-10 mb-[95px]">
      <div className="flex flex-col gap-10 mt-[76px] px-4 sm:px-10 max-w-[640px] lg:max-w-[1134px] w-full relative">
        <div className="flex items-center justify-between">
          <p className="leading-[56px] text-2xl font-medium text-white">Swap</p>
          <div className="flex items-center gap-4">
            <span className="text-xl font-normal max-sm:hidden text-textMain">Network</span>
            <TokenSelector
              type='networks'
              selectedToken={selectedNetwork}
              onSelect={setSelectedNetwork}
            />
          </div>
        </div>
        <div className="border bg-bgHeader border-textHeader rounded-2xl px-10 lg:px-[58px] py-10 lg:py-[67px] flex flex-col gap-[63px] items-stretch">
          <WalletButton />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-[60px] gap-y-10 text-textMain">
            <div className="flex flex-col gap-4">
              <p className="text-lg">Sell</p>
              <div className="relative flex items-center justify-between gap-3">
                <input
                  value={sellAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setSellAmount(value)
                    }
                  }}
                  className="w-full h-12 px-4 overflow-hidden text-base font-semibold bg-black border rounded-lg border-borderHeader text-bgWallet focus:outline-none"
                />
                <TokenSelector
                  type='tokens'
                  selectedToken={selectedSell}
                  onSelect={setSelectedSell}
                />
                <FaArrowRight className="absolute right-1/2 lg:-right-[30px] rotate-90 lg:rotate-0 translate-x-1/2 -bottom-5 lg:bottom-1/2 translate-y-1/2" size={24} color="white" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-lg">Buy</p>
              <div className="flex gap-3">
                <input
                  disabled={true}
                  value={buyAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value)) {
                      setBuyAmount(value)
                    }
                  }}
                  className="w-full h-12 px-4 overflow-hidden text-base font-semibold bg-black border rounded-lg border-borderHeader text-bgWallet focus:outline-none"
                />
                <TokenSelector
                  type='tokens'
                  selectedToken={selectedBuy}
                  onSelect={setSelectedBuy}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-lg">Slippage Tolerance</p>
              <div className="flex justify-between gap-2 max-[560px]:flex-wrap">
                <button
                  className={`border-borderHeader rounded-lg border  min-w-[90px] w-full min-[415px]:w-[90px] h-[48px] text-base font-semibold transition-colors duration-200 ease-in-out ${buttonTolerance === 0.1
                    ? 'bg-bgWallet text-black'
                    : 'bg-black text-bgWallet hover:bg-bgWallet hover:text-black'
                    }`}
                  onClick={() => {
                    setButtonTolerance(0.1);
                    setTolerance(0.1);
                    setCustomTolerance('')
                  }}
                >
                  0.1 %
                </button>
                <button
                  className={`border-borderHeader rounded-lg border min-w-[90px] w-full min-[415px]:w-[90px] h-[48px] text-base font-semibold transition-colors duration-200 ease-in-out ${buttonTolerance === 0.5
                    ? 'bg-bgWallet text-black'
                    : 'bg-black text-bgWallet hover:bg-bgWallet hover:text-black'
                    }`}
                  onClick={() => {
                    setButtonTolerance(0.5)
                    setTolerance(0.5);
                    setCustomTolerance('')
                  }}
                >
                  0.5 %
                </button>
                <button
                  className={`border-borderHeader rounded-lg border min-w-[90px] w-full min-[415px]:w-[90px] h-[48px] text-base font-semibold transition-colors duration-200 ease-in-out ${buttonTolerance === 1.0
                    ? 'bg-bgWallet text-black'
                    : 'bg-black text-bgWallet hover:bg-bgWallet hover:text-black'
                    }`}
                  onClick={() => {
                    setButtonTolerance(1.0);
                    setTolerance(1.0);
                    setCustomTolerance('')
                  }}
                >
                  1.0 %
                </button>
                <div className="relative w-full max-w-[300px]">
                  <input
                    value={customTolerance}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setCustomTolerance(e.target.value);
                        setTolerance(parseFloat(e.target.value));
                      }
                    }}
                    placeholder="Custom"
                    className="w-full h-12 px-4 overflow-hidden text-base font-semibold bg-black border rounded-lg border-borderHeader text-bgWallet focus:outline-none"
                  />
                  <span className="absolute pl-2 -translate-y-1/2 bg-black text-bgWallet right-3 top-1/2">%</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end gap-4">
              <button
                className="w-full border-borderHeader bg-bgWallet rounded-lg border h-[48px] text-base font-semibold text-black transition-colors duration-200 ease-in-out hover:bg-white flex justify-center items-center"
                onClick={async () => {
                  setIsLoading(true);
                  await handleSwap()
                  setIsModalOpen(true);
                  setIsModalVisible(true);
                  setIsLoading(false);
                  setTimeout(() => {
                    setIsModalVisible(false);
                    setTimeout(() => {
                      setIsModalOpen(false);
                    }, 300)
                  }, 3000)
                }}
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Swap'}
              </button>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <div className={`absolute top-0 lg:right-10 right-4 transition-opacity duration-300 ease-in-out ${isModalVisible ? 'opacity-100' : 'opacity-0'
            }`}>
            <div className="bg-black w-[270px] h-[70px] flex items-center justify-between rounded-lg border border-[#777777]/30">
              <div className="w-[68px] h-[68px] bg-bgButton rounded-l-lg flex items-center justify-center">
                {isSuccess ? <FaRegCircleCheck className="text-3xl text-textFooterTitle" />
                  : <FaRegCircleXmark className="text-3xl text-textFooterTitle" />}
              </div>
              <div className="flex-1 text-base font-semibold tracking-wide text-center text-white">
                {successText}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
