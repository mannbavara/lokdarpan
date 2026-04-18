import React, { useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Badge,
  Button,
  VStack,
  HStack,
  Card,
  CardBody,
  useColorModeValue,
  Divider,
  Tag,
  TagLabel,
  Icon,
} from '@chakra-ui/react';
import { MdSearch, MdLocationOn, MdStar, MdDateRange, MdDescription, MdChevronRight } from 'react-icons/md';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

// --- MOCK DATA ---
const PARTY_COLORS: Record<string, string> = {
  'BJP': '#FF9933', // Orange/Saffron
  'Shiv Sena': '#FF4500', // Orange-red
  'Congress': '#00BFFF', // Blue
  'NCP': '#4169E1', // Clock blue
  'MNS': '#FF6347', 
};

const politicians = [
  { id: 1, name: 'Aditya Thackeray', party: 'Shiv Sena', ward: 'Worli', designation: 'MLA', yearsInOffice: 4, avatar: 'https://bit.ly/dan-abramov' },
  { id: 2, name: 'Ashish Shelar', party: 'BJP', ward: 'Bandra West', designation: 'MLA', yearsInOffice: 9, avatar: 'https://bit.ly/ryan-florence' },
  { id: 3, name: 'Varsha Gaikwad', party: 'Congress', ward: 'Dharavi', designation: 'MLA', yearsInOffice: 19, avatar: 'https://bit.ly/kent-c-dodds' },
  { id: 4, name: 'Rahul Narwekar', party: 'BJP', ward: 'Colaba', designation: 'MLA', yearsInOffice: 4, avatar: 'https://bit.ly/prosper-baba' },
  { id: 5, name: 'Ameet Satam', party: 'BJP', ward: 'Andheri West', designation: 'MLA', yearsInOffice: 9, avatar: 'https://bit.ly/sage-adebayo' },
  { id: 6, name: 'Nawab Malik', party: 'NCP', ward: 'Anushakti Nagar', designation: 'MLA', yearsInOffice: 20, avatar: 'https://bit.ly/ryan-florence' },
  { id: 7, name: 'Rutuja Latke', party: 'Shiv Sena', ward: 'Andheri East', designation: 'MLA', yearsInOffice: 1, avatar: 'https://bit.ly/kent-c-dodds' },
  { id: 8, name: 'Zeeshan Siddique', party: 'Congress', ward: 'Bandra East', designation: 'MLA', yearsInOffice: 4, avatar: 'https://bit.ly/dan-abramov' },
];

const partyData = [
  { name: 'BJP', value: 82 },
  { name: 'Shiv Sena', value: 84 },
  { name: 'Congress', value: 31 },
  { name: 'NCP', value: 9 },
  { name: 'MNS', value: 1 },
].sort((a, b) => b.value - a.value);

const activityFeed = [
  { id: 1, text: 'Aditya Thackeray spoke at MMRDA meeting regarding metro line 3.', date: '2 days ago' },
  { id: 2, text: 'Ashish Shelar launched a new coastal road expansion plan.', date: '3 days ago' },
  { id: 3, text: 'Varsha Gaikwad protested for better housing facilities in Dharavi.', date: '4 days ago' },
  { id: 4, text: 'BMC budget passed with unanimous support from all major parties.', date: '1 week ago' },
];

const topIssues = ['Housing', 'Transport', 'Corruption', 'Environment', 'Infrastructure', 'Healthcare', 'Education'];

const zones = [
  { name: 'North', representative: 'Shri Gopal Shetty' },
  { name: 'South', representative: 'Arvind Sawant' },
  { name: 'East', representative: 'Manoj Kotak' },
  { name: 'West', representative: 'Poonam Mahajan' },
  { name: 'Central', representative: 'Rahul Shewale' },
];

export default function CivicDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // Colors
  const bgNavy = '#0B1A30'; // Editorial Navy
  const textPrimary = useColorModeValue('gray.800', 'white');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const pageBg = useColorModeValue('#F7F9FC', '#0B1A30');
  const panelBorderColor = useColorModeValue('gray.100', 'gray.700');
  const panelHoverBg = useColorModeValue('gray.50', 'gray.700');

  const filteredPoliticians = politicians.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.party.toLowerCase().includes(term) ||
      p.ward.toLowerCase().includes(term)
    );
  });

  return (
    <Box minH="100vh" bg={pageBg} pb={12} fontFamily="'Inter', sans-serif">
      {/* 1. Header & Hero Area */}
      <Box 
        w="100%" 
        bg={bgNavy} 
        color="white" 
        pt={{ base: '120px', md: '100px' }} 
        pb="60px" 
        px={8}
        position="relative"
        overflow="hidden"
      >
        <Box 
          position="absolute" 
          top={0} left={0} right={0} bottom={0} 
          opacity={0.05} 
          bgImage="url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"
        />
        <Flex maxW="1400px" mx="auto" direction={{ base: 'column', md: 'row' }} justify="space-between" align="center" position="relative" zIndex={1}>
          <Box>
            <Text color="#FF9933" fontWeight="bold" letterSpacing="widest" textTransform="uppercase" fontSize="sm" mb={2}>
              Civic Intelligence Dashboard
            </Text>
            <Heading as="h1" size="2xl" fontFamily="'Merriweather', serif" mb={4}>
              MUMBAI
            </Heading>
            <Text fontSize="lg" color="gray.300" mb={2}>
              Know Your Representatives. Track Action. Demand Accountability.
            </Text>
            <Text fontSize="sm" color="gray.400">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </Box>
          <Box w={{ base: '100%', md: '400px' }} mt={{ base: 6, md: 0 }}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <Icon as={MdSearch as any} color="gray.300" />
              </InputLeftElement>
              <Input 
                type="text" 
                placeholder="Search by name, ward, or party..." 
                bg="whiteAlpha.200" 
                color="white"
                border="none"
                _placeholder={{ color: 'whiteAlpha.600' }}
                _focus={{ bg: 'whiteAlpha.300', boxShadow: 'none' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
        </Flex>
      </Box>

      <Box maxW="1400px" mx="auto" px={8} mt="-30px" position="relative" zIndex={2}>
        {/* 2. Stats Bar */}
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={4} mb={10}>
          {[
             { label: 'Total MLAs', value: '36', icon: <Icon as={MdStar as any} w="20px" h="20px" /> },
             { label: 'Municipal Councillors', value: '227', icon: <Icon as={MdLocationOn as any} w="20px" h="20px" /> },
             { label: 'Active Bills', value: '14', icon: <Icon as={MdDescription as any} w="20px" h="20px" /> },
             { label: 'Upcoming Elections', value: 'BMC 2024', icon: <Icon as={MdDateRange as any} w="20px" h="20px" /> }
          ].map((stat, i) => (
            <Card key={i} bg={cardBg} shadow="sm" borderRadius="md">
              <CardBody>
                <HStack color={textSecondary} mb={2}>
                  {stat.icon}
                  <Text fontSize="sm" fontWeight="medium">{stat.label}</Text>
                </HStack>
                <Text fontSize="2xl" fontWeight="bold" color={textPrimary}>{stat.value}</Text>
              </CardBody>
            </Card>
          ))}
        </Grid>

        <Grid templateColumns={{ base: '1fr', lg: '8fr 4fr' }} gap={8}>
          {/* Main Content Area */}
          <Box>
            {/* Top Issues Tracker */}
            <Box mb={8}>
              <Heading size="md" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                Trending Issues in Mumbai
              </Heading>
              <Flex flexWrap="wrap" gap={2}>
                {topIssues.map(issue => (
                  <Tag 
                    size="lg" 
                    key={issue} 
                    borderRadius="full" 
                    variant={selectedIssue === issue ? 'solid' : 'subtle'}
                    colorScheme="orange"
                    cursor="pointer"
                    onClick={() => setSelectedIssue(selectedIssue === issue ? null : issue)}
                  >
                    <TagLabel>{issue}</TagLabel>
                  </Tag>
                ))}
              </Flex>
            </Box>

            {/* Featured Politicians Grid */}
            <Heading size="md" fontFamily="'Merriweather', serif" mb={4} color={textPrimary} mt={8}>
              Featured Representatives
            </Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(2, 1fr)' }} gap={6}>
              {filteredPoliticians.map((pol) => (
                <Card 
                  key={pol.id} 
                  bg={cardBg} 
                  shadow="sm" 
                  borderRadius="md"
                  overflow="hidden"
                  borderLeft="4px solid"
                  borderLeftColor={PARTY_COLORS[pol.party] || 'gray.200'}
                  transition="all 0.2s"
                  _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
                >
                  <CardBody>
                    <Flex justify="space-between" align="flex-start">
                      <HStack spacing={4}>
                        <Avatar size="lg" name={pol.name} src={pol.avatar} />
                        <Box>
                          <Heading size="sm" color={textPrimary} mb={1}>{pol.name}</Heading>
                          <Badge bg={PARTY_COLORS[pol.party] + '20'} color={PARTY_COLORS[pol.party]} px={2} borderRadius="sm" mb={2}>
                            {pol.party}
                          </Badge>
                          <HStack fontSize="sm" color={textSecondary} spacing={4}>
                            <HStack spacing={1}><Icon as={MdLocationOn as any} w="14px" h="14px" /><Text>{pol.ward}</Text></HStack>
                            <Text>•</Text>
                            <Text>{pol.designation}</Text>
                          </HStack>
                          <Text fontSize="xs" color="gray.400" mt={1}>
                            {pol.yearsInOffice} years in office
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                    <Divider my={4} />
                    <Button w="100%" variant="ghost" colorScheme="blue" size="sm" rightIcon={<Icon as={MdChevronRight as any} w="16px" h="16px" />}>
                      View Profile
                    </Button>
                  </CardBody>
                </Card>
              ))}
              {filteredPoliticians.length === 0 && (
                <Box p={8} textAlign="center" gridColumn={{ base: 'span 1', md: 'span 2' }}>
                  <Text color={textSecondary}>No representatives found matching your search.</Text>
                </Box>
              )}
            </Grid>
          </Box>

          {/* Sidebar Area */}
          <VStack spacing={8} align="stretch">
            {/* Party Breakdown Chart */}
            <Card bg={cardBg} shadow="sm" borderRadius="md">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={6} color={textPrimary}>
                  Assembly Seat Distribution
                </Heading>
                <Box h="300px" w="100%">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                      <Pie
                        data={partyData}
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="60%"
                        paddingAngle={2}
                        minAngle={15}
                        dataKey="value"
                        label={({ cx, cy, midAngle, innerRadius, outerRadius, value, percent, name, fill, x, y }) => {
                          const isLeft = x < cx;
                          return (
                            <text x={x} y={y} fontSize="12px" fill={fill} textAnchor={isLeft ? 'end' : 'start'} dominantBaseline="central">
                              <tspan x={x} dy="-0.4em">{`${value} (${(percent * 100).toFixed(1)}%)`}</tspan>
                              <tspan x={x} dy="1.2em">{name}</tspan>
                            </text>
                          );
                        }}
                      >
                        {partyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PARTY_COLORS[entry.name] || '#CBD5E0'} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            {/* Ward Map Panel (Schematic) */}
            <Card bg={cardBg} shadow="sm" borderRadius="md">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                  Mumbai Zones (MPs)
                </Heading>
                <VStack align="stretch" spacing={2}>
                  {zones.map(zone => (
                    <Flex 
                      key={zone.name} 
                      justify="space-between" 
                      align="center" 
                      p={3} 
                      border="1px solid" 
                      borderColor={panelBorderColor}
                      borderRadius="md"
                      cursor="pointer"
                      _hover={{ bg: panelHoverBg }}
                    >
                      <Text fontWeight="medium" color={textPrimary}>{zone.name} Mumbai</Text>
                      <Text fontSize="sm" color={textSecondary}>{zone.representative}</Text>
                    </Flex>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* Recent Activity Feed */}
            <Card bg={cardBg} shadow="sm" borderRadius="md">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                  Recent Activity
                </Heading>
                <VStack align="stretch" spacing={4} maxH="300px" overflowY="auto" pr={2}>
                  {activityFeed.map(feed => (
                    <Box key={feed.id} borderLeft="2px solid" borderColor="orange.400" pl={3}>
                      <Text fontSize="sm" color={textPrimary} mb={1}>
                        {feed.text}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        {feed.date}
                      </Text>
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </Grid>
      </Box>
    </Box>
  );
}
