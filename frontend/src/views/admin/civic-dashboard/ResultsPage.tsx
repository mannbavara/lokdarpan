import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import thanosPng from '../../../assets/thanos.png';
import mamtaPng from '../../../assets/mamta.png';
import modiPng from '../../../assets/modi.png';
import fishPng      from '../../../assets/fish.png';
import rasgullaPng  from '../../../assets/rasgulla.png';
import laliJiPng    from '../../../assets/lali_ji.png';
import footballPng  from '../../../assets/football.png';
import messiPng     from '../../../assets/messi.png';
import bus from '../../../assets/bus.png';
import doll from '../../../assets/doll.png';
import nano from '../../../assets/nano.png';
import atree from '../../../assets/atree.png';
import dhoni from '../../../assets/dhoni.png';
import jaya from '../../../assets/jaya.png';
import ambani from '../../../assets/ambani.png';
import adani from '../../../assets/adani.png';
import sonam from '../../../assets/sonam.png';
import andaman from '../../../assets/andaman.png';
import kejri from '../../../assets/kejri.png';
import vedanta from '../../../assets/vedanta.png';
import OrganisingCommittee from '../../../assets/organising_committee.png';
import attractAudio from '../../../assets/audio/landing_page_attract.mp3';
import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { MdArrowBack } from 'react-icons/md';

const T = {
  black:    '#0A0A0A',
  card:     '#141414',
  border:   '#2A2A2A',
  red:      '#E40000',
  white:    '#FFFFFF',
  offWhite: '#E8E8E8',
  muted:    '#888888',
};

// ─── DVD BOUNCE ──────────────────────────────────────────────────────────
const IMG_SIZE = 110;

// Random position within safe bounds, random speed between min/max
const randPos = () => ({
  x: Math.random() * (window.innerWidth  - IMG_SIZE),
  y: Math.random() * (window.innerHeight - IMG_SIZE),
  vx: (Math.random() * 1.4 + 0.8) * (Math.random() < 0.5 ? 1 : -1),
  vy: (Math.random() * 1.4 + 0.8) * (Math.random() < 0.5 ? 1 : -1),
});

function DVDBouncer({ src, alt, size = IMG_SIZE }: { src: string; alt: string; size?: number }) {
  const init   = useRef(randPos());
  const posRef = useRef({ x: init.current.x, y: init.current.y });
  const velRef = useRef({ vx: init.current.vx, vy: init.current.vy });
  const [renderPos, setRenderPos] = useState({ x: init.current.x, y: init.current.y });

  useEffect(() => {
    let id: number;
    let frame = 0;
    const tick = () => {
      const maxX = window.innerWidth  - size;
      const maxY = window.innerHeight - size;
      posRef.current.x += velRef.current.vx;
      posRef.current.y += velRef.current.vy;
      if (posRef.current.x <= 0)    { velRef.current.vx =  Math.abs(velRef.current.vx); posRef.current.x = 0; }
      if (posRef.current.x >= maxX) { velRef.current.vx = -Math.abs(velRef.current.vx); posRef.current.x = maxX; }
      if (posRef.current.y <= 0)    { velRef.current.vy =  Math.abs(velRef.current.vy); posRef.current.y = 0; }
      if (posRef.current.y >= maxY) { velRef.current.vy = -Math.abs(velRef.current.vy); posRef.current.y = maxY; }
      frame++;
      if (frame % 2 === 0) setRenderPos({ ...posRef.current });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [size]);

  return (
    <Box
      as="img"
      src={src}
      alt={alt}
      position="fixed"
      left={`${renderPos.x}px`}
      top={`${renderPos.y}px`}
      w={`${size}px`}
      h={`${size}px`}
      zIndex={2}
      pointerEvents="none"
      userSelect="none"
      style={{ objectFit: 'contain', opacity: 0.75 }}
    />
  );
}

// ─── PAGE ────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const navigate      = useNavigate();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [isFixed, setIsFixed]               = useState(false);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Switch image from in-flow → fixed once sentinel scrolls above navbar
  useEffect(() => {
    const onScroll = () => {
      if (!sentinelRef.current) return;
      const { top } = sentinelRef.current.getBoundingClientRect();
      setIsFixed(top < 110);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleAccept = () => {
    setShowDisclaimer(false);
    const audio = new Audio(attractAudio);
    audio.play().catch(() => {});
    audioRef.current = audio;
  };

  return (
    <Box minH="100vh" bg={T.black} fontFamily="'Inter', sans-serif" color={T.white} position="relative">

      {/* Bouncing figures — zIndex 1, behind all content */}
      <DVDBouncer src={thanosPng}   alt="Thanos"   />
      <DVDBouncer src={mamtaPng}    alt="Mamata"   />
      <DVDBouncer src={modiPng}     alt="Modi"     />
      <DVDBouncer src={fishPng}     alt="Fish"     />
      <DVDBouncer src={rasgullaPng} alt="Rasgulla" />
      <DVDBouncer src={laliJiPng}   alt="Lali Ji"  size={190} />
      <DVDBouncer src={footballPng} alt="Football" />
      <DVDBouncer src={messiPng}    alt="Messi"    />
      <DVDBouncer src={bus}         alt="Bus"      />
      <DVDBouncer src={doll}        alt="Doll"     />
      <DVDBouncer src={nano}        alt="Nano"     />
      <DVDBouncer src={atree}       alt="Atree" size={190}     />
      <DVDBouncer src={dhoni}       alt="Dhoni"      />
      <DVDBouncer src={jaya}        alt="Jaya"      />
      <DVDBouncer src={ambani}      alt="Ambani" size={390}     />
      <DVDBouncer src={adani}       alt="Adani" size={390}     />
      <DVDBouncer src={sonam}       alt="Sonam"      />
      
      <DVDBouncer src={kejri}       alt="Kejri"     />
      <DVDBouncer src={vedanta}     alt="Vedanta"     />

      {/* ── DISCLAIMER MODAL ── */}
      {showDisclaimer && (
        <Box
          position="fixed"
          inset={0}
          zIndex={999}
          display="flex"
          alignItems={{ base: 'flex-end', md: 'center' }}
          justifyContent="center"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
        >
          <Box
            bg={T.card}
            border="1px solid"
            borderColor={T.border}
            borderRadius={{ base: '2xl 2xl 0 0', md: '2xl' }}
            maxW={{ base: '100%', md: '540px' }}
            w="100%"
            maxH={{ base: '90vh', md: '85vh' }}
            display="flex"
            flexDirection="column"
            overflow="hidden"
            style={{ boxShadow: '0 0 60px rgba(228,0,0,0.15)' }}
          >
            {/* Header */}
            <Box bg={T.red} px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }} flexShrink={0}>
              <Text fontSize="10px" color="rgba(255,255,255,0.7)" textTransform="uppercase"
                letterSpacing="widest" mb={1}>Important Notice</Text>
              <Heading fontFamily="'Merriweather', serif"
                fontSize={{ base: 'md', md: 'lg' }} color={T.white} fontWeight="black">
                Legal Disclaimer
              </Heading>
            </Box>

            {/* Scrollable Body */}
            <Box
              px={{ base: 4, md: 6 }}
              py={{ base: 4, md: 6 }}
              overflowY="auto"
              flex={1}
            >
              <VStack spacing={4} align="stretch">
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={T.offWhite} lineHeight="1.7">
                  The election-related information, analysis, projections, and any results displayed
                  on this platform are compiled solely on the basis of independent public research,
                  publicly available data, and community-sourced inputs. They do not represent
                  official results published by the Election Commission of India or any government
                  authority.
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={T.offWhite} lineHeight="1.7">
                  This platform, its operators, contributors, and affiliates expressly disclaim all
                  liability — whether direct, indirect, incidental, or consequential — arising from
                  your reliance on the content herein. The information is provided on an
                  <Text as="span" color={T.white} fontWeight="semibold"> "as-is" and "as-available" </Text>
                  basis, without warranties of any kind, express or implied, including but not
                  limited to accuracy, completeness, or fitness for a particular purpose.
                </Text>
                <Text fontSize={{ base: 'xs', md: 'sm' }} color={T.offWhite} lineHeight="1.7">
                  Any decisions — political, financial, legal, or personal — made on the basis of
                  content on this page are solely at your own risk. Nothing on this platform
                  constitutes legal, electoral, or professional advice of any kind.
                </Text>
                <Box
                  p={3}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor="rgba(228,0,0,0.30)"
                  bg="rgba(228,0,0,0.06)"
                >
                  <Text fontSize="xs" color={T.muted} lineHeight="1.6">
                    By clicking <Text as="span" color={T.white} fontWeight="bold">Okay</Text>,
                    you acknowledge that you have read and understood this disclaimer, and you
                    voluntarily consent to access this content, waiving any claims against this
                    platform or its contributors in connection with the information presented.
                  </Text>
                </Box>
              </VStack>

              {/* Okay button */}
              <Box
                as="button"
                mt={5}
                w="100%"
                py={{ base: 4, md: 3 }}
                bg={T.red}
                color={T.white}
                fontWeight="black"
                fontSize="sm"
                letterSpacing="widest"
                textTransform="uppercase"
                borderRadius="lg"
                transition="all 0.2s"
                _hover={{ bg: '#C20000', transform: 'translateY(-1px)' }}
                _active={{ transform: 'translateY(0)' }}
                onClick={handleAccept}
              >
                Okay, I Understand
              </Box>

              {/* Safe-area bottom padding for iOS devices */}
              <Box h={{ base: 'env(safe-area-inset-bottom, 16px)', md: '0' }} />
            </Box>
          </Box>
        </Box>
      )}

      {/* ── TOP BAR ── */}
      <Box
        w="100%"
        position="fixed"
        top={0}
        left={0}
        zIndex={100}
        bg="rgba(10,10,10,0.92)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor={T.border}
        px={{ base: 4, md: 8 }}
        py={3}
      >
        <Flex maxW="1400px" mx="auto" align="center" justify="space-between">
          <HStack spacing={3}>
            <Box
              as="button"
              onClick={() => navigate('/')}
              display="flex"
              alignItems="center"
              gap={2}
              color={T.muted}
              fontSize="sm"
              fontWeight="medium"
              _hover={{ color: T.white }}
              transition="color 0.2s"
            >
              <Icon as={MdArrowBack as any} w="16px" h="16px" />
              Back
            </Box>
            <Box w="1px" h="16px" bg={T.border} />
            <Text fontSize="sm" color={T.muted} fontWeight="medium">Election Results</Text>
          </HStack>
        </Flex>
      </Box>

      {/* ── HERO BANNER ── */}
      <Box
        pt="80px"
        pb={0}
        px={{ base: 4, md: 8 }}
        borderBottom="1px solid"
        borderColor={T.border}
        position="relative"
        overflow="hidden"
        zIndex={2}
        bg={T.black}
      >
      
        <Box maxW="1400px" mx="auto">
          <Text fontSize="10px" color={T.red} fontWeight="black" textTransform="uppercase"
            letterSpacing="widest" mb={3}>
            West Bengal Assembly Election 2026
          </Text>
          <Heading fontFamily="'Merriweather', serif" fontWeight="black"
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} color={T.white} lineHeight="1.2">
            Election Results
            <Box as="span" display="inline-block" bg={T.red} color={T.white}
              px={3} py={1} ml={4} fontSize={{ base: 'xl', md: '2xl' }}
              fontFamily="'Merriweather', serif" fontWeight="black" letterSpacing="tight"
              verticalAlign="middle">
              4 May 2026
            </Box>
          </Heading>
          <Text color={T.muted} fontSize="sm" mt={3}>
            Results will be announced soon. You still have time, please make a difference.
          </Text>
        </Box>
      </Box>

      {/* ── MAIN CONTENT ── */}
      <Box maxW="1400px" mx="auto" px={{ base: 4, md: 8 }} pt={4} pb={12}>
        <VStack spacing={10} align="stretch">

          {/* IMAGE — in-flow on load, fixed once scrolled past */}
          {/* Fixed overlay — shown after scroll */}
          {isFixed && (
            <Box
              position="fixed"
              top="50%"
              left="50%"
              zIndex={3}
              pointerEvents="none"
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <Box
                as="img"
                src={OrganisingCommittee}
                alt="Election Co-ordinators"
                style={{
                  maxWidth: '420px',
                  width: '90vw',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </Box>
          )}

          {/* Sentinel — always in flow, image shown inline when not yet fixed */}
          <Box
            ref={sentinelRef as any}
            position="relative"
            w="100%"
            display="flex"
            justifyContent="center"
            py={8}
            minH="360px"
            zIndex={3}
          >
            {!isFixed && (
              <Box
                as="img"
                src={OrganisingCommittee}
                alt="Election Co-ordinators"
                style={{
                  maxWidth: '480px',
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            )}
          </Box>

          {/* PLACEHOLDER SECTIONS */}
          {[
            { title: 'Party-wise Seat Tally',  sub: 'Coming soon.' },
            { title: 'Constituency Results',   sub: 'Coming soon.' },
            { title: 'Swing Analysis',         sub: 'Coming soon.' },
            { title: 'Voter Turnout',          sub: 'Coming soon.' },
          ].map((section) => (
            <Box key={section.title}
              bg={T.card} border="1px solid" borderColor={T.border}
              borderRadius="xl" p={6} transition="all 0.2s"
              _hover={{ borderColor: T.red }}>
              <HStack mb={4}>
                <Box w="3px" h="18px" bg={T.red} borderRadius="full" />
                <Heading size="sm" fontFamily="'Merriweather', serif" color={T.white}>
                  {section.title}
                </Heading>
              </HStack>
              <Text fontSize="sm" color={T.muted} mb={6}>{section.sub}</Text>
              <VStack spacing={2} align="stretch">
                {[...Array(3)].map((_, i) => (
                  <Box key={i} h="36px" borderRadius="md" opacity={1 - i * 0.2}
                    style={{
                      background: `linear-gradient(90deg, #1C1C1C ${i * 15}%, #242424 50%, #1C1C1C ${100 - i * 10}%)`,
                    }}
                  />
                ))}
              </VStack>
              <Box mt={4} display="inline-block" px={3} py="6px"
                border="1px solid" borderColor={T.border}
                borderRadius="sm" fontSize="xs" color={T.muted}
                style={{ cursor: 'default' }}>
                Results will be published on 4 May 2026.
              </Box>
            </Box>
          ))}

        </VStack>
      </Box>
    </Box>
  );
}
