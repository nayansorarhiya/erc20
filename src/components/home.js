import React from "react";
import Box from '@material-ui/core/Box/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { ethers } from "ethers";
import TabButton,{CommonInput} from "./common";
import { walletConnect } from "./walletConnect";
import { getERC20Contract } from '../contract/erc20contract';


function Home() {

    walletConnect();
    const [values, setValues] = React.useState({
        amount: '',
        toAddress: '',
        fromAddress: ''
    });
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };


    const [option, setOption] = React.useState(0);
    const handleChangeOption = (event, newValue) => {
        event.preventDefault();
        setOption(newValue);
    };

    const [callFunctions, setCallFunction] = React.useState({
        decimals: 0,
        nameContract: '',
        symbol: '',
    });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = getERC20Contract(provider.getSigner());
    async function initialValues() {
        setCallFunction({
            ...callFunctions,
            decimals: (await contract.decimals()),
            nameContract: await contract.name(),
            symbol: await contract.symbol(),
        });
    }
    initialValues();

    async function contractCall() {
        switch (option) {
            case 0:
                await contract.approve(values.toAddress, ethers.utils.parseUnits(values.amount, 18));
                break;
            case 1:
                await contract.decreaseAllowance(values.toAddress, ethers.utils.parseUnits(values.amount, 18));
                break;
            case 2:
                await contract.increaseAllowance(values.toAddress, ethers.utils.parseUnits(values.amount, 18));
                break;
            case 3:
                await contract.transfer(values.toAddress, ethers.utils.parseUnits(values.amount, 18));
                break;
            case 4:
                await contract.transferFrom(values.fromAddress, values.toAddress, ethers.utils.parseUnits(values.amount, 18));
                break;
            case 5:
                const allowanceValue = await contract.allowance(values.fromAddress, values.toAddress);
                alert(allowanceValue / 1000000000000000000);
                break;
            case 6:
                const balanceof = await contract.balanceOf(values.toAddress);
                setCallFunction((balanceof / 1000000000000000000));
                break;
            default:
                alert('Option is not selected');
        }
    }
    // let balanceof ;
    // async function callBalance(){
    //     balanceof = await contract.balanceOf(provider.getSigner().getAddress());
    //     return balanceof;
        
    // }
    return (<>
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 5, alignItems: 'center' }}>

            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabButton value={option} handleChange={handleChangeOption}></TabButton>
                </Box>

            </Box>
            <Box sx={{ display: 'block', width: '100%' }}>
            <CommonInput value={values.fromAddress} label='Owner' tag='From' function={handleChange('fromAddress')} />
            <CommonInput value={values.toAddress} label='spender' tag='To' function={handleChange('toAddress')} />
            <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} function={handleChange('amount')} />
                

            </Box>
            <Box sx={{ mt: 2 }}>
                <Button variant="contained" onClick={contractCall}>Confirm</Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Box>Decimals: {callFunctions.decimals}</Box>
                <Box>Name:{callFunctions.nameContract}</Box>
                <Box>Symbol:{callFunctions.symbol}</Box>
            </Box>
        </Container>
    </>);
}
export default Home;