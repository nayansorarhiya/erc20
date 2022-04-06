
import erc20abi from './erc20abi.json';
import {ethers} from 'ethers';

export const  getERC20Contract = (signer) => {
        return  new ethers.Contract("0x318Eb2A8a69bDA702195E70D0088Cf23CeBAC1d9", erc20abi, signer);
}