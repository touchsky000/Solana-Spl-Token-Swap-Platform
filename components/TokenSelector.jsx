import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa6";
import Image from "next/image";
import { networks, swapList } from "@/constant";


const TokenSelector = ({ type, selectedToken, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-w-[140px] w-[180px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-12 px-5 border rounded-lg bg-textWhiteButton border-borderHeader hover:bg-opacity-90"
      >
        <div className="flex items-center gap-2">
          <Image
            src={`/${selectedToken}.png`}
            alt={`${selectedToken}`}
            width={24}
            height={24}
            className="w-6 h-6"
          />
          <span className="text-base font-semibold tracking-wide text-textMain">{selectedToken}</span>
        </div>
        <FaChevronDown size={20} color="white" className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-black border rounded-lg border-borderHeader">
          {type === 'networks' ? networks.map(({ name }) => (
            <button
              key={name}
              onClick={() => {
                onSelect(name);
                setIsOpen(false);
              }}
              className="flex items-center w-full gap-2 px-5 py-3 hover:bg-borderHeader hover:rounded-lg"
            >
              <Image
                src={`/${name}.png`}
                alt={`${name}`}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-semibold text-textFooterTitle">{name}</span>
            </button>
          )) : swapList.map(({ name }) => (
            <button
              key={name}
              onClick={() => {
                onSelect(name);
                setIsOpen(false);
              }}
              className="flex items-center w-full gap-2 px-5 py-3 hover:bg-borderHeader hover:rounded-lg"
            >
              <Image
                src={`/${name}.png`}
                alt={`${name}`}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="font-semibold text-textFooterTitle">{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default TokenSelector