'use client'

import { FaDiscord, FaInstagram, FaLinkedin, FaTelegram } from "react-icons/fa6";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {

  return (
    <footer className="fixed bottom-0 left-0 bg-bgHeader border-t border-borderHeader w-full md:px-10 lg:px-[78px] z-50 backdrop-blur-[200px] py-3 h-[64px] flex items-center justify-between px-4">
      <Link href="/">
        <Image
          src='/logo.svg'
          width={114}
          height={38}
          alt="Logo"
          className="h-[30px] w-auto cursor-pointer"
        />
      </Link>
      <div className="flex items-center gap-4">
        <div className="border-textHeader text-textFooterTitle hidden gap-4 pr-4 border-r md:flex">
          <FaLinkedin className="w-[20px] h-[20px]" />
          <FaInstagram className="w-[20px] h-[20px]" />
          <FaTelegram className="w-[20px] h-[20px]" />
          <FaDiscord className="w-[20px] h-[20px]" />
        </div>
        <div className="text-textHeader text-sm text-left">
          Copyright &copy; 2025 DIPHIGH
        </div>
      </div>
    </footer>
  )
}

export default Footer