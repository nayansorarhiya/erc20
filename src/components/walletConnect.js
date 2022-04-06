

import { ethers } from "ethers";
export const walletConnect = async () => {
    const reqChainId = "0x539";
    if (window.ethereum) {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId != reqChainId) {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: reqChainId }] });
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // await provider.send("eth_requestAccounts", []);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
    }
    else {
        alert("Metamask is not Installed");
    }


}