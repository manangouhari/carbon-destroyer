import CarbonDestroyerABI from "./ABIs/CarbonDestroyer.json";
import ToucanPoolTokenABI from "./ABIs/ToucanPoolToken.json";

const contracts = {
  NCT: {
    address: "0x02de4766c272abc10bc88c220d214a26960a7e92",
    ABI: ToucanPoolTokenABI,
  },
  CarbonDestroyer: {
    address: "0xe27552C501b1D56F56114200356c7615C576259b",
    ABI: CarbonDestroyerABI,
  },
};

export default contracts;
