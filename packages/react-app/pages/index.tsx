import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Dialog, Transition } from "@headlessui/react";

import { useSigner } from "wagmi";
import React, { Fragment, useEffect, useMemo, useState } from "react";
import { BigNumber, utils } from "ethers";

import fetchNCTBalance from "../actions/fetchNCTBalance";
import approveAndDeposit from "../actions/doApproveAndDeposit";

export default function Home() {
  const { data: signer } = useSigner();
  const walletConnected = !!signer;
  const [poolTokenBalance, setPoolTokenBalance] = useState({
    raw: BigNumber.from(0),
    formatted: 0,
  });

  const [depositTx, setDepositTx] = useState("");
  const [isRetiring, setIsRetiring] = useState(false);
  const [isRetireSuccess, setIsRetireSuccess] = useState(false);
  const [isRetireFail, setIsRetireFail] = useState(false);

  async function doApproveAndDeposit(amount: BigNumber) {
    try {
      setIsRetiring(true);
      const tx = await approveAndDeposit(signer, amount);
      setDepositTx(tx.hash);
      setIsRetireSuccess(true);
    } catch {
      setIsRetireFail(true);
    }
  }

  useEffect(() => {
    if (walletConnected) {
      fetchNCTBalance(signer).then((res) => setPoolTokenBalance(res));
    }
  }, [walletConnected, signer]);

  return (
    <div>
      <RetiringModal
        isOpen={isRetiring}
        closeModal={() => {
          setIsRetiring(false);
          setIsRetireFail(false);
          setIsRetireSuccess(false);
        }}
        retireSuccessful={isRetireSuccess}
        retireFailed={isRetireFail}
        tx={depositTx}
      />
      <header className="max-w-xl text-center mx-auto">
        <h1 className="text-3xl font-bold">
          Retiring carbon credits made easy
        </h1>
        <p className="mt-2 text-slate-700 leading-snug">
          Reduce your carbon footprint and support the planet with Toucan
          Protocol. Carbon Destroyer makes carbon credit retirement easy for a
          positive impact.
        </p>
      </header>
      <main className="flex justify-center items-center mt-8 max-w-xl mx-auto">
        {walletConnected ? (
          <WalletConnectedScreen
            balance={poolTokenBalance}
            retireCarbon={doApproveAndDeposit}
          />
        ) : (
          <WalletNotConnectedScreen />
        )}
      </main>

      <FAQ />
    </div>
  );
}

const WalletConnectedScreen: React.FC<{ balance: any; retireCarbon: any }> = ({
  balance,
  retireCarbon,
}) => {
  const [amount, setAmount] = useState<string>("");

  const retireNotAllowed = useMemo(() => {
    if (amount == "" || amount == "0") return true;
    if (utils.parseEther(amount).gt(balance.raw)) return true;

    return false;
  }, [amount, balance.raw]);

  return (
    <div className="bg-gypsum border-2 max-w-xl  flex flex-col items-center text-center px-4 py-10 rounded-lg flex-1">
      <div>
        <h2 className="text-2xl font-semibold mb-10 w-3/4 mx-auto">
          Retire TCO2 directly through $NCT
        </h2>
      </div>
      <div className="w-5/6">
        <div className="flex">
          <div className="flex-1 relative">
            <input
              type="number"
              min={0}
              placeholder={"0.00 NCT"}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-snow border-2  px-4 py-2 rounded-lg w-full text-lg font-bold"
            />
            <button
              className="text-sm text-gray-500 text-right mt-1 font-semibold underline"
              onClick={() => setAmount(String(balance.formatted))}
            >
              You have {balance.formatted} $NCT
            </button>
          </div>
        </div>
        <button
          className={`shadow inline-flex justify-center rounded-md border-2 border-green-400 bg-green-100 mt-6 px-8 py-4 font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 text-lg`}
          onClick={() =>
            !retireNotAllowed && retireCarbon(utils.parseEther(amount))
          }
        >
          Retire Carbon
        </button>
      </div>
    </div>
  );
};

const WalletNotConnectedScreen = () => {
  return (
    <div className="bg-gypsum border-2 max-w-xl flex flex-col items-center text-center px-4 py-10 rounded-lg">
      <h2 className="text-lg font-semibold mb-4 w-3/4">
        Please connect your wallet to start contributing to the fight against
        climate change
      </h2>
      <ConnectButton />
    </div>
  );
};

const RetiringModal: React.FC<{
  isOpen: boolean;
  closeModal: any;
  retireSuccessful: boolean;
  retireFailed: boolean;
  tx: string;
}> = ({ isOpen, closeModal, retireSuccessful, retireFailed, tx }) => {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  {!retireSuccessful && !retireFailed ? (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Retiring your carbon...
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Retiring carbon is a two-step process. You&apos;ll be
                          prompted for both the transactions on your wallet.
                        </p>
                      </div>

                      <div className="mt-4">
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="w-6 h-6 mr-2 text-gray-200 animate-spin fill-green-400"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    </>
                  ) : retireSuccessful ? (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-success"
                      >
                        Your carbon has been retired!
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Congratulations in playing your part in the battle
                          against climate change! You should be proud to be an
                          eco warrior.
                        </p>
                        {tx.length > 0 && (
                          <p className="mt-2">
                            <a
                              className="text-success underline text-sm font-bold"
                              href={`https://celoscan.io/tx/${tx}`}
                              target="_blank"
                            >
                              View transaction here
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="mt-8">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Got it, thanks!
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-error"
                      >
                        Your didn&apos;t retire carbon 😔
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Congratulations in playing your part in the battle
                          against climate change! You should be proud to be an
                          eco warrior.
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Try Again
                        </button>
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const FAQ = () => {
  return (
    <div className="max-w-xl mx-auto mt-16">
      <h2 className="text-xl font-bold text-center">
        Frequently Asked Questions
      </h2>

      <div className="mt-8 space-y-6">
        <div className="mt-4">
          <h4 className="font-semibold">How does Carbon Destroyer work?</h4>
          <p>
            Carbon Destroyer is powered by Toucan Protocol. Toucan is a DeFi
            Protocol focused on tokenizing real-world carbon credits. We
            leverage Toucan&apos;s infra to redeem credits from $NCT and retire
            all the credits.
          </p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">What is $NCT?</h4>
          <p>
            NCT stands for Nature Carbon Tonne. Is is a Carbon Pool Token by
            Toucan Protocol. NCT is a pool of carbon credits that qualify the
            criteria to be included in the Nature Carbon Tonne pool.
          </p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">How to get $NCT?</h4>
          <p>
            You can{" "}
            <a
              href="https://app.ubeswap.org/#/swap"
              target="_blank"
              className="text-green-600 underline"
            >
              buy $NCT on Ubeswap
            </a>{" "}
            using whichever token you prefer. It&apos;s a normal ERC-20, hence,
            can be traded on decentralised exchanges.
          </p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Why retire carbon credits?</h4>
          <p>
            Retiring carbon credits helps you offset your own carbon footprint,
            support projects that are working to protect the environment, and
            help create a more sustainable future 🌍
          </p>
        </div>
      </div>
    </div>
  );
};
