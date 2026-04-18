import { Flex, Icon, Text, Avatar, Menu, MenuButton, MenuList, MenuItem, Button, useColorMode, useColorModeValue } from '@chakra-ui/react';
import { MdNotificationsNone } from 'react-icons/md';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import routes from 'routes';
// React
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// API Service
import { getCurrentUser, UserPublic, logout, isAuthenticated, clearAuthData } from 'services/api';
import { SidebarResponsive } from 'components/sidebar/Sidebar';

interface HeaderLinksProps {
  secondary: boolean;
}

export default function HeaderLinks(props: HeaderLinksProps) {
	const { secondary } = props;
	const navigate = useNavigate();
	const { colorMode, toggleColorMode } = useColorMode();
	// Chakra Color Mode
	const navbarIcon = useColorModeValue('gray.400', 'white');
	let menuBg = useColorModeValue('white', 'navy.800');
	const textColor = useColorModeValue('secondaryGray.900', 'white');

	const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
	const ethBg = useColorModeValue('secondaryGray.300', 'navy.900');
	const shadow = useColorModeValue(
		'14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
		'14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
	);

	// User state
	const [user, setUser] = useState<UserPublic | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	// Fetch user data on component mount
	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (!isAuthenticated()) {
					setIsLoading(false);
					return;
				}
				const userData = await getCurrentUser();
				setUser(userData);
			} catch (error) {
				console.error('Failed to fetch user:', error);
				// If unauthorized, redirect to sign-in
				navigate('/auth/sign-in/default', { replace: true });
			} finally {
				setIsLoading(false);
			}
		};

		fetchUser();
	}, [navigate]);

	// Get user display name
	const getUserDisplayName = () => {
		if (!user) return 'User';
		return user.full_name || user.email.split('@')[0] || 'User';
	};



	// Handle logout with security best practices
	const handleLogout = async () => {
		try {
			// Clear all authentication data
			await logout();

			// Clear user state to prevent any data leakage
			setUser(null);

			// Navigate to sign-in page using React Router
			// Using replace: true prevents back button from returning to authenticated pages
			navigate('/auth/sign-in/default', { replace: true });
		} catch (error) {
			// Even if logout fails, clear local data and redirect
			console.error('Logout error:', error);
			clearAuthData();
			setUser(null);
			navigate('/auth/sign-in/default', { replace: true });
		}
		finally {
			// Hard redirect as a fallback to ensure session is cleared
			setTimeout(() => {
				window.location.replace('/auth/sign-in/default');
			}, 100);
		}
	};
	return (
		<Flex
			w={{ sm: '100%', md: 'auto' }}
			alignItems='center'
			flexDirection='row'
			bg={menuBg}
			flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
			p='10px'
			borderRadius='30px'
			boxShadow={shadow}>
			<Flex
				bg={ethBg}
				display={secondary ? 'flex' : 'none'}
				borderRadius='30px'
				ms='auto'
				p='6px'
				align='center'
				me='6px'>
				
			</Flex>
			<SidebarResponsive routes={routes} />
			<Menu>
				<MenuButton p='0px'>
					<Icon mt='6px' as={MdNotificationsNone as any} color={navbarIcon} w='18px' h='18px' me='10px' />
				</MenuButton>
				<MenuList
					boxShadow={shadow}
					p='20px'
					borderRadius='20px'
					bg={menuBg}
					border='none'
					mt='22px'
					me={{ base: '30px', md: 'unset' }}
					minW={{ base: 'unset', md: '400px', xl: '450px' }}
					maxW={{ base: '360px', md: 'unset' }}>
					<Flex w='100%' mb='20px'>
						<Text fontSize='md' fontWeight='600' color={textColor}>
							Notifications
						</Text>
					</Flex>
					<Flex flexDirection='column' align='center' py='20px'>
						<Text fontSize='sm' color={textColor} opacity={0.6}>
							No notifications
						</Text>
					</Flex>
				</MenuList>
			</Menu>

			<Button
				variant='no-hover'
				bg='transparent'
				p='0px'
				minW='unset'
				minH='unset'
				h='18px'
				w='max-content'
				onClick={toggleColorMode}>
				<Icon
					me='10px'
					h='18px'
					w='18px'
					color={navbarIcon}
					as={(colorMode === 'light' ? IoMdMoon : IoMdSunny) as any}
				/>
			</Button>
			<Menu>
				<MenuButton p='0px'>
					<Avatar
						_hover={{ cursor: 'pointer' }}
						color='white'
						name={isLoading ? 'Loading...' : getUserDisplayName()}
						bg='#11047A'
						size='sm'
						w='40px'
						h='40px'
					/>
				</MenuButton>
				<MenuList boxShadow={shadow} p='0px' mt='10px' borderRadius='20px' bg={menuBg} border='none'>
					<Flex w='100%' mb='0px' flexDirection='column' borderBottom='1px solid' borderColor={borderColor} px='20px' py='14px'>
						<Text fontSize='sm' fontWeight='700' color={textColor}>
							👋&nbsp; Hey, {isLoading ? '...' : getUserDisplayName()}
						</Text>
						<Text fontSize='xs' color={textColor} opacity={0.8}>
							{isLoading ? '...' : user?.email || 'Not signed in'}
						</Text>
					</Flex>
					<Flex flexDirection='column' p='10px'>
						<MenuItem 
							_hover={{ bg: 'none' }} 
							_focus={{ bg: 'none' }} 
							borderRadius='8px' 
							px='14px'
							onClick={() => navigate('/admin/account')}>
							<Text fontSize='sm'>Account</Text>
						</MenuItem>
						<MenuItem
							_hover={{ bg: 'none' }}
							_focus={{ bg: 'none' }}
							color='red.400'
							borderRadius='8px'
							px='14px'
							onClick={handleLogout}>
							<Text fontSize='sm'>Log out</Text>
						</MenuItem>
					</Flex>
				</MenuList>
			</Menu>
		</Flex>
	);
}