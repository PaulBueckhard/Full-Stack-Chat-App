import { Box, Text } from '@chakra-ui/layout';
import { Tooltip } from "@chakra-ui/tooltip";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/button";
import React, { useState } from 'react'
import { Avatar, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useDisclosure, useToast } from '@chakra-ui/react';
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
        header: {
          "Content-type":"application/json",
          Authorization: `Bearer ${user.token}`
        }
      };

      const {data} = await axios.post("/api/chat", {userId}, config);

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
          bg="white"
          w="100%"
          p="5px 10px 5px 10px"
          borderWidth="5px">
          <Tooltip 
          label = "Search for users" 
          hasArrow 
          placement='bottom-end'>
            <Button variant = "ghost" onClick = {onOpen}>
              <i class = "fas fa-search"></i>
              <Text display={{ base: "none", md: "flex" }} px={4}>
                Search user
              </Text>
            </Button>
          </Tooltip>
          <Text fontSize="2xl" fontFamily="Work sans">
            Chat:E
          </Text>
          <div>
            <Menu>
              <MenuButton as = {Button} rightIcon = {<ChevronDownIcon/>}>
                <Avatar size = "sm" cursor = "pointer" name = {user.name} src = {user.pic} />
              </MenuButton>
              <MenuList>
                <ProfileModal user = {user}>
                  <MenuItem>My profile</MenuItem>
                </ProfileModal>
                <MenuDivider/>
                <MenuItem onClick = {logoutHandler}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </div>
        </Box>

        <Drawer placement = "left" onClose = {onClose} isOpen = {isOpen}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth = "1px">Search users</DrawerHeader>
            <DrawerBody>
            <Box display = "flex" pb = {2}>
              <Input 
                placeholder = "Enter name or e-mail"
                mr = {2}
                value = {search}
                onChange = {(e) => setSearch(e.target.value)} 
              />
              <Button onClick = {handleSearch}>Search</Button>
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
          </DrawerBody>
          </DrawerContent>
        </Drawer>
    </>
  )
}

export default SideDrawer
