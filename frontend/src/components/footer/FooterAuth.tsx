import { Flex, Text, useColorModeValue } from '@chakra-ui/react';

export default function Footer() {
	let textColor = useColorModeValue('gray.400', 'white');
	return (
		<Flex
			zIndex='3'
			justifyContent='center'
			px={{ base: '30px', md: '0px' }}
			pb='30px'>
			<Text
				color={textColor}
				textAlign='center'
			>
				&copy; 2025 DeepMetric Technology. All Rights Reserved.
			</Text>
		</Flex>
	);
}
