import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';

interface AdminNavbarProps {
  secondary: boolean;
}

export default function AdminNavbar(props: AdminNavbarProps) {
  const [, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const bgColor = useColorModeValue("white", "navy.800");


  return (
    <Box
      position="fixed"
      top="0"
      left={{ base: 0, xl: "300px", "2xl": "300px" }}
      right="0"
      height="85px"
      bg={bgColor}
	  borderWidth={"1px"}
      zIndex="1000"
      display="flex"
      alignItems="center"
      px={{ base: "16px", md: "24px", xl: "30px" }}
      w="auto"
      transition="all 0.2s ease"
    >
      <Flex w="100%" align="center" justify="flex-end">
        <AdminNavbarLinks
          secondary={props.secondary}
        />
      </Flex>
    </Box>
  );
}
