import { Box, Input, Heading, Button, VStack, Text, Center } from '@chakra-ui/react'
import React from 'react';
const MainBox = () => {
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
                <Text paddingTop={"2"} fontSize="xl" textColor={"orange.500"} fontWeight={'bold'}>Create stake &  mint nft 👷</Text>
                <Box padding={"5"} alignContent={"center"}>
                    <Input placeholder='_to' borderColor={"black"} ></Input>
                    <Input placeholder='_rate' borderColor={"black"}></Input>
                    <Input placeholder='_stakedDuration' borderColor={"black"}></Input>
                    <Input placeholder='_amount' borderColor={"black"}></Input>
                    <Center>
                        <Button colorScheme='blue' color={"black"} >Proceed</Button>
                    </Center>
                </Box>
                <Text fontSize="xl" textColor={"orange.500"} fontWeight={'bold'}>Reward per person 🪙</Text>
                <Box paddingBottom={"5"}>
                    <Input placeholder='_to' borderColor={"black"} ></Input>
                    <Center>
                        <Button colorScheme='blue' color={"black"}>Proceed</Button>
                    </Center>
                </Box>
                <Text fontSize="xl" textColor={"orange.500"} fontWeight={'bold'}>Withdraw Reward 💰</Text>
                <Box paddingBottom={"5"}>
                    <Input placeholder='_to' borderColor={"black"} ></Input>
                    <Center>
                        <Button colorScheme='blue' color={"black"}>Proceed</Button>
                    </Center>
                </Box>

            </VStack>
        </Box>
    )
}

export default MainBox