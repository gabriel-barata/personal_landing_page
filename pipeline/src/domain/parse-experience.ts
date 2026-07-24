import type { DatePart, EmployerEntry, Experience, Month, Role } from "schema";
import type { DocLine } from "./doc-line.js";
import type { ParseError } from "./parse-error.js";
import type { Result } from "./result.js";

const SECTION_HEADING = "EXPERIENCE";
const DATE_PATTERN = /^(\d{1,2})\/(\d{4})$/;

interface EmployerBlock {
  heading: DocLine;
  lines: DocLine[];
}

interface RoleGroup {
  roleLine: DocLine;
  achievementLines: DocLine[];
}

/**
 * DocLine[] -> Experience (or undefined, if there's no EXPERIENCE section)
 * or a list of every way the section's content doesn't fit schema/'s model
 * (FR-002-FR-007, FR-010, FR-011; contracts/doc-convention.md).
 */
export function parseExperience(
  lines: DocLine[],
): Result<Experience | undefined, ParseError> {
  const sectionLines = extractSection(lines, SECTION_HEADING);
  if (sectionLines === undefined) {
    return { ok: true, value: undefined };
  }

  const employerBlocks = groupByEmployer(sectionLines);
  if (employerBlocks.length === 0) {
    return { ok: true, value: undefined };
  }

  const errors: ParseError[] = [];
  const employers: EmployerEntry[] = [];

  for (const block of employerBlocks) {
    const result = parseEmployer(block);
    if (result.ok) {
      employers.push(result.value);
    } else {
      errors.push(...result.errors);
    }
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // employerBlocks.length > 0 and every block succeeded, so employers is non-empty.
  const [firstEmployer, ...restEmployers] = employers;
  const value: Experience = [firstEmployer!, ...restEmployers];
  return { ok: true, value };
}

function extractSection(lines: DocLine[], heading: string): DocLine[] | undefined {
  const startIndex = lines.findIndex(
    (line) => line.headingLevel === 1 && line.text === heading,
  );
  if (startIndex === -1) {
    return undefined;
  }

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i++) {
    if (lines[i]!.headingLevel === 1) {
      endIndex = i;
      break;
    }
  }

  return lines.slice(startIndex + 1, endIndex);
}

function groupByEmployer(sectionLines: DocLine[]): EmployerBlock[] {
  const blocks: EmployerBlock[] = [];
  let current: EmployerBlock | undefined;

  for (const line of sectionLines) {
    if (line.headingLevel === 2) {
      current = { heading: line, lines: [] };
      blocks.push(current);
      continue;
    }
    current?.lines.push(line);
  }

  return blocks;
}

function parseEmployer(block: EmployerBlock): Result<EmployerEntry, ParseError> {
  const [name, location = ""] = splitOnTab(block.heading.text);
  const employerPath = `EXPERIENCE > "${name}"`;

  const roleGroups = groupByRole(block.lines);
  if (roleGroups.length === 0) {
    return {
      ok: false,
      errors: [{ path: employerPath, message: "employer has no roles" }],
    };
  }

  const errors: ParseError[] = [];
  const roles: Role[] = [];

  roleGroups.forEach((group, index) => {
    const rolePath = `${employerPath} > role ${index + 1}`;
    const result = parseRole(group, rolePath);
    if (result.ok) {
      roles.push(result.value);
    } else {
      errors.push(...result.errors);
    }
  });

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  // roleGroups.length > 0 and every group succeeded, so roles is non-empty.
  const [firstRole, ...restRoles] = roles;
  return {
    ok: true,
    value: { name, location, roles: [firstRole!, ...restRoles] },
  };
}

function groupByRole(lines: DocLine[]): RoleGroup[] {
  const groups: RoleGroup[] = [];
  let current: RoleGroup | undefined;

  for (const line of lines) {
    if (line.text.trim() === "" && !line.bullet) {
      continue;
    }
    if (!line.bullet) {
      current = { roleLine: line, achievementLines: [] };
      groups.push(current);
      continue;
    }
    current?.achievementLines.push(line);
  }

  return groups;
}

function parseRole(group: RoleGroup, path: string): Result<Role, ParseError> {
  const errors: ParseError[] = [];

  const [titlePart, datePart = ""] = splitOnTab(group.roleLine.text);
  const { title, client } = splitTitleClient(titlePart);

  const dateResult = parseDateRange(datePart, path);
  if (!dateResult.ok) {
    errors.push(...dateResult.errors);
  }

  const achievements = group.achievementLines
    .map((line) => line.text.trim())
    .filter((text) => text.length > 0);

  if (achievements.length === 0) {
    errors.push({ path, message: "role has no achievement bullets" });
  }

  if (errors.length > 0 || !dateResult.ok) {
    return { ok: false, errors };
  }

  const [firstAchievement, ...restAchievements] = achievements;

  return {
    ok: true,
    value: {
      title,
      ...(client !== undefined ? { client } : {}),
      startDate: dateResult.value.startDate,
      ...(dateResult.value.endDate !== undefined
        ? { endDate: dateResult.value.endDate }
        : {}),
      achievements: [firstAchievement!, ...restAchievements],
    },
  };
}

function splitOnTab(text: string): [string, string?] {
  const index = text.indexOf("\t");
  if (index === -1) {
    return [text.trim()];
  }
  return [text.slice(0, index).trim(), text.slice(index + 1).trim()];
}

function splitTitleClient(titlePart: string): { title: string; client?: string } {
  const pipeIndex = titlePart.indexOf("|");
  if (pipeIndex === -1) {
    return { title: titlePart.trim() };
  }
  return {
    title: titlePart.slice(0, pipeIndex).trim(),
    client: titlePart.slice(pipeIndex + 1).trim(),
  };
}

function parseDateRange(
  datePart: string,
  path: string,
): Result<{ startDate: DatePart; endDate?: DatePart }, ParseError> {
  const [startText = "", endText = ""] = datePart.split("-").map((part) => part.trim());

  const startDate = parseDatePart(startText);
  if (startDate === undefined) {
    return {
      ok: false,
      errors: [{ path, message: `start date "${startText}" is not in MM/YYYY form` }],
    };
  }

  if (endText.toLowerCase() === "present") {
    return { ok: true, value: { startDate } };
  }

  const endDate = parseDatePart(endText);
  if (endDate === undefined) {
    return {
      ok: false,
      errors: [
        { path, message: `end date "${endText}" is not in MM/YYYY or "Present" form` },
      ],
    };
  }

  return { ok: true, value: { startDate, endDate } };
}

function parseDatePart(text: string): DatePart | undefined {
  const match = DATE_PATTERN.exec(text);
  if (!match) {
    return undefined;
  }
  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12) {
    return undefined;
  }
  return { month: month as Month, year };
}
