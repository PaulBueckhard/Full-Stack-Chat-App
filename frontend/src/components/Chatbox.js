import { Box } from "@chakra-ui/layout";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "./SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="#212121"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="#212121"
    >
      <SingleChat fetchAgain = {fetchAgain} setFetchAgain = {setFetchAgain} />
    </Box>
  );
};

export default Chatbox;