import React, { useState } from "react";
import { Box, Heading, Text, VStack, Grid, Table, Thead, Tbody, Tr, Th, Td, TableContainer, Select, Input, Button, useToast } from "@chakra-ui/react";
import { FaCoins } from "react-icons/fa";

const samplePrices = {
  BTC: { price: 50000, prevPrice: 48000 },
  ETH: { price: 2000, prevPrice: 2100 },
  XRP: { price: 0.5, prevPrice: 0.48 },
  ADA: { price: 1.2, prevPrice: 1.15 },
};

const calculatePriceChange = (currentPrice, prevPrice) => {
  const change = ((currentPrice - prevPrice) / prevPrice) * 100;
  return change.toFixed(2);
};

const Index = () => {
  const [balance, setBalance] = useState(10000);
  const [holdings, setHoldings] = useState({});
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [amount, setAmount] = useState(0);
  const toast = useToast();

  const buy = () => {
    const price = samplePrices[selectedCoin] * amount;
    if (balance < price) {
      toast({
        title: "잔액 부족",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      setBalance(balance - price);
      setHoldings({
        ...holdings,
        [selectedCoin]: (holdings[selectedCoin] || 0) + amount,
      });
      toast({
        title: "구매 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const sell = () => {
    if (!holdings[selectedCoin] || holdings[selectedCoin] < amount) {
      toast({
        title: "보유량 부족",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      const price = samplePrices[selectedCoin] * amount;
      setBalance(balance + price);
      setHoldings({
        ...holdings,
        [selectedCoin]: holdings[selectedCoin] - amount,
      });
      toast({
        title: "판매 완료",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={8}>
      <VStack spacing={8} align="stretch">
        <Heading size="2xl">
          가상화폐 거래소
          <FaCoins style={{ display: "inline", marginLeft: "8px" }} />
        </Heading>
        <Text fontSize="xl">잔액: {balance.toLocaleString()} 원</Text>

        <Grid templateColumns="1fr 1fr" gap={8}>
          <Box>
            <Heading size="lg" mb={4}>
              실시간 시세
            </Heading>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>코인</Th>
                    <Th isNumeric>시세</Th>
                    <Th isNumeric>변동률</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.entries(samplePrices).map(([coin, { price, prevPrice }]) => {
                    const change = calculatePriceChange(price, prevPrice);
                    return (
                      <Tr key={coin}>
                        <Td>{coin}</Td>
                        <Td isNumeric>{price.toLocaleString()} 원</Td>
                        <Td isNumeric color={change >= 0 ? "green.500" : "red.500"}>
                          {change}%
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>

          <Box>
            <Heading size="lg" mb={4}>
              거래
            </Heading>
            <Select mb={4} value={selectedCoin} onChange={(e) => setSelectedCoin(e.target.value)}>
              {Object.keys(samplePrices).map((coin) => (
                <option key={coin} value={coin}>
                  {coin}
                </option>
              ))}
            </Select>
            <Input mb={4} type="number" placeholder="수량" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
            <Button mb={2} colorScheme="blue" onClick={buy}>
              구매
            </Button>
            <Button colorScheme="red" onClick={sell}>
              판매
            </Button>
          </Box>
        </Grid>

        <Box>
          <Heading size="lg" mb={4}>
            보유 자산
          </Heading>
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>코인</Th>
                  <Th isNumeric>수량</Th>
                  <Th isNumeric>평가 금액</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(holdings).map(([coin, amount]) => (
                  <Tr key={coin}>
                    <Td>{coin}</Td>
                    <Td isNumeric>{amount.toLocaleString()}</Td>
                    <Td isNumeric>{(amount * samplePrices[coin]).toLocaleString()} 원</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Box>
  );
};

export default Index;
