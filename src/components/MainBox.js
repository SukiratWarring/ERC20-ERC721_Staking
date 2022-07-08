import { Box, Input, Heading, Button, VStack, Text, Center } from '@chakra-ui/react'
import { ethers } from 'ethers';
import React,{useState} from 'react';
const stakingjson=require("../artifacts/contracts/staking_erc_to_nft.sol/staking_erc_to_nft.json")
const MainBox = () => {
    const abi=stakingjson.abi
    const provider=new ethers.providers.AlchemyProvider("rinkeby",process.env.REACT_APP_project_id_rinkeby);
    const wallet= new ethers.Wallet(process.env.REACT_APP_key_rinkeby,provider)
    const signer=wallet.connect(provider)
    // console.log("After Provider")
    const instance= new ethers.Contract(process.env.REACT_APP_stakingcontract_address_rinkeby,abi,signer)
    //For updation
    const[transferTO,settransferTO]=useState('');
    const [transferAmount,settransferAmount]=useState();
    const [createstaketo,setcreatestaketo]=useState()
    const [createstakerate,setcreatestakerate]=useState()
    const [createstakeduration,setcreatestakeduration]=useState()
    const [createstakeamount,setcreatestakeamount]=useState()
    const [showrewardofPerson,setshowrewardofPerson]=useState();
    const [ansrewardofPerson,setansrewardofPerson]=useState();
    const [withDrawto,setwithDrawto]=useState();
    const showreward=async()=>{
        //calculating the reward
        const calculated_Reward=await instance.reward_per_person(showrewardofPerson,{gasLimit:300000});
        console.log(calculated_Reward)
        //accessing the mapping
        // console.log("After instance") setansrewardofPerson(await instance.addTOreward[showrewardofPerson])
        
    }
    
    return (
        <Box
            w={['full', 'xl']}
            p={[8, 10]}
            mt={[20, '10vh']}
            mx='auto'
            border={['none', '1px']}
            borderColor={['', 'gray.300']}
            borderRadius={10}
            backgroundColor="blue.200"
            className='box'>
            <VStack>
                <Heading textAlign={"center"} size={"xl"} color="orange" backgroundColor={"blue.600"} borderRadius="10" >Proceed to Stake your assets with few clicks !</Heading>
                <Text fontSize="xl" textColor={"orange.500"} fontWeight={'bold'} paddingTop={"5"}>Transfer Tokens from the Owner 🪙</Text>
                <Box paddingBottom={"5"}>
                    <Input placeholder='_to' borderColor={"black"} onChange={(e)=>{settransferTO(e.target.value)}}></Input>
                    <Input placeholder='_amount' borderColor={"black"} onChange={(e)=>{settransferAmount(e.target.value)}}></Input>
                    <Center>
                        <Button colorScheme='blue' color={"black"} onClick={async()=>{await instance.transferTokens(transferTO,transferAmount,{gasLimit:300000})}}>Proceed</Button>
                    </Center>
                </Box>
                <Text paddingTop={""} fontSize="xl" textColor={"orange.500"} fontWeight={'bold'}>Create stake &  mint nft 👷</Text>
                <Box padding={"5"} alignContent={"center"}>
                    <Input placeholder='_to' borderColor={"black"} onChange={(e)=>{setcreatestaketo(e.target.value)}}></Input>
                    <Input placeholder='_rate' borderColor={"black"} onChange={(e)=>{setcreatestakerate(e.target.value)}}></Input>
                    <Input placeholder='_stakedDuration' borderColor={"black"} onChange={(e)=>{setcreatestakeduration(e.target.value)}}></Input>
                    <Input placeholder='_amount' borderColor={"black"} onChange={(e)=>{setcreatestakeamount(e.target.value)}}></Input>
                    <Center>
                        <Button colorScheme='blue' color={"black"} onClick={async()=>{const data_of_stake=await instance.create_stake_and_mint_nft(createstaketo,createstakerate,createstakeduration,createstakeamount,{gasLimit:300000});console.log(data_of_stake)}}>Proceed</Button>
                    </Center>
                </Box>
                <Text fontSize="xl" textColor={"orange.500"} fontWeight={'bold'}>Reward per person 🪙</Text>
                <Box paddingBottom={"5"}>
                    <Input placeholder='_to' borderColor={"black"} onChange={(e)=>{setshowrewardofPerson(e.target.value)}}></Input>
                    <Input placeholder='Answer for reward' borderColor={"black"} >{ansrewardofPerson}</Input>
                    <Center>
                        <Button colorScheme='blue' color={"black"} onClick={showreward}>Proceed</Button>
                    </Center>
                    
                </Box>
                <Text fontSize="xl" textColor={"orange.500"} fontWeight={'bold'}>Withdraw Reward 💰</Text>
                <Box paddingBottom={"5"}>
                    {/* <Input placeholder='_to' borderColor={"black"} onChange={(e)=>{setwithDrawto(e.target.value)}}></Input> */}
                    <Center>
                        <Button colorScheme='blue' color={"black"} onClick={()=>{instance.withdrawReward(withDrawto,{gasLimit:300000})}}>Proceed</Button>
                    </Center>
                </Box>

            </VStack>
        </Box>
    )
}

export default MainBox