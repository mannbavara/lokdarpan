import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { MdChevronRight, MdLocationOn, MdLocalFireDepartment } from 'react-icons/md';
import { FeaturedRepresentative } from '../../types/representative';

interface RepresentativeCardProps {
  pol: FeaturedRepresentative;
  partyColors: Record<string, string>;
}

/**
 * RepresentativeCard
 *
 * Renders one politician card on the civic dashboard landing page.
 * Shows name, party, constituency, designation, years in office,
 * and — when present — up to 3 trending-issue pills.
 *
 * Trending issues section is hidden entirely when the list is empty.
 */
export default function RepresentativeCard({ pol, partyColors }: RepresentativeCardProps) {
  const textPrimary = useColorModeValue('gray.800', 'white');
  const textSecondary = useColorModeValue('gray.600', 'gray.300');
  const cardBg = useColorModeValue('white', 'gray.800');
  const issuePillBg = useColorModeValue('orange.50', 'whiteAlpha.100');
  const issuePillColor = useColorModeValue('orange.700', 'orange.200');
  const issuePillBorder = useColorModeValue('orange.200', 'orange.700');

  const partyColor = partyColors[pol.party ?? ''] || '#718096';
  const displayIssues = pol.trending_issues.slice(0, 3);
  const extraCount = pol.trending_issues.length - 3;
  const hasIssues = displayIssues.length > 0;

  return (
    <Card
      bg={cardBg}
      shadow="sm"
      borderRadius="md"
      overflow="hidden"
      borderLeft="4px solid"
      borderLeftColor={partyColor}
      transition="all 0.2s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
    >
      <CardBody>
        {/* ── Top section: avatar + info ── */}
        <Flex justify="space-between" align="flex-start">
          <HStack spacing={4}>
            <Avatar
              size="lg"
              name={pol.name}
              src={pol.photo_url ?? undefined}
            />
            <Box>
              <Heading size="sm" color={textPrimary} mb={1}>
                {pol.name}
              </Heading>
              <Badge
                bg={partyColor + '20'}
                color={partyColor}
                px={2}
                borderRadius="sm"
                mb={2}
              >
                {pol.party}
              </Badge>
              <HStack fontSize="sm" color={textSecondary} spacing={4}>
                <HStack spacing={1}>
                  <Icon as={MdLocationOn as any} w="14px" h="14px" />
                  <Text>{pol.constituency}</Text>
                </HStack>
                <Text>•</Text>
                <Text>{pol.designation}</Text>
              </HStack>
              <Text fontSize="xs" color="gray.400" mt={1}>
                {pol.years_in_office} years in office
              </Text>
            </Box>
          </HStack>
        </Flex>

        {/* ── Trending issues section — hidden when empty ── */}
        {hasIssues && (
          <>
            <Divider my={4} />
            <HStack spacing={2} align="flex-start">
              <Icon
                as={MdLocalFireDepartment as any}
                color="orange.400"
                w="16px"
                h="16px"
                mt="2px"
                flexShrink={0}
              />
              <Wrap spacing={2}>
                {displayIssues.map((issue) => (
                  <WrapItem key={issue.id}>
                    <Tag
                      size="sm"
                      bg={issuePillBg}
                      color={issuePillColor}
                      border="1px solid"
                      borderColor={issuePillBorder}
                      borderRadius="full"
                      px={2}
                      cursor={issue.source_url ? 'pointer' : 'default'}
                      onClick={() => issue.source_url && window.open(issue.source_url, '_blank')}
                      _hover={issue.source_url ? { opacity: 0.8 } : {}}
                      transition="opacity 0.15s"
                    >
                      <TagLabel fontSize="11px" fontWeight="medium">
                        {issue.issue_label}
                      </TagLabel>
                    </Tag>
                  </WrapItem>
                ))}
                {/* +N more badge — defensive, API already limits to 3 */}
                {extraCount > 0 && (
                  <WrapItem>
                    <Tag
                      size="sm"
                      bg="gray.100"
                      color="gray.500"
                      borderRadius="full"
                      px={2}
                    >
                      <TagLabel fontSize="11px">+{extraCount} more</TagLabel>
                    </Tag>
                  </WrapItem>
                )}
              </Wrap>
            </HStack>
          </>
        )}

        <Divider my={4} />
        <Button
          w="100%"
          variant="ghost"
          colorScheme="blue"
          size="sm"
          rightIcon={<Icon as={MdChevronRight as any} w="16px" h="16px" />}
        >
          View Profile
        </Button>
      </CardBody>
    </Card>
  );
}
