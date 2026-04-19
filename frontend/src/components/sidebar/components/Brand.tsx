import { Flex, Text } from '@chakra-ui/react';

import lokdarpan_logo from 'assets/img/brand/lokdarpan_logo.png';
import { HSeparator } from 'components/separator/Separator';

export function SidebarBrand() {
	return (
		<Flex alignItems='center' flexDirection='column'>
			<Flex alignItems="center" flexDirection="row">
			{/* Logo */}
			<img
				src={lokdarpan_logo}
				alt="Lokdarpan Logo"
				height="40px"
				width="45px"
				style={{ margin: '12px 12px 12px 0', objectFit: 'contain' }}
			/>

			{/* Text beside the logo */}
			<Flex flexDirection="column">
				<Text fontWeight="bold" fontSize="lg">
				West Bengal Election 2026
				</Text>

				<Text fontSize="sm" color="gray.600">
				</Text>
			</Flex>
			</Flex>

			<HSeparator mb="20px" />

		</Flex>
	);
}

export default SidebarBrand;
