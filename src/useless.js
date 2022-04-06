import React from 'react';
function useless() {
    return (<>
        <div>
            <FormControl sx={{ mt: 5, width: '100%' }}>
                <InputLabel htmlFor="outlined-adornment-fromAddress">Owner</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-fromAddress"
                    value={values.fromAddress}
                    onChange={handleChange('fromAddress')}
                    startAdornment={<InputAdornment position="start">From</InputAdornment>}
                    label="Owner"
                />
            </FormControl>
        </div>
        <div>
            <FormControl sx={{ mt: 5, width: '100%' }}>
                <InputLabel htmlFor="outlined-adornment-toAddress">Spender</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-toAddress"
                    value={values.toAddress}
                    onChange={handleChange('toAddress')}
                    startAdornment={<InputAdornment position="start">To</InputAdornment>}
                    label="Spender"
                />
            </FormControl>
        </div>
        <div>
            <FormControl sx={{ mt: 5, width: '100%' }}>
                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-amount"
                    value={values.amount}
                    onChange={handleChange('amount')}
                    startAdornment={<InputAdornment position="start">{callFunctions.symbol}</InputAdornment>}
                    label="Amount"
                />
            </FormControl>
        </div>
    </>);
}