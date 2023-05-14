import { Contract, utils } from "ethers";
import contracts from "../contracts";

async function fetchNCTBalance(signer) {
  const NCT = new Contract(contracts.NCT.address, contracts.NCT.ABI, signer);
  const nctBalance = await NCT.balanceOf(signer._address);

  return {
    raw: nctBalance,
    formatted: Number(utils.formatEther(nctBalance.toString())),
  };
}

export default fetchNCTBalance;
