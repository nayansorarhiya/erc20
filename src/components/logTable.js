import React from 'react';
import { ethers } from 'ethers';

function LogTable() {

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const filter = async() => {
        const address = await signer.getAddress();
        const filterId = await provider.getLogs("0xc6CcDD9616894D89DeD137aCd0BEb67b689E6d50");
        console.log(filterId);
    }

    return (
        <div onClick={filter}>LogTable</div>
    )
}
export default LogTable;