import React from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function TabButton(props) {
    return (<>
        <Tabs value={props.value} onChange={props.handleChange} aria-label="basic tabs example" variant="scrollable">
            <Tab label="Approve" {...a11yProps(0)} />
            <Tab label="Decrease Allowance" {...a11yProps(1)} />
            <Tab label="Increase Allowance" {...a11yProps(2)} />
            <Tab label="Transfer" {...a11yProps(3)} />
            <Tab label="Transfer From" {...a11yProps(4)} />
            <Tab label="Allowance" {...a11yProps(5)} />
            <Tab label="Balance of" {...a11yProps(6)} />
        </Tabs>
    </>);

}

export function CommonInput(props) {
    return (<>

        <FormControl sx={{ mt: 5, width: '100%' }}>
            <InputLabel >{props.label}</InputLabel>
            <OutlinedInput
                value={props.value}
                onChange={props.function}
                startAdornment={<InputAdornment position="start">{props.tag}</InputAdornment>}
                label={props.label}
            />
        </FormControl>

    </>);
}