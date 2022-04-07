import erc20abi from './erc20abi.json';
import {ethers} from 'ethers';

export const  getERC20Contract = (contractAddress,signer) => {
        return  new ethers.Contract(contractAddress, erc20abi, signer);
}