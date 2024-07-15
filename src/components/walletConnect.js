// import { ethers } from "ethers";

export const walletConnect = async () => {
    const reqChainId = "0x61";
    if (window.ethereum) {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== reqChainId) {
            try {
                await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: reqChainId }] });
            } catch (switchError) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: reqChainId,
                                    chainName: 'Binance Smart Chain Testnet',
                                    rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                                },
                            ],
                        });
                    } catch (addError) {
                        alert("Chain addition Failed ");
                    }
                }

            }
        }

        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });

    }
    else {
        alert("Metamask is not Installed");
    }


}