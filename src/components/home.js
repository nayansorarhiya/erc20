import React, { useEffect, useState } from "react";
import Box from '@material-ui/core/Box/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';

import { ethers, BigNumber, utils, wait } from "ethers";
import TabButton, { CommonInput } from "./common";
import { walletConnect } from "./walletConnect";
import { getERC20Contract } from '../contract/erc20contract';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';
import LogTable from "./logTable";

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

    const [open, setOpen] = useState(true);
    const handleClose = () => {
        setOpen(false);
    };
    const handleToggle = () => {
        setOpen(!open);
    };

    let { contractAddress } = useParams();

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

    const [callFunctions, setCallFunction] = useState({
        decimals: 0,
        nameContract: '',
        symbol: '',
        supply: '0'
    });
    const [wallet, setConnection] = useState(
        {
            text: "Connect",
            address: '0',
            balance: '0',
            disable: false
        });

    console.log('hello');

    const setWallet = async () => {
        await walletConnect();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = getERC20Contract(contractAddress, provider.getSigner());
        const signer = provider.getSigner();
        const balance = BigNumber.from((await contract.balanceOf(signer.getAddress())));
        const address = (await signer.getAddress());
        setConnection(
            {
                ...wallet,
                text: "Connected",
                address: address,
                balance: balance,
                disable: false
            }
        );
        handleClose();

    }

    useEffect(async () => {
        if (!window.ethereum) {
            return 0;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = getERC20Contract(contractAddress, provider.getSigner());
        setCallFunction({
            ...callFunctions,
            decimals: (await contract.decimals()),
            nameContract: await contract.name(),
            symbol: await contract.symbol(),
            supply: await contract.totalSupply(),
        });
        await setWallet();
    }, []);



    async function contractCall() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = getERC20Contract(contractAddress, provider.getSigner());
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
    const navigate = useNavigate();
    const backTab = () => {
        navigate(`/`);
    }

    return (<>
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="inherit" />
        </Backdrop>

        <Container>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 3 }}>
                <Button variant="outlined" onClick={backTab}><KeyboardBackspaceIcon /></Button>

                <Button variant="contained" onClick={setWallet} disabled={wallet.disable} >{wallet.text}</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, mb: 3, alignItems: 'center' }}>

                <Box sx={{ whiteSpace: 'normal', overflowX: 'auto', mr: 3 }}>Address : {(wallet.address)}</Box>
                <Box sx={{ display : 'flex',whiteSpace: 'normal', overflowX: 'auto', }}>
                    <Box>Balance : </Box>
                    {wallet.balance === '0' ? <Box sx={{ width: 100 }}> <Skeleton variant="text" sx={{height : 25}} /></Box> : utils.formatUnits(wallet.balance, callFunctions.decimals)}</Box>

            </Box>

            <Box sx={{ width: '100%' }}>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabButton value={option} handleChange={handleChangeOption}></TabButton>
                </Box>
                <TabPanel value={option} index={0}>
                    <CommonInput value={values.toAddress} label='spender' tag='To' onChangeFunction={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} onChangeFunction={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={1}>
                    <CommonInput value={values.toAddress} label='spender' tag='To' onChangeFunction={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Decrease Amount' tag={callFunctions.symbol} onChangeFunction={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={2}>
                    <CommonInput value={values.toAddress} label='spender' tag='To' onChangeFunction={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Increase Amount' tag={callFunctions.symbol} onChangeFunction={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={3}>
                    {/* <CommonInput value={values.fromAddress} tag='From' onChangeFunction={handleChange('fromAddress')} /> */}
                    <CommonInput value={values.toAddress} tag='To' onChangeFunction={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} onChangeFunction={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={4}>
                    <CommonInput value={values.fromAddress} label='Owner' tag='From' onChangeFunction={handleChange('fromAddress')} />
                    <CommonInput value={values.toAddress} label='spender' tag='To' onChangeFunction={handleChange('toAddress')} />
                    <CommonInput value={values.amount} label='Amount' tag={callFunctions.symbol} onChangeFunction={handleChange('amount')} />
                </TabPanel>
                <TabPanel value={option} index={5}>
                    <CommonInput value={values.fromAddress} label='Owner' tag='From' onChangeFunction={handleChange('fromAddress')} />
                    <CommonInput value={values.toAddress} label='spender' tag='To' onChangeFunction={handleChange('toAddress')} />
                </TabPanel>
                <TabPanel value={option} index={6}>
                    <CommonInput value={values.toAddress} label='Account' tag='Address' onChangeFunction={handleChange('toAddress')} />
                </TabPanel>
            </Box>

            <Box sx={{ p: 3 }}>
                <Button variant="contained" onClick={contractCall}>Confirm</Button>
            </Box>
            <Box sx={{ mt: 2, mb : 5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Decimals:</Box> <Box>{callFunctions.decimals}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Name:</Box><Box>{callFunctions.nameContract}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Symbol:</Box><Box>{callFunctions.symbol}</Box></Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}><Box>Total Supply:</Box><Box>{utils.formatUnits(callFunctions.supply, callFunctions.decimals)}</Box></Box>
            </Box>
            <LogTable></LogTable>
        </Container>
    </>);
}
export default Home;