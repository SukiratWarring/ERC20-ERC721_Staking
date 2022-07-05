import React, { useState } from 'react'
import { Flex, Spacer, Box, Heading, Button } from '@chakra-ui/react';
import Errormsg from './Errormsg';


function Header() {
  const [msg, setMsg] = useState('');
  const btnhandler = async () => {
    // Asking if metamask is already present or not
    if (window.ethereum) {
      // res[0] for fetching a first wallet
      await window.ethereum.request({ method: "eth_requestAccounts" })
        .catch((e) => { const cat=e.message;setMsg(cat); console.log(e.message) })
        console.log(msg)
      // .then((res) => accountChangeHandler(res[0]));
    } else {
      alert("Install metamask extension!!");
    }
  };
  return (
    <Flex padding={"2"} backgroundColor={"blue.600"}>
      <Box >
        <Heading size={"lg"} textColor={'orange'} >
          Welcome to the Staking App
        </Heading>
      </Box>
      
      <Spacer />
      <Button size={"lg"} colorScheme={"orange"} color={"black"} onClick={btnhandler}>
        Connect
      </Button>
      <Errormsg msg={msg} changetheError={(m)=>{setMsg(m)}}/>
    </Flex>
  )
}

export default Header