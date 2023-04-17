import { Box, Text } from '@chakra-ui/layout';
import { Tooltip } from "@chakra-ui/tooltip";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import React, { useState } from 'react'
import { Avatar, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, useDisclosure, useToast } from '@chakra-ui/react';
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async() => {
    if (!search) {
      toast({
        title: "Please enter a name or e-mail",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  const accessChat = async(userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        }
      };

      const {data} = await axios.post("/api/chat", {userId}, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    } catch (error) {
       toast({
        title: "Error fetching chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  return (
    <>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="#212121"
          color="white"
          w="100%"
          p="5px 10px 5px 10px"
          borderWidth="5px"
          borderColor="#212121">
          <Tooltip 
          label = "Search for users" 
          hasArrow 
          placement='bottom-end'>
            <Button variant="ghost" onClick = {onOpen} colorScheme='whiteAlpha' color='white'>
              <i class = "fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }} px={4} >
                Search user
              </Text>
            </Button>
          </Tooltip>
          <Text fontSize="3xl" fontFamily="Work sans">
            Chat:E
          </Text>
          <div>
            <Menu>
              <MenuButton as = {Button} rightIcon = {<ChevronDownIcon/>} bg="#212121" colorScheme='orange' color='white'>
                <Avatar size = "sm" cursor = "pointer" name = {user.name} src = {user.pic} />
              </MenuButton>
              <MenuList bg="#212121" color="white">
                <ProfileModal user = {user}>
                  <MenuItem bg="#212121" color="white">Profile</MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick = {logoutHandler} bg="#212121" color="white" >Log out</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer placement = "left" onClose = {onClose} isOpen = {isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth = "1px" bg="#212121" color="white" >Search users</DrawerHeader>
            <DrawerBody bg="#212121" color="white">
            <Box display = "flex" pb = {2}>
              <Input 
                placeholder = "Enter name or e-mail"
                mr = {2}
                value = {search}
                onChange = {(e) => setSearch(e.target.value)} 
              />
              <Button onClick = {handleSearch} colorScheme='orange'>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading/>
            ): (
              searchResult?.map(user => (
                <UserListItem
                  key = {user._id}
                  user = {user}
                  handleFunction = {() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml = "auto" display = "flex" />}
          </DrawerBody>
          </DrawerContent>
        </Drawer>
    </>
  )
}

export default SideDrawer
