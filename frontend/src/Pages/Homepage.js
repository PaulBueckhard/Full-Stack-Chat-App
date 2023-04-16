import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg="#212121"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        borderColor="#212121"
      >
        <Text fontSize="4xl" fontFamily="Work sans" textAlign="center" color="white">
          Chat:E
        </Text>
      </Box>
      <Box bg="#212121" w="100%" p={4} borderRadius="lg" borderWidth="1px" borderColor="#212121" color="white">
        <Tabs isFitted variant="soft-rounded" colorScheme='orange'>
          <TabList mb="1em">
            <Tab color="white">Login</Tab>
            <Tab color="white">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Homepage;