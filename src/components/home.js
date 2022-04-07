import React, { useEffect, useState } from "react";
import Box from '@material-ui/core/Box/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import {useParams} from 'react-router-dom';

import { ethers, BigNumber, utils } from "ethers";
import TabButton, { CommonInput } from "./common";
import { walletConnect } from "./walletConnect";
import { getERC20Contract } from '../contract/erc20contract';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}


function Home() {

    let { contractAddress } = useParams();

    const [values, setValues] = useState({
        amount: '',
        toAddress: '',
        fromAddress: ''
    });
    const handleChange = (prop) => (event) => {
        event.preventDefault();
        setValues({ ...values, [prop]: event.target.value });
    };

    const [option, setOption] = useState(0);
    const handleChangeOption = (event, newValue) => {
        setOption(newValue);
    };


    const [callFunctions, setCallFunction] = useState({
        decimals: 0,
        nameContract: '',
        symbol: '',
        supply: '0'
    });
    const [wallet, setConnection] = useState(
        {
            text: "Connect",
            address: '0x',
            balance: '0'
        });

    console.log('hello');

    const setWallet = async () => {
        walletConnect();
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getERC20Contract(contractAddress,provider.getSigner());
            const signer = provider.getSigner();
            const balance = BigNumber.from((await contract.balanceOf(signer.getAddress())).toString());
            const address = (await signer.getAddress()).toString();
            setConnection(
                {
                    ...wallet,
                    text: "Connected",
                    address: address,
                    balance: balance,
                }
            );
        }
    }

    const initialValues = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getERC20Contract(contractAddress,provider.getSigner());
            setCallFunction({
                ...callFunctions,
                decimals: (await contract.decimals()),
                nameContract: await contract.name(),
                symbol: await contract.symbol(),
                supply: BigNumber.from(await contract.totalSupply()),
            });

        }
    }

    useEffect(() => {
            initialValues();
            setWallet();
    },[]);



    async function contractCall() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getERC20Contract(contractAddress,provider.getSigner());
            switch (option) {
                case 0:
                    await contract.approve(values.toAddress, ethers.utils.parseUnits(values.amount, callFunctions.decimals));
                    break;
                case 1:
                    await contract.decreaseAllowance(values.toAddress, ethers.utils.parseUnits(values.amount, callFunctions.decimals));
                    break;
                case 2:
                    await contract.increaseAllowance(values.toAddress, ethers.utils.parseUnits(values.amount, callFunctions.decimals));
                    break;
                case 3:
                    await contract.transfer(values.toAddress, ethers.utils.parseUnits(values.amount, callFunctions.decimals));
                    break;
                case 4:
                    await contract.transferFrom(values.fromAddress, values.toAddress, ethers.utils.parseUnits(values.amount, callFunctions.decimals));
                    break;
                case 5:
                    const allowanceValue = await contract.allowance(values.fromAddress, values.toAddress);
                    alert(utils.formatUnits(allowanceValue, callFunctions.decimals));
                    break;
                case 6:
                    const balanceof = await contract.balanceOf(values.toAddress);
                    alert(utils.formatUnits(balanceof, callFunctions.decimals));
                    break;
                default:
                    alert('Option is not selected');
            }
        } catch (err) {
            alert('Something went wrong');
        }
    }

    return (<>
        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'end', m: 3 }}>
                <Button variant="contained" onClick={setWallet} >{wallet.text}</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 3, alignItems: 'center' }}>

                <Box sx={{ whiteSpace: 'normal', overflowX: 'auto', mr: 3 }}>Address : {wallet.address}</Box>
                <Box sx={{ whiteSpace: 'normal', overflowX: 'auto', }}>Balance : {utils.formatUnits(wallet.balance, callFunctions.decimals)}</Box>

            </Box>

            <Box sx={{ width: '100%' }}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabButton value={option} handleChange={handleChangeOption}></TabButton>
                </Box>
                <TabPanel value={option} index={0}>
                    <CommonInput value={values.toAddress} label='spender' tag='To' function={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} function={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={1}>
                    <CommonInput value={values.toAddress} label='spender' tag='To' function={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Decrease Amount' tag={callFunctions.symbol} function={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={2}>
                    <CommonInput value={values.toAddress} label='spender' tag='To' function={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Increase Amount' tag={callFunctions.symbol} function={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={3}>
                    <CommonInput value={values.fromAddress} tag='From' function={handleChange('fromAddress')} />
                    <CommonInput value={values.toAddress} tag='To' function={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} function={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={4}>
                    <CommonInput value={values.fromAddress} label='Owner' tag='From' function={handleChange('fromAddress')} />
                    <CommonInput value={values.toAddress} label='spender' tag='To' function={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} function={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={5}>
                    <CommonInput value={values.fromAddress} label='Owner' tag='From' function={handleChange('fromAddress')} />
                    <CommonInput value={values.toAddress} label='spender' tag='To' function={handleChange('toAddress')} />
                </TabPanel>
                <TabPanel value={option} index={6}>
                    <CommonInput value={values.toAddress} label='Account' tag='Address' function={handleChange('toAddress')} />
                </TabPanel>
            </Box>

            <Box sx={{ p: 3 }}>
                <Button variant="contained" onClick={contractCall}>Confirm</Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Decimals:</Box> <Box>{callFunctions.decimals}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Name:</Box><Box>{callFunctions.nameContract}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Symbol:</Box><Box>{callFunctions.symbol}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Total Supply:</Box><Box>{utils.formatUnits(callFunctions.supply, callFunctions.decimals)}</Box></Box>
            </Box>
        </Container>
    </>);
}
export default Home;