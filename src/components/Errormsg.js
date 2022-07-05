import React from 'react'
import {Alert,AlertDescription,AlertIcon,AlertTitle} from '@chakra-ui/react';
function Errormsg({ msg }) {
    console.log(msg);
    if(msg===''){
        
        return null;
    }

    return (
        <div>
            <Alert status='error'>
                <AlertIcon />
                <AlertTitle >{msg}</AlertTitle>
                <AlertDescription></AlertDescription>
            </Alert>
        </div>
    )
}

export default Errormsg