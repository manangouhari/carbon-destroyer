import { Contract, utils } from "ethers";
import contracts from "../contracts";

async function approveAndDeposit(signer, amount) {
  console.log(`RETIRING ${amount.toString} NCT`);
  const NCT = new Contract(contracts.NCT.address, contracts.NCT.ABI, signer);
  const CarbonDestroyer = new Contract(
    contracts.CarbonDestroyer.address,
    contracts.CarbonDestroyer.ABI,
    signer
  );

  /* 
    Step 1: Approve NCT to be used with CarbonDestroyer.
    Step 2: Wait for NCT to get approved. 
    Step 3: Retire and redeem using CarbonDestroyer.
    Step 4: Wait for redeem and retire.
  */

  console.log("Waiting for approval sign");
  let tx = await NCT.approve(contracts.CarbonDestroyer.address, amount);
  await tx.wait();
  console.log("NCT approved");
  console.log("tx:", tx);

  console.log("Waiting for destroy carbon sign");
  tx = await CarbonDestroyer.destroyCarbon(amount);
  await tx.wait();
  console.log("carbon destoryed");
  console.log("tx:", tx);
  return tx;
}

export default approveAndDeposit;
