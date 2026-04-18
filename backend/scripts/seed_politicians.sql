-- =============================================================
-- Seed script for Lokdarpan politicians + trending issues
-- Run this AFTER `alembic upgrade head` succeeds
-- Usage: psql <your-connection-string> -f seed_politicians.sql
-- =============================================================

-- Insert 3 featured politicians and capture their UUIDs
WITH inserted AS (
  INSERT INTO politicians (name, party, constituency, designation, years_in_office, is_featured, photo_url)
  VALUES
    ('Aditya Thackeray', 'Shiv Sena', 'Worli',        'MLA', 4,  true, 'https://bit.ly/dan-abramov'),
    ('Ashish Shelar',    'BJP',       'Bandra West',   'MLA', 9,  true, 'https://bit.ly/ryan-florence'),
    ('Varsha Gaikwad',   'Congress',  'Dharavi',       'MLA', 19, true, 'https://bit.ly/kent-c-dodds'),
    ('Rahul Narwekar',   'BJP',       'Colaba',        'MLA', 4,  false, 'https://bit.ly/prosper-baba'),
    ('Nawab Malik',      'NCP',       'Anushakti Nagar','MLA',20, false, 'https://bit.ly/ryan-florence')
  RETURNING id, name
)
-- Insert trending issues referencing the newly created politician IDs
INSERT INTO politician_trending_issues (politician_id, issue_label, source_url)
SELECT i.id, issue.label, issue.url
FROM inserted i
JOIN (VALUES
  -- Aditya Thackeray issues
  ('Aditya Thackeray', 'Metro Line 3',       'https://mmrda.maharashtra.gov.in'),
  ('Aditya Thackeray', 'Housing Policy',      NULL),
  ('Aditya Thackeray', 'Tourism Push',        NULL),
  -- Ashish Shelar issues
  ('Ashish Shelar',    'Coastal Road',        'https://mbmcl.in/coastal-road'),
  ('Ashish Shelar',    'Sea Link Extension',  NULL),
  -- Varsha Gaikwad issues
  ('Varsha Gaikwad',   'Dharavi Redevelopment','https://dharaviredevelopment.com'),
  ('Varsha Gaikwad',   'Slum Rehabilitation', NULL),
  ('Varsha Gaikwad',   'Education Funding',   NULL)
) AS issue(name, label, url) ON i.name = issue.name;

-- Verify
SELECT
  p.name,
  p.party,
  p.is_featured,
  COUNT(pti.id) AS issue_count
FROM politicians p
LEFT JOIN politician_trending_issues pti ON pti.politician_id = p.id
GROUP BY p.id, p.name, p.party, p.is_featured
ORDER BY p.name;
