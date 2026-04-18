import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import havdaBridge from '../../../assets/havdaBridge.png';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Divider,
  Wrap,
  WrapItem,
  Tooltip,
} from '@chakra-ui/react';
import {
  MdHowToVote,
  MdPeople,
  MdDateRange,
  MdBarChart,
  MdSecurity,
  MdGavel,
  MdMoneyOff,
  MdFemale,
  MdWork,
  MdPublic,
  MdFlagCircle,
  MdWarning,
} from 'react-icons/md';

// ─── DESIGN TOKENS (Airtel Black ✕ Election) ──────────────────────────────
const T = {
  black:      '#0A0A0A',   // deep matte black
  card:       '#141414',   // card surface
  cardHover:  '#1C1C1C',   // card hover
  border:     '#2A2A2A',   // subtle border
  red:        '#E40000',   // Airtel red
  redDim:     '#A80000',   // dimmed red
  gold:       '#C8A84B',   // premium gold accent
  white:      '#FFFFFF',
  offWhite:   '#E8E8E8',
  muted:      '#888888',
  mutedDark:  '#555555',
};

// ─── STATIC DATA ───────────────────────────────────────────────────────────
const politicalIssues = [
  { label: 'National Security',   icon: MdSecurity,    desc: 'Bangladesh border, Siliguri Corridor, illegal immigration' },
  { label: 'CAA / NRC / SIR',     icon: MdGavel,       desc: 'Citizenship Amendment Act & Special Intensive Revision fears' },
  { label: 'Demographic Shifts',  icon: MdPublic,      desc: 'Religious polarisation, Hindutva vs AITC appeasement debate' },
  { label: 'Bengali Nationalism', icon: MdFlagCircle,  desc: "AITC nativism vs BJP cultural homogenisation" },
  { label: 'AITC Corruption',     icon: MdMoneyOff,    desc: 'SSC scam, cattle scam, ration scam, Messi event controversy' },
  { label: "Women's Safety",      icon: MdFemale,      desc: 'RG Kar case and ongoing safety concerns statewide' },
  { label: 'Economic Stagnation', icon: MdWork,        desc: 'WBCS delay, stalled PSU hiring, MNCs avoiding West Bengal' },
  { label: 'Anti-incumbency',     icon: MdWarning,     desc: '15 years of AITC rule — voter fatigue factor' },
];

const electionSchedule = {
  phase1: [
    { aspect: 'Date of Poll',     detail: 'April 23, 2026 (Thursday)' },
    { aspect: 'Constituencies',   detail: '152' },
    { aspect: 'Counting Date',    detail: 'May 4, 2026' },
    { aspect: 'Process Complete', detail: 'May 6, 2026' },
  ],
  phase2: [
    { aspect: 'Date of Poll',     detail: 'April 29, 2026 (Wednesday)' },
    { aspect: 'Constituencies',   detail: '142' },
    { aspect: 'Counting Date',    detail: 'May 4, 2026' },
    { aspect: 'Process Complete', detail: 'May 6, 2026' },
  ],
};

// ─── COUNTDOWN HOOK ────────────────────────────────────────────────────────
function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, past: false });
  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, past: true }); return; }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        past: false,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

const PHASE1_DATE   = new Date(2026, 3, 23);
const PHASE2_DATE   = new Date(2026, 3, 29);
const COUNTING_DATE = new Date(2026, 4,  4);

// ─── SHARED CARD STYLE ─────────────────────────────────────────────────────
const cardStyle = {
  bg: T.card,
  border: '1px solid',
  borderColor: T.border,
  borderRadius: 'xl',
};

// ─── COMPONENT ────────────────────────────────────────────────────────────
export default function CivicDashboard() {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const navigate = useNavigate();

  const phase1Countdown   = useCountdown(PHASE1_DATE);
  const phase2Countdown   = useCountdown(PHASE2_DATE);
  const countingCountdown = useCountdown(COUNTING_DATE);

  // ── Countdown card sub-components ──
  const CountdownCard = ({
    label, accentColor, countdown, doneText,
  }: { label: string; accentColor: string; countdown: ReturnType<typeof useCountdown>; doneText: string }) => (
    <Box
      bg="rgba(255,255,255,0.07)"
      border="1px solid"
      borderColor="rgba(255,255,255,0.12)"
      borderRadius="xl"
      p={4}
      backdropFilter="blur(12px)"
      w="100%"
      transition="all 0.2s"
      _hover={{ bg: 'rgba(255,255,255,0.10)', borderColor: T.red }}
    >
      <Text fontSize="10px" color={accentColor} fontWeight="bold" textTransform="uppercase"
        letterSpacing="widest" mb={3} textAlign="center">
        {countdown.past ? doneText : label}
      </Text>
      {countdown.past ? (
        <Text fontSize="sm" color="whiteAlpha.600" textAlign="center">{doneText}</Text>
      ) : (
        <Flex justify="center" w="100%">
          <HStack spacing={3} align="flex-end">
            <Box textAlign="center">
              <Text fontSize={{ base: '3xl', md: '4xl' }} fontWeight="black" color={T.white} lineHeight="1"
                style={{ fontVariantNumeric: 'tabular-nums' }}>
                {String(countdown.days).padStart(2, '0')}
              </Text>
              <Text fontSize="8px" color={T.muted} textTransform="uppercase" letterSpacing="widest" mt="2px">Days</Text>
            </Box>
            <Text color={T.red} fontSize="2xl" fontWeight="bold" pb="16px" lineHeight="1">·</Text>
            <Box textAlign="center" pb="2px">
              <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="bold" color={T.offWhite}
                fontFamily="mono" letterSpacing="tight" lineHeight="1"
                style={{ fontVariantNumeric: 'tabular-nums' }}>
                {String(countdown.hours).padStart(2, '0')}
                <Text as="span" color={T.mutedDark}>:</Text>
                {String(countdown.minutes).padStart(2, '0')}
                <Text as="span" color={T.mutedDark}>:</Text>
                {String(countdown.seconds).padStart(2, '0')}
              </Text>
              <Text fontSize="8px" color={T.muted} textTransform="uppercase" letterSpacing="widest" mt="2px">
                Hrs · Min · Sec
              </Text>
            </Box>
          </HStack>
        </Flex>
      )}
    </Box>
  );

  return (
    <Box minH="100vh" bg={T.black} pb={16} fontFamily="'Inter', sans-serif">

      {/* ── HERO ── */}
      <Box
        w="100%"
        color={T.white}
        pt={{ base: '110px', md: '90px' }}
        pb="80px"
        px={{ base: 4, md: 8 }}
        position="relative"
        overflow="hidden"
        style={{
          backgroundImage: `url(${havdaBridge})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Gradient overlay — bottom-heavy dark for legibility */}
        <Box position="absolute" inset={0} zIndex={0}
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)' }} />
        {/* Red left-edge accent line */}
        <Box position="absolute" left={0} top={0} bottom={0} w="4px" bg={T.red} zIndex={1} />

        <Flex maxW="1400px" mx="auto" direction={{ base: 'column', lg: 'row' }}
          justify="space-between" align={{ base: 'flex-start', lg: 'center' }}
          gap={8} position="relative" zIndex={2}>

          {/* Left: Title */}
          <Box>


            <Heading as="h1" fontFamily="'Merriweather', serif" fontWeight="black"
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} lineHeight="1.15" mb={3}>
              West Bengal
              <br />
              <Box
                as="span"
                display="inline-block"
                bg={T.red}
                color={T.white}
                px={3}
                py={1}
                mt={2}
                fontFamily="'Merriweather', serif"
                fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
                fontWeight="black"
                letterSpacing="tight"
                lineHeight="1.2"
              >
                Assembly Election 2026
              </Box>
            </Heading>

            <Text color={T.muted} fontSize="sm" mt={3} letterSpacing="wide">
              294 Seats · 2 Phases · 67.5 Million Voters · Results: 4 May 2026
            </Text>
          </Box>

          {/* Right: Countdown grid */}
          <Grid
            templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)' }}
            templateRows={{ sm: 'repeat(2, auto)' }}
            gap={3}
            w={{ base: '100%', lg: '520px' }}
          >
            <Box gridColumn="1" gridRow="1">
              <CountdownCard label="Phase 1 · 23 Apr 2026" accentColor={T.gold}
                countdown={phase1Countdown} doneText="Phase 1 — 152 seats done" />
            </Box>
            <Box gridColumn="1" gridRow="2">
              <CountdownCard label="Phase 2 · 29 Apr 2026" accentColor={T.muted}
                countdown={phase2Countdown} doneText="Phase 2 — 142 seats done" />
            </Box>

            {/* Results — spans both rows, clickable */}
            <Box gridColumn={{ base: '1', sm: '2' }} gridRow={{ sm: '1 / span 2' }}>
              <Box
                bg="rgba(228,0,0,0.10)"
                border="1px solid"
                borderColor="rgba(228,0,0,0.30)"
                borderRadius="xl"
                p={5}
                backdropFilter="blur(12px)"
                h="100%"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                textAlign="center"
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  bg: 'rgba(228,0,0,0.18)',
                  borderColor: T.red,
                  transform: 'translateY(-2px)',
                }}
                onClick={() => navigate('/results')}
                role="button"
                aria-label="View Election Results"
              >
                <Text fontSize="10px" color={T.red} fontWeight="black"
                  textTransform="uppercase" letterSpacing="widest" mb={4}>
                  {countingCountdown.past ? 'Results Declared' : 'Results'}
                </Text>
                {countingCountdown.past ? (
                  <Text fontSize="sm" color={T.muted}>All 294 seats counted</Text>
                ) : (
                  <VStack spacing={1} align="center">
                    <Text fontSize={{ base: '5xl', md: '7xl' }} fontWeight="black"
                      color={T.white} lineHeight="1"
                      style={{ fontVariantNumeric: 'tabular-nums' }}>
                      {String(countingCountdown.days).padStart(2, '0')}
                    </Text>
                    <Text fontSize="9px" color={T.muted} textTransform="uppercase" letterSpacing="widest">Days to go</Text>
                    <Box mt={3} px={3} py={1} bg={T.red} borderRadius="sm">
                      <Text fontSize="10px" color={T.white} fontWeight="bold" letterSpacing="wide">4 May 2026</Text>
                    </Box>
                    <Text fontSize="9px" color={T.muted} mt={2}>Tap to view results →</Text>
                  </VStack>
                )}
              </Box>
            </Box>
          </Grid>
        </Flex>
      </Box>

      {/* ── BODY ── */}
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} mt="-28px" position="relative" zIndex={2}>

        {/* STATS BAR */}
        <Grid templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }} gap={3} mb={10}>
          {[
            { label: 'Total Seats',     value: '294',         sub: '2-phase election',    icon: MdHowToVote },
            { label: 'Eligible Voters', value: '6.75 Cr',    sub: 'After SIR revision',  icon: MdPeople },
            { label: 'Constituencies',  value: '152 + 142',  sub: 'Phase 1 + Phase 2',   icon: MdBarChart },
            { label: 'Result Date',     value: '4 May 2026', sub: 'Vote counting begins', icon: MdDateRange },
          ].map((s, i) => (
            <Box key={i} {...cardStyle}
              borderTop="2px solid" borderTopColor={T.red}
              p={4} transition="all 0.2s"
              _hover={{ bg: T.cardHover, transform: 'translateY(-2px)', borderColor: T.red }}>
              <HStack color={T.red} mb={2}>
                <Icon as={s.icon as any} w="16px" h="16px" />
                <Text fontSize="9px" fontWeight="bold" textTransform="uppercase" letterSpacing="widest" color={T.muted}>
                  {s.label}
                </Text>
              </HStack>
              <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="black" color={T.white}>{s.value}</Text>
              <Text fontSize="10px" color={T.mutedDark} mt={1}>{s.sub}</Text>
            </Box>
          ))}
        </Grid>

        <Grid templateColumns="1fr" gap={6}>
          <VStack spacing={6} align="stretch">

            {/* KEY POLITICAL ISSUES */}
            <Box {...cardStyle} p={6}>
              <HStack mb={5}>
                <Box w="3px" h="18px" bg={T.red} borderRadius="full" />
                <Heading size="sm" fontFamily="'Merriweather', serif" color={T.white} letterSpacing="tight">
                  Key Political Issues — WB 2026
                </Heading>
              </HStack>
              <Wrap spacing={2}>
                {politicalIssues.map((issue) => (
                  <WrapItem key={issue.label}>
                    <Tooltip label={issue.desc} placement="top" hasArrow borderRadius="md"
                      bg={T.card} color={T.offWhite} border="1px solid" borderColor={T.border}>
                      <Box
                        as="button"
                        px={3} py="6px"
                        borderRadius="sm"
                        fontSize="xs"
                        fontWeight="semibold"
                        letterSpacing="wide"
                        cursor="pointer"
                        transition="all 0.2s"
                        border="1px solid"
                        borderColor={selectedIssue === issue.label ? T.red : T.border}
                        bg={selectedIssue === issue.label ? T.red : 'transparent'}
                        color={selectedIssue === issue.label ? T.white : T.muted}
                        _hover={{ borderColor: T.red, color: T.white }}
                        onClick={() => setSelectedIssue(selectedIssue === issue.label ? null : issue.label)}
                      >
                        <HStack spacing={1}>
                          <Icon as={issue.icon as any} w="12px" h="12px" />
                          <Text>{issue.label}</Text>
                        </HStack>
                      </Box>
                    </Tooltip>
                  </WrapItem>
                ))}
              </Wrap>
              {selectedIssue && (
                <Box mt={4} p={4} bg={T.cardHover} borderRadius="lg"
                  borderLeft="3px solid" borderLeftColor={T.red}>
                  <Text fontSize="sm" color={T.white} fontWeight="semibold" mb={1}>{selectedIssue}</Text>
                  <Text fontSize="sm" color={T.muted}>
                    {politicalIssues.find(i => i.label === selectedIssue)?.desc}
                  </Text>
                </Box>
              )}
            </Box>

            {/* ELECTION SCHEDULE */}
            <Box {...cardStyle} p={6}>
              <HStack mb={5}>
                <Box w="3px" h="18px" bg={T.red} borderRadius="full" />
                <Heading size="sm" fontFamily="'Merriweather', serif" color={T.white} letterSpacing="tight">
                  Election Schedule
                </Heading>
              </HStack>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>

                {/* Phase 1 */}
                <Box border="1px solid" borderColor={T.border} borderRadius="lg" overflow="hidden">
                  <Box bg={T.red} px={4} py={2}>
                    <Text fontWeight="bold" fontSize="sm" color={T.white} textAlign="center" letterSpacing="wide">
                      Phase I (AC 1–76, 203–258, 275–294)
                    </Text>
                  </Box>
                  <VStack spacing={0} align="stretch" divider={<Divider borderColor={T.border} />}>
                    {electionSchedule.phase1.map((row) => (
                      <Flex key={row.aspect} px={4} py="10px" justify="space-between" align="center"
                        bg={row.aspect === 'Date of Poll' ? 'rgba(228,0,0,0.08)' : 'transparent'}>
                        <Text fontSize="xs" color={T.muted} fontWeight="medium">{row.aspect}</Text>
                        <Text fontSize="xs" color={row.aspect === 'Date of Poll' ? T.white : T.offWhite}
                          fontWeight={row.aspect === 'Date of Poll' ? 'bold' : 'normal'}
                          textAlign="right">{row.detail}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

                {/* Phase 2 */}
                <Box border="1px solid" borderColor={T.border} borderRadius="lg" overflow="hidden">
                  <Box bg={T.redDim} px={4} py={2}>
                    <Text fontWeight="bold" fontSize="sm" color={T.white} textAlign="center" letterSpacing="wide">
                      Phase II (AC 77–202, 259–274)
                    </Text>
                  </Box>
                  <VStack spacing={0} align="stretch" divider={<Divider borderColor={T.border} />}>
                    {electionSchedule.phase2.map((row) => (
                      <Flex key={row.aspect} px={4} py="10px" justify="space-between" align="center"
                        bg={row.aspect === 'Date of Poll' ? 'rgba(168,0,0,0.08)' : 'transparent'}>
                        <Text fontSize="xs" color={T.muted} fontWeight="medium">{row.aspect}</Text>
                        <Text fontSize="xs" color={row.aspect === 'Date of Poll' ? T.white : T.offWhite}
                          fontWeight={row.aspect === 'Date of Poll' ? 'bold' : 'normal'}
                          textAlign="right">{row.detail}</Text>
                      </Flex>
                    ))}
                  </VStack>
                </Box>

              </Grid>
            </Box>

          </VStack>
        </Grid>
      </Box>
    </Box>
  );
}
