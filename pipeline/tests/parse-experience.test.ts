import assert from "node:assert/strict";
import { test } from "node:test";
import type { DocLine } from "../src/domain/doc-line.js";
import { parseExperience } from "../src/domain/parse-experience.js";
import singleRole from "./fixtures/experience-single-role.json" with { type: "json" };
import multiRole from "./fixtures/experience-multi-role.json" with { type: "json" };
import employerOrder from "./fixtures/experience-employer-order.json" with { type: "json" };
import employerNoRoles from "./fixtures/experience-employer-no-roles.json" with { type: "json" };
import roleNoAchievements from "./fixtures/experience-role-no-achievements.json" with { type: "json" };
import badDate from "./fixtures/experience-bad-date.json" with { type: "json" };
import multipleErrors from "./fixtures/experience-multiple-errors.json" with { type: "json" };

test("parseExperience: single-role employer (quickstart #1)", () => {
  const result = parseExperience(singleRole as DocLine[]);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.deepEqual(result.value, [
    {
      name: "ACME CORP",
      location: "Remote",
      roles: [
        {
          title: "Senior Engineer",
          startDate: { month: 1, year: 2023 },
          endDate: { month: 12, year: 2024 },
          achievements: [
            "Led the migration of the legacy platform to a new stack",
            "Reduced infrastructure costs by 30%",
          ],
        },
      ],
    },
  ]);
});

test("parseExperience: multi-role employer, one role ongoing (quickstart #2, #3)", () => {
  const result = parseExperience(multiRole as DocLine[]);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.value?.length, 1);
  const employer = result.value?.[0];
  assert.equal(employer?.name, "GLOBEX CONSULTING");
  assert.equal(employer?.location, "London, UK");
  assert.equal(employer?.roles.length, 2);

  const [firstRole, secondRole] = employer!.roles;
  assert.equal(firstRole?.client, "Northwind");
  assert.equal(firstRole?.endDate, undefined);
  assert.deepEqual(firstRole?.startDate, { month: 1, year: 2023 });

  assert.equal(secondRole?.client, "Southgate");
  assert.deepEqual(secondRole?.startDate, { month: 6, year: 2021 });
  assert.deepEqual(secondRole?.endDate, { month: 12, year: 2022 });
});

test("parseExperience: employer order matches Doc order (quickstart #4)", () => {
  const result = parseExperience(employerOrder as DocLine[]);

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.deepEqual(
    result.value?.map((employer) => employer.name),
    ["FIRST CO", "SECOND CO", "THIRD CO"],
  );
});

test("parseExperience: employer with no roles is a ParseError (quickstart #7)", () => {
  const result = parseExperience(employerNoRoles as DocLine[]);

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    { path: 'EXPERIENCE > "EMPTY CO"', message: "employer has no roles" },
  ]);
});

test("parseExperience: role with no achievements is a ParseError (quickstart #8)", () => {
  const result = parseExperience(roleNoAchievements as DocLine[]);

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    {
      path: 'EXPERIENCE > "SILENT CO" > role 1',
      message: "role has no achievement bullets",
    },
  ]);
});

test("parseExperience: unparseable date is a ParseError (quickstart #9)", () => {
  const result = parseExperience(badDate as DocLine[]);

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    {
      path: 'EXPERIENCE > "TIMEWARP CO" > role 1',
      message: 'start date "March 2019" is not in MM/YYYY form',
    },
  ]);
});

test("parseExperience: reports every defect at once, not just the first (quickstart #11)", () => {
  const result = parseExperience(multipleErrors as DocLine[]);

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.deepEqual(result.errors, [
    { path: 'EXPERIENCE > "EMPTY CO"', message: "employer has no roles" },
    {
      path: 'EXPERIENCE > "SILENT CO" > role 1',
      message: "role has no achievement bullets",
    },
    {
      path: 'EXPERIENCE > "TIMEWARP CO" > role 1',
      message: 'start date "March 2019" is not in MM/YYYY form',
    },
  ]);
});
