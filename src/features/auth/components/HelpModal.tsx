import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface HelpModalProps {
  children: React.ReactNode;
}

export const HelpModal = ({ children }: HelpModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent
        showCloseButton={false}
        className="bg-white border-0 text-black outline-none rounded-t-[32px] sm:rounded-[32px] rounded-b-none p-4 sm:p-6 top-auto bottom-0 translate-y-0 sm:top-[50%] sm:-translate-y-[50%] data-[state=closed]:slide-out-to-bottom-[48%] data-[state=open]:slide-in-from-bottom-[48%] sm:data-[state=closed]:slide-out-to-bottom-0 w-full max-w-full sm:max-w-lg md:max-w-2xl mb-0 mt-auto sm:my-auto max-h-[85vh] flex flex-col overflow-hidden"
      >
        <div className="w-full max-w-md mx-auto flex flex-col flex-1 min-h-0">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 p-0 m-0 shrink-0">
            {/* Espaciador invisible para centrar el titulo */}
            <div className="invisible size-10 flex-shrink-0" aria-hidden="true" />

            <div className="flex items-center gap-2">
              <HelpCircle className="text-snak-blue-aqua size-[22px]" strokeWidth={2.5} />
              <DialogTitle className="text-[1.3rem] font-heading font-bold uppercase tracking-widest text-[#0b0416] mt-0.5">
                Help
              </DialogTitle>
            </div>

            <DialogClose asChild>
              <button type="button" className="size-10 rounded-full bg-[#fcecf5] flex items-center justify-center hover:opacity-80 transition-opacity flex-shrink-0">
                <X className="text-snak-pink size-5" strokeWidth={2.5} />
              </button>
            </DialogClose>
          </DialogHeader>

          {/* Accordion List (Scrollable Content) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar pt-6 pb-6 pr-2 -mr-2 min-h-[100px]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-b border-[#f2e6f4] py-1">
                <AccordionTrigger className="text-snak-pink hover:text-snak-pink/80 hover:no-underline font-medium text-[15px] text-left [&>svg]:text-snak-pink [&>svg]:size-5">
                  What is a wallet?
                </AccordionTrigger>
                <AccordionContent className="text-[#3b3245] leading-relaxed text-[14px] pt-2 pb-4">
                  Crypto wallets keep your private keys — the passwords that give you access to your cryptocurrencies — safe and accessible, allowing you to send and receive cryptocurrencies like Bitcoin and Ethereum. They come in many forms, from hardware wallets like Ledger (which looks like a USB stick) to mobile apps like Coinbase Wallet, which makes using crypto as easy as shopping with a credit card online.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border-b border-[#f2e6f4] py-1">
                <AccordionTrigger className="text-snak-pink hover:text-snak-pink/80 hover:no-underline font-medium text-[15px] text-left [&>svg]:text-snak-pink [&>svg]:size-5">
                  Why do I need a wallet?
                </AccordionTrigger>
                <AccordionContent className="text-[#3b3245] leading-relaxed text-[14px] pt-2 pb-4">
                  Because it gives you control over your own funds.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border-b border-[#f2e6f4] py-1">
                <AccordionTrigger className="text-snak-pink hover:text-snak-pink/80 hover:no-underline font-medium text-[15px] text-left [&>svg]:text-snak-pink [&>svg]:size-5">
                  Why use a third party wallet?
                </AccordionTrigger>
                <AccordionContent className="text-[#3b3245] leading-relaxed text-[14px] pt-2 pb-4">
                  Third party wallets offer a better experience and features.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border-b border-[#f2e6f4] py-1">
                <AccordionTrigger className="text-snak-pink hover:text-snak-pink/80 hover:no-underline font-medium text-[15px] text-left [&>svg]:text-snak-pink [&>svg]:size-5">
                  Can I use this app without a wallet?
                </AccordionTrigger>
                <AccordionContent className="text-[#3b3245] leading-relaxed text-[14px] pt-2 pb-4">
                  You can browse, but you will need a wallet to transact.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <DialogFooter className="flex flex-row justify-between border-0 p-0 m-0 pt-4 bg-white gap-4 w-full mx-auto shrink-0 z-10 border-t border-[#f2e6f4]">
            <Button className="flex-1 h-12 sm:h-14 bg-snak-pink text-white font-bold font-heading tracking-widest uppercase rounded-full hover:bg-snak-pink/90 text-[13px] sm:text-sm">
              Contact us
            </Button>
            <Button className="flex-1 h-12 sm:h-14 bg-snak-pink text-white font-bold font-heading tracking-widest uppercase rounded-full hover:bg-snak-pink/90 text-[13px] sm:text-sm">
              About Snak
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
