'use client'

import { useState } from "react";
import { HiMenuAlt4 } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 bg-bgHeader border-b border-borderHeader w-full px-4 sm:px-10 lg:px-[78px] z-50 backdrop-blur-[200px]">
      <div className="w-full h-full flex justify-between items-center py-3">
        <Link href="/">
          <Image
            src="/logo.svg"
            width={114}
            height={38}
            alt="Logo"
            className="h-[38px] w-auto cursor-pointer"
          />
        </Link>
        <div className="text-textHeader hidden gap-6 text-base lg:flex">
          <button className="">AI Agents &#8226;</button>
          <button className="">Trading &#8226;</button>
          <button className="">Investment &#8226;</button>
          <button className="">Market Data &#8226;</button>
        </div>
        <div className="hidden lg:block">
          <button
            className="glass-button h-[46px] w-[170px] text-textButton flex items-center justify-center shadow-lg backdrop-blur-md overflow-hidden hover:scale-105 bg-bgButton border-[0.5px] border-borderButton cursor-pointer rounded-lg transition-transform duration-200 ease-in-out"
          >
            <span>Stake&nbsp;</span>
            <span className="font-bold">DIPHIGH</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="text-textHeader p-2 cursor-pointer lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <IoMdClose size={24} /> : <HiMenuAlt4 size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'} origin-top lg:hidden z-50 absolute top-[70px] max-sm:left-0 sm:right-10 sm:max-w-[300px] w-full bg-textWhiteButton border rounded-lg border-borderHeader shadow-lg p-4 transform transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col px-4 space-y-4">
          <p className="text-textHeader py-2 text-center">AI Agents</p>
          <p className="text-textHeader py-2 text-center">Trading</p>
          <p className="text-textHeader py-2 text-center">Investment</p>
          <p className="text-textHeader py-2 text-center">Market Data</p>
          <hr className="text-borderHeader" />
          <button className="glass-button h-[46px] w-full text-textButton flex items-center justify-center shadow-lg backdrop-blur-md overflow-hidden hover:scale-105 bg-bgButton border-[0.5px] border-borderButton cursor-pointer rounded-lg transition-transform duration-200 ease-in-out">
            <span>Stake&nbsp;</span>
            <span className="font-bold">DIPHIGH</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header