import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import Box from '@material-ui/core/Box/Box';
import Container from '@mui/material/Container';
import { CommonInput } from "./common";
import { walletConnect } from "./walletConnect";
import { getERC20Contract } from '../contract/erc20contract';
import { providers, ethers } from 'ethers';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
export default function Welcome() {
    const [blockChain, setContract] = useState({
        contract: '',
        chainId: '97'
    });
    const handleContract = (e) => {
        setContract({
            contract: e.target.value
        });
    }
    const navigate = useNavigate();


    const contractValidation = () => {
        walletConnect();

        if (ethers.utils.isAddress(blockChain.contract)) {
            navigate(`/home/${blockChain.contract}`);
        } else {
            alert("Address not found / Enter proper address");
            
        }

    }

    return (<>
        <Container>
            <Box sx={style}>
                <Box sx={{ p: 1 }}>
                    <CommonInput value={blockChain.contract} label='Contract' tag='Address' function={handleContract} />
                </Box>
                <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                    <Button variant="contained" onClick={contractValidation}>Submit</Button>
                </Box>
            </Box>
        </Container>

    </>
    )
}
