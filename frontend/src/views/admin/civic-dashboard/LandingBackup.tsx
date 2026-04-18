import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Card,
  CardBody,
  useColorModeValue,
  Icon,
  Spinner,
  Center,
  Badge,
  Divider,
  Progress,
} from '@chakra-ui/react';
import { MdSearch, MdPeople } from 'react-icons/md';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { fetchFeaturedRepresentatives } from '../../../services/LandingService';
import { FeaturedRepresentative } from '../../../types/representative';
import RepresentativeCard from '../../../components/common/RepresentativeCard';

// ─── SHARED DATA (kept in sync with main dashboard) ──────────────────────
const PARTY_COLORS: Record<string, string> = {
  AITC: '#1BAA64',
  BJP: '#FF6B35',
  'Left Front+': '#E53E3E',
  INC: '#2B6CB0',
  Others: '#718096',
};

const allianceData = [
  {
    name: 'AITC+',
    fullName: 'All India Trinamool Congress+',
    leader: 'Mamata Banerjee',
    seats: 294,
    color: '#1BAA64',
    parties: [
      { name: 'All India Trinamool Congress', seats: 291 },
      { name: 'Bharatiya Gorkha Prajatantrik Morcha', seats: 3 },
    ],
  },
  {
    name: 'BJP',
    fullName: 'Bharatiya Janata Party',
    leader: 'Samik Bhattacharya',
    seats: 294,
    color: '#FF6B35',
    parties: [
      { name: 'Bharatiya Janata Party', seats: 293 },
      { name: 'Independent (Biswajit Mahato)', seats: 1 },
    ],
  },
  {
    name: 'Left Front+',
    fullName: 'Left Front Alliance',
    leader: 'Mohammed Salim',
    seats: 293,
    color: '#E53E3E',
    parties: [
      { name: 'CPI(M)', seats: 195 },
      { name: 'All India Forward Bloc', seats: 23 },
      { name: 'Indian Secular Front', seats: 30 },
      { name: 'CPI', seats: 16 },
      { name: 'RSP', seats: 16 },
      { name: 'Others', seats: 13 },
    ],
  },
  {
    name: 'INC',
    fullName: 'Indian National Congress',
    leader: 'Adhir Ranjan Chowdhury',
    seats: 294,
    color: '#2B6CB0',
    parties: [{ name: 'Indian National Congress', seats: 294 }],
  },
];

const seatPieData = [
  { name: 'AITC+', value: 294 },
  { name: 'BJP', value: 294 },
  { name: 'Left Front+', value: 293 },
  { name: 'INC', value: 294 },
];
const seatPieColors = ['#1BAA64', '#FF6B35', '#E53E3E', '#2B6CB0'];

const voterStats = [
  { label: 'Male Voters', value: '3,60,22,642', raw: 36022642, color: '#2B6CB0' },
  { label: 'Female Voters', value: '3,44,35,260', raw: 34435260, color: '#D53F8C' },
  { label: 'Third Gender', value: '1,382', raw: 1382, color: '#6B46C1' },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function LandingBackup() {
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<FeaturedRepresentative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchFeaturedRepresentatives()
      .then((data) => { if (!cancelled) setCandidates(data); })
      .catch((err: Error) => {
        if (!cancelled) {
          console.error('[LandingBackup]', err);
          setFetchError('Could not load candidates.');
        }
      })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const filteredCandidates = candidates.filter((p) => {
    const t = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(t) ||
      (p.party ?? '').toLowerCase().includes(t) ||
      (p.constituency ?? '').toLowerCase().includes(t)
    );
  });

  const bgNavy = '#0D1B2A';
  const textPrimary = useColorModeValue('gray.800', 'white');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const pageBg = useColorModeValue('#F0F4FA', bgNavy);
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const bgBg = useColorModeValue('blue.50', 'blue.900');
  const bgGray = useColorModeValue('gray.50', 'gray.700');
  const voterStatBg = useColorModeValue('blue.50', 'blue.900');
  const chartGridColor = useColorModeValue('#E2E8F0', '#2D3748');

  return (
    <Box minH="100vh" bg={pageBg} pt={{ base: '110px', md: '90px' }} pb={16}
      fontFamily="'Inter', sans-serif">
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>

        {/* Page heading */}
        <HStack mb={8} spacing={3}>
          <Box>
            <Heading as="h1" size="lg" fontFamily="'Merriweather', serif" color={textPrimary}>
              WB Election 2026 — Detailed View
            </Heading>
            <Text fontSize="sm" color={textSecondary} mt={1}>
              Seat breakdown · alliances · voter statistics · featured candidates
            </Text>
          </Box>
        </HStack>

        <Grid templateColumns={{ base: '1fr', lg: '8fr 4fr' }} gap={8}>

          {/* ── MAIN COLUMN ── */}
          <VStack spacing={8} align="stretch">

            {/* PARTIES & ALLIANCES */}
            <Box>
              <Heading size="md" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                Parties &amp; Alliances
              </Heading>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {allianceData.map((alliance) => (
                  <Card key={alliance.name} bg={cardBg} shadow="sm" borderRadius="xl"
                    overflow="hidden" transition="all 0.2s"
                    _hover={{ transform: 'translateY(-3px)', shadow: 'md' }}
                    borderTop="4px solid" borderTopColor={alliance.color}>
                    <CardBody>
                      <Flex justify="space-between" align="flex-start" mb={3}>
                        <Box>
                          <Badge
                            bg={alliance.color + '20'} color={alliance.color}
                            fontSize="md" fontWeight="black" px={3} py={1} borderRadius="md" mb={2}>
                            {alliance.name}
                          </Badge>
                          <Text fontSize="xs" color={textSecondary} noOfLines={1}>{alliance.fullName}</Text>
                        </Box>
                        <Box textAlign="right">
                          <Text fontSize="2xl" fontWeight="black" color={alliance.color}>{alliance.seats}</Text>
                          <Text fontSize="10px" color={textSecondary} textTransform="uppercase">seats</Text>
                        </Box>
                      </Flex>
                      <Divider my={3} />
                      <HStack mb={3}>
                        <Icon as={MdPeople as any} color={textSecondary} w="14px" h="14px" />
                        <Text fontSize="xs" color={textSecondary} fontWeight="medium">
                          Leader: <Text as="span" color={textPrimary} fontWeight="semibold">{alliance.leader}</Text>
                        </Text>
                      </HStack>
                      <VStack spacing={1} align="stretch">
                        {alliance.parties.slice(0, 3).map((p) => (
                          <Flex key={p.name} justify="space-between" align="center">
                            <Text fontSize="xs" color={textSecondary} noOfLines={1} flex={1}>{p.name}</Text>
                            <Badge ml={2} colorScheme="gray" fontSize="xs">{p.seats}</Badge>
                          </Flex>
                        ))}
                        {alliance.parties.length > 3 && (
                          <Text fontSize="xs" color={textSecondary}>+{alliance.parties.length - 3} more parties</Text>
                        )}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </Grid>
            </Box>

            {/* BACKGROUND */}
            <Card bg={cardBg} shadow="sm" borderRadius="xl">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" color={textPrimary} mb={4}>
                  Background
                </Heading>
                <VStack align="stretch" spacing={3}>
                  <Box p={4} bg={bgBg} borderRadius="lg" borderLeft="3px solid" borderLeftColor="blue.400">
                    <Text fontSize="sm" color={textPrimary} fontWeight="semibold" mb={1}>
                      2021 Result — TMC Landslide
                    </Text>
                    <Text fontSize="sm" color={textSecondary}>
                      Mamata Banerjee's AITC won 215 out of 294 seats. This is their 3rd consecutive term bid.
                    </Text>
                    <HStack mt={2} spacing={4}>
                      <Box>
                        <Text fontSize="xs" color={textSecondary}>AITC (2021)</Text>
                        <Progress value={(215 / 294) * 100} colorScheme="green" size="sm" borderRadius="full" mt={1} w="140px" />
                        <Text fontSize="xs" color="green.600" fontWeight="bold">215 seats (73%)</Text>
                      </Box>
                      <Box>
                        <Text fontSize="xs" color={textSecondary}>BJP (2021)</Text>
                        <Progress value={(77 / 294) * 100} colorScheme="orange" size="sm" borderRadius="full" mt={1} w="140px" />
                        <Text fontSize="xs" color="orange.600" fontWeight="bold">77 seats (26%)</Text>
                      </Box>
                    </HStack>
                  </Box>
                  <Box p={4} bg={bgGray} borderRadius="lg">
                    <Text fontSize="sm" color={textPrimary} fontWeight="semibold" mb={1}>Assembly Tenure</Text>
                    <Text fontSize="sm" color={textSecondary}>
                      The current West Bengal Legislative Assembly's tenure ends on <strong>7 May 2026</strong>.
                      Elections are constitutionally mandated before that date.
                    </Text>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* FEATURED CANDIDATES */}
            <Box>
              <Flex mb={4} align="center" justify="space-between" wrap="wrap" gap={3}>
                <Heading size="md" fontFamily="'Merriweather', serif" color={textPrimary}>
                  Featured Candidates
                </Heading>
                <InputGroup size="sm" w={{ base: '100%', sm: '280px' }}>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={MdSearch as any} color="gray.400" />
                  </InputLeftElement>
                  <Input
                    id="candidate-search-backup"
                    type="text"
                    placeholder="Search by name, party, constituency…"
                    borderRadius="lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Flex>

              {isLoading && (
                <Center py={12}>
                  <VStack>
                    <Spinner size="xl" color="orange.400" thickness="4px" />
                    <Text color={textSecondary} fontSize="sm">Loading candidates…</Text>
                  </VStack>
                </Center>
              )}
              {!isLoading && fetchError && (
                <Box p={6} borderRadius="xl" bg="orange.50" border="1px solid" borderColor="orange.200" textAlign="center">
                  <Text color="orange.700" fontSize="sm">{fetchError}</Text>
                  <Text color="orange.500" fontSize="xs" mt={1}>
                    Run alembic migrations &amp; seed data to populate this section.
                  </Text>
                </Box>
              )}
              {!isLoading && !fetchError && (
                <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
                  {filteredCandidates.map((pol) => (
                    <RepresentativeCard key={pol.politician_id} pol={pol} partyColors={PARTY_COLORS} />
                  ))}
                  {filteredCandidates.length === 0 && (
                    <Box p={8} textAlign="center" gridColumn={{ base: 'span 1', md: 'span 2' }}>
                      <Text color={textSecondary} fontSize="sm">
                        {candidates.length === 0
                          ? 'No featured candidates yet. Seed the politicians table to show candidates here.'
                          : 'No candidates match your search.'}
                      </Text>
                    </Box>
                  )}
                </Grid>
              )}
            </Box>
          </VStack>

          {/* ── SIDEBAR ── */}
          <VStack spacing={6} align="stretch">

            {/* SEAT DISTRIBUTION PIE */}
            <Card bg={cardBg} shadow="sm" borderRadius="xl">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                  Seats Contested (294 total)
                </Heading>
                <Box h="220px">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={seatPieData} cx="50%" cy="50%"
                        innerRadius="45%" outerRadius="65%"
                        paddingAngle={3} dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                        labelLine={false}>
                        {seatPieData.map((_, i) => (
                          <Cell key={i} fill={seatPieColors[i]} />
                        ))}
                      </Pie>
                      <RechartsTooltip formatter={(val, name) => [`${val} seats`, name]} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <VStack spacing={2} mt={2}>
                  {allianceData.map((a) => (
                    <Flex key={a.name} w="100%" justify="space-between" align="center">
                      <HStack>
                        <Box w="10px" h="10px" borderRadius="sm" bg={a.color} />
                        <Text fontSize="xs" color={textPrimary} fontWeight="medium">{a.name}</Text>
                      </HStack>
                      <Text fontSize="xs" color={textSecondary}>{a.leader}</Text>
                      <Badge fontSize="xs" colorScheme="gray">{a.seats}</Badge>
                    </Flex>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* VOTER STATISTICS */}
            <Card bg={cardBg} shadow="sm" borderRadius="xl">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                  Voter Statistics
                </Heading>
                <VStack spacing={4} align="stretch">
                  <Box p={3} bg={voterStatBg} borderRadius="lg">
                    <Text fontSize="xs" color={textSecondary} mb={1}>Total Eligible (after SIR)</Text>
                    <Text fontSize="xl" fontWeight="black" color="blue.500">6,75,34,952</Text>
                    <Text fontSize="xs" color="red.500" mt={1}>↓ 11.88% (91L voters removed since Oct 2025)</Text>
                  </Box>
                  {voterStats.map((v) => (
                    <Box key={v.label}>
                      <Flex justify="space-between" mb={1}>
                        <Text fontSize="xs" color={textSecondary}>{v.label}</Text>
                        <Text fontSize="xs" fontWeight="bold" color={v.color}>{v.value}</Text>
                      </Flex>
                      <Progress
                        value={(v.raw / 36022642) * 100}
                        size="xs"
                        borderRadius="full"
                        sx={{ '& > div': { background: v.color } }}
                      />
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>

            {/* PHASE BREAKDOWN BAR CHART */}
            <Card bg={cardBg} shadow="sm" borderRadius="xl">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                  Phase-wise Seats
                </Heading>
                <Box h="150px">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { phase: 'Phase 1\n(23 Apr)', seats: 152 },
                      { phase: 'Phase 2\n(29 Apr)', seats: 142 },
                    ]} barSize={50}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                      <XAxis dataKey="phase" tick={{ fontSize: 11 }} />
                      <YAxis domain={[130, 160]} tick={{ fontSize: 11 }} />
                      <RechartsTooltip formatter={(v) => [`${v} constituencies`, 'Seats']} />
                      <Bar dataKey="seats" radius={[6, 6, 0, 0]}>
                        {[{ fill: '#F6AD55' }, { fill: '#9F7AEA' }].map((c, i) => (
                          <Cell key={i} fill={c.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Divider my={3} />
                <VStack spacing={2} fontSize="xs" color={textSecondary}>
                  <Flex w="100%" justify="space-between">
                    <Text>Phase 1 range</Text>
                    <Text fontWeight="medium" color={textPrimary}>1–76, 203–258, 275–294</Text>
                  </Flex>
                  <Flex w="100%" justify="space-between">
                    <Text>Phase 2 range</Text>
                    <Text fontWeight="medium" color={textPrimary}>77–202, 259–274</Text>
                  </Flex>
                </VStack>
              </CardBody>
            </Card>

            {/* KEY FACTS */}
            <Card bg={cardBg} shadow="sm" borderRadius="xl">
              <CardBody>
                <Heading size="sm" fontFamily="'Merriweather', serif" mb={4} color={textPrimary}>
                  Key Facts
                </Heading>
                <VStack spacing={3} align="stretch">
                  {[
                    { label: 'Incumbent CM', value: 'Mamata Banerjee', party: 'AITC', color: 'green' },
                    { label: 'Assembly size', value: '294 seats', party: 'WB Legislature', color: 'blue' },
                    { label: 'Majority mark', value: '148 seats', party: 'Simple majority', color: 'purple' },
                    { label: 'Governor (2026)', value: 'R. N. Ravi', party: 'Retired IPS / IB', color: 'orange' },
                    { label: 'Last election', value: 'Mar–Apr 2021', party: 'TMC won 215/294', color: 'teal' },
                  ].map((f) => (
                    <Flex key={f.label} justify="space-between" align="center"
                      p={2} borderRadius="md" _hover={{ bg: hoverBg }}>
                      <Box>
                        <Text fontSize="xs" color={textSecondary}>{f.label}</Text>
                        <Text fontSize="sm" fontWeight="semibold" color={textPrimary}>{f.value}</Text>
                      </Box>
                      <Badge colorScheme={f.color} fontSize="10px">{f.party}</Badge>
                    </Flex>
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
