import React, { useState } from "react";
import Box from '@material-ui/core/Box/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

import { ethers } from "ethers";
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

    const [values, setValues] = useState({
        amount: '',
        toAddress: '',
        fromAddress: ''
    });
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const [option, setOption] = useState(0);
    const handleChangeOption = (event, newValue) => {
        setOption(newValue);
    };



    console.log('hello');


    const [callFunctions, setCallFunction] = useState({
        decimals: 0,
        nameContract: '',
        symbol: '',
        supply: ''
    });
    const [wallet, setConnection] = useState(
        {
            text: "Connect",
            address: '0x',
            balance: '0'
        });

    const initialValues = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = getERC20Contract(provider.getSigner());
        setCallFunction({
            ...callFunctions,
            decimals: (await contract.decimals()),
            nameContract: await contract.name(),
            symbol: await contract.symbol(),
            supply: ethers.utils.parseUnits((await contract.totalSupply()).toString(), (await contract.decimals())).toString(),
        });
    }

    const setWallet = async () => {
        walletConnect();
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getERC20Contract(provider.getSigner());
            const signer = provider.getSigner();
            const balance = ethers.utils.parseUnits((await contract.balanceOf(signer.getAddress())).toString(), callFunctions.decimals).toString();
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
    walletConnect();
    if (window.ethereum) {
        window.onload = function () {
            initialValues();
            setWallet();
        };
    }


    async function contractCall() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getERC20Contract(provider.getSigner());
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
                    alert(balanceof / 1000000000000000000);
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

            <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, alignItems: 'center' }}>
                    <Box>Address : {wallet.address}</Box>
                    <Box>Balance : {wallet.balance}</Box>
                    <Box>
                        <Button variant="contained" onClick={setWallet} >{wallet.text}</Button>
                    </Box>

                </Box>
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
            <Box sx={{ display: 'block', width: '100%' }}>



            </Box>

            <Box sx={{ p: 3 }}>
                <Button variant="contained" onClick={contractCall}>Confirm</Button>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Decimals:</Box> <Box>{callFunctions.decimals}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Name:</Box><Box>{callFunctions.nameContract}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Symbol:</Box><Box>{callFunctions.symbol}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Total Supply:</Box><Box>{callFunctions.supply}</Box></Box>
            </Box>
        </Container>
    </>);
}
export default Home;