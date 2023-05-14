// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IToucanPoolToken.sol";
import "./interfaces/IToucanCarbonOffsets.sol";
import "hardhat/console.sol";

contract CarbonDestroyer {
    using SafeERC20 for IERC20;

    event Retired(address who, address[] tco2s, uint256[] amounts);

    IToucanPoolToken public NCT;

    constructor(IToucanPoolToken _NCTPoolToken) {
        NCT = _NCTPoolToken;
    }

    function destroyCarbon(
        uint256 _amountToDestroy
    ) public returns (address[] memory tco2s, uint256[] memory amounts) {
        require(_amountToDestroy > 0, "ZERO_NOT_ALLOWED");
        // Transfer NCT from the sender to CarbonDestroyer
        IERC20(address(NCT)).safeTransferFrom(
            msg.sender,
            address(this),
            _amountToDestroy
        );

        (
            address[] memory tco2s,
            uint256[] memory amounts
        ) = redeemAndRetireTCO2(_amountToDestroy);

        emit Retired(msg.sender, tco2s, amounts);
    }

    function redeemAndRetireTCO2(
        uint256 _amount
    ) public returns (address[] memory tco2s, uint256[] memory amounts) {
        (tco2s, amounts) = NCT.redeemAuto2(_amount);

        uint256 tco2sLen = tco2s.length;
        for (uint256 index = 0; index < tco2sLen; index++) {
            IToucanCarbonOffsets(tco2s[index]).retire(amounts[index]);
        }
    }
}
