import { ethers } from "ethers";

export const walletConnect = async () => {
    const reqChainId = "0x539";
    if (window.ethereum) {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== reqChainId) {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: reqChainId }] });
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const signer = provider.getSigner();

    }
    else {
        alert("Metamask is not Installed");
    }
    

}