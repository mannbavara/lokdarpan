import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useToast,
  Badge,
  Select,
  Stack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
} from '@chakra-ui/react';
import { MdSearch, MdAdd, MdSecurity, MdBlock, MdCheckCircle, MdHistory, MdEmail } from 'react-icons/md';
import userService, { User, InviteUserRequest, Invitation } from 'services/UserService';
import roleService, { Role } from 'services/RoleService';

export default function UserManagement() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const bg = useColorModeValue('white', 'navy.700');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.100');
  const toast = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]); // Added state
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Invite Modal
  const { 
    isOpen: isInviteOpen, 
    onOpen: onInviteOpen, 
    onClose: onInviteClose 
  } = useDisclosure();
  
  // Role Change Modal
  const { 
    isOpen: isRoleOpen, 
    onOpen: onRoleOpen, 
    onClose: onRoleClose 
  } = useDisclosure();

  // Selected User State
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roleHistory, setRoleHistory] = useState<any[]>([]);

  // Forms
  const [inviteData, setInviteData] = useState<InviteUserRequest>({ email: '', role_id: '' });
  const [newRoleId, setNewRoleId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchInvitations(); // Fetch invitations
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast({ title: 'Error fetching users', status: 'error' });
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Failed to fetch roles', error);
    }
  };

  const fetchInvitations = async () => {
    try {
      const data = await userService.getInvitations();
      setInvitations(data);
    } catch (error) {
      console.error('Failed to fetch invitations', error);
      toast({ title: 'Error fetching invitations', status: 'error' });
    }
  };

  const handleInvite = async () => {
    if (!inviteData.email || !inviteData.role_id) {
      toast({ title: 'Please fill all fields', status: 'warning' });
      return;
    }
    setIsSubmitting(true);
    try {
      await userService.inviteUser(inviteData);
      toast({ title: 'Invitation sent', status: 'success' });
      onInviteClose();
      setInviteData({ email: '', role_id: '' });
      fetchInvitations(); // Refresh invitations
    } catch (error: any) {
      toast({ title: 'Error sending invitation', description: error.message, status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openRoleModal = async (user: User) => {
    setSelectedUser(user);
    setNewRoleId(user.role?.id || '');
    onRoleOpen();
    try {
      const history = await userService.getUserRoleHistory(user.id);
      setRoleHistory(history);
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRoleId) return;
    setIsSubmitting(true);
    try {
      await userService.updateUserRole(selectedUser.id, newRoleId);
      toast({ title: 'Role updated', status: 'success' });
      fetchUsers();
      onRoleClose();
    } catch (error: any) {
      toast({ title: 'Error updating role', description: error.message, status: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (user: User) => {
    const action = user.is_active ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} user "${user.full_name || user.email}"?`)) return;
    
    try {
      await userService.updateUser(user.id, { is_active: !user.is_active });
      toast({ title: `User ${action}d`, status: 'success' });
      fetchUsers();
    } catch (error: any) {
      toast({ title: `Error ${action}ing user`, status: 'error' });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       user.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [users, searchQuery]);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex direction='column'>
        <Box
          bg={bg}
          borderRadius='xl'
          p='20px'
          mb='20px'
          boxShadow='0px 4px 12px rgba(0, 0, 0, 0.05)'
        >
          <Flex justify='space-between' align='center' mb='20px'>
            <Heading color={textColor} fontSize='2xl'>
              User Management
            </Heading>
            <Button
              leftIcon={<Icon as={MdAdd as any} />}
              colorScheme='brand'
              variant='solid'
              onClick={onInviteOpen}
            >
              Invite User
            </Button>
          </Flex>

          <Tabs variant='soft-rounded' colorScheme='brand'>
            <TabList>
              <Tab>Active Users</Tab>
              <Tab>Invited Users</Tab>
            </TabList>
            <TabPanels>
              <TabPanel px={0}>
                <InputGroup w={{ base: '100%', md: '300px' }} mb='20px'>
                  <InputLeftElement children={<Icon as={MdSearch as any} color='gray.500' />} />
                  <Input
                    placeholder='Search users...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    borderRadius='10px'
                  />
                </InputGroup>

                <Box overflowX='auto'>
                  <Table variant='simple' color='gray.500'>
                    <Thead>
                      <Tr>
                        <Th borderColor={borderColor}>User</Th>
                        <Th borderColor={borderColor}>Role</Th>
                        <Th borderColor={borderColor}>Status</Th>
                        <Th borderColor={borderColor}>Department/Title</Th>
                        <Th borderColor={borderColor}>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredUsers.map((user) => (
                        <Tr key={user.id}>
                          <Td borderColor={borderColor}>
                            <Flex direction="column">
                              <Text color={textColor} fontSize='sm' fontWeight='bold'>
                                {user.full_name || '-'}
                              </Text>
                              <Text color="gray.500" fontSize='xs'>
                                {user.email}
                              </Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge colorScheme='purple' variant='solid' borderRadius='full' px={2}>
                              {user.role?.name || 'No Role'}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge colorScheme={user.is_active ? 'green' : 'red'}>
                              {user.is_active ? 'ACTIVE' : 'INACTIVE'}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex direction="column">
                              <Text fontSize='xs'>{user.department || '-'}</Text>
                              <Text fontSize='xs' color="gray.500">{user.job_title || '-'}</Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Flex>
                              <Tooltip label="Change Role">
                                <IconButton
                                  aria-label="Change Role"
                                  icon={<Icon as={MdSecurity as any} />}
                                  size="sm"
                                  mr={2}
                                  onClick={() => openRoleModal(user)}
                                  isDisabled={user.is_superuser && user.role?.name === 'Super Admin'} // Simplified check
                                />
                              </Tooltip>
                              <Tooltip label={user.is_active ? "Deactivate" : "Activate"}>
                                <IconButton
                                  aria-label="Toggle Status"
                                  icon={user.is_active ? <Icon as={MdBlock as any} /> : <Icon as={MdCheckCircle as any} />}
                                  size="sm"
                                  colorScheme={user.is_active ? "red" : "green"}
                                  variant="ghost"
                                  onClick={() => toggleStatus(user)}
                                  isDisabled={user.is_superuser} // Safety
                                />
                              </Tooltip>
                            </Flex>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>

              <TabPanel px={0}>
                <Box overflowX='auto'>
                  <Table variant='simple' color='gray.500'>
                    <Thead>
                      <Tr>
                        <Th borderColor={borderColor}>Email</Th>
                        <Th borderColor={borderColor}>Role</Th>
                        <Th borderColor={borderColor}>Status</Th>
                        <Th borderColor={borderColor}>Invited At</Th>
                        <Th borderColor={borderColor}>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {invitations.map((invite) => (
                        <Tr key={invite.id}>
                          <Td borderColor={borderColor}>
                            <Flex align="center">
                               <Icon as={MdEmail as any} mr={2} color="gray.500" />
                               <Text color={textColor} fontSize='sm' fontWeight='bold'>{invite.invited_email}</Text>
                            </Flex>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge colorScheme='purple' variant='solid' borderRadius='full' px={2}>
                              {roles.find(r => r.id === invite.role_id)?.name || 'Unknown Role'}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Badge colorScheme={invite.status === 'pending' ? 'yellow' : 'gray'}>
                              {invite.status.toUpperCase()}
                            </Badge>
                          </Td>
                          <Td borderColor={borderColor}>
                            <Text fontSize='sm'>{new Date(invite.created_at).toLocaleDateString()}</Text>
                          </Td>
                          <Td borderColor={borderColor}>
                             {/* Future: Revoke button */}
                             <Text fontSize='xs' color='gray.500'>-</Text>
                          </Td>
                        </Tr>
                      ))}
                      {invitations.length === 0 && (
                        <Tr>
                           <Td colSpan={5} textAlign="center" py={4}>
                             <Text color="gray.500">No pending invitations found.</Text>
                           </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>

      {/* Invite User Modal */}
      <Modal isOpen={isInviteOpen} onClose={onInviteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Invite New User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input 
                  type="email"
                  value={inviteData.email} 
                  onChange={(e) => setInviteData({...inviteData, email: e.target.value})}
                  placeholder="user@example.com"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Role</FormLabel>
                <Select 
                  placeholder="Select role"
                  value={inviteData.role_id}
                  onChange={(e) => setInviteData({...inviteData, role_id: e.target.value})}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
             <Button variant="ghost" mr={3} onClick={onInviteClose}>Cancel</Button>
             <Button colorScheme="brand" onClick={handleInvite} isLoading={isSubmitting}>Send Invite</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Change Role Modal */}
      <Modal isOpen={isRoleOpen} onClose={onRoleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Role: {selectedUser?.full_name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={6}>
              <FormControl>
                <FormLabel>Current Role</FormLabel>
                <Select 
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                >
                   {roles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Heading size="sm" mb={2} display="flex" alignItems="center">
                  <Icon as={MdHistory as any} mr={2} /> Role History
                </Heading>
                <Box maxH="200px" overflowY="auto" borderWidth="1px" borderRadius="md">
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Date</Th>
                        <Th>Old Role</Th>
                        <Th>New Role</Th>
                        <Th>Changed By</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {roleHistory.map((log) => (
                        <Tr key={log.id}>
                          <Td fontSize="xs">{new Date(log.changed_at).toLocaleDateString()}</Td>
                          <Td fontSize="xs">{log.old_role_snapshot?.name || '-'}</Td>
                          <Td fontSize="xs">{log.new_role_snapshot?.name || '-'}</Td>
                          <Td fontSize="xs">{log.changed_by_user_id // ideally resolve name
                          }</Td>
                        </Tr>
                      ))}
                      {roleHistory.length === 0 && (
                        <Tr><Td colSpan={4} textAlign="center">No history found</Td></Tr>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Stack>
          </ModalBody>
          <ModalFooter>
             <Button variant="ghost" mr={3} onClick={onRoleClose}>Cancel</Button>
             <Button colorScheme="brand" onClick={handleChangeRole} isLoading={isSubmitting}>Update Role</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
