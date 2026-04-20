# Playwright API Test Framework

[![Playwright API Tests](https://github.com/PiyushSinghal-QA/playwright-api-tests/actions/workflows/api-tests.yml/badge.svg)](https://github.com/PiyushSinghal-QA/playwright-api-tests/actions/workflows/api-tests.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.48-green.svg)](https://playwright.dev/)

A modern **API test automation framework** using **Playwright's native API testing capabilities** with **TypeScript**, JSON schema validation, and GitHub Actions CI/CD.

This project demonstrates a lighter-weight alternative to traditional Java-based API testing stacks — letting teams run UI and API tests in the same toolchain, language, and CI pipeline.

---

## Why Playwright for API Testing?

Most teams reach for REST Assured (Java) or Supertest (Node) for API tests, then Playwright for UI. That means two frameworks, two languages, two CI configurations, two sets of patterns to learn.

**Playwright's built-in `request` API unifies this.** If your UI tests are already in Playwright + TypeScript, your API tests can live in the same repo, use the same fixtures, and share the same utilities. Fewer moving parts, faster onboarding, one test report.

This framework showcases that approach.

---

## Key Features

- **Native Playwright API testing** — no extra HTTP libraries (axios, got, supertest) needed
- **TypeScript-first** — full type safety for requests, responses, and schemas
- **JSON Schema validation** with Ajv — contract testing catches breaking API changes
- **Custom fixtures** — extensible request context for auth, logging, or custom behavior
- **Full CRUD coverage** — GET, POST, PUT, PATCH, DELETE demonstrated
- **E2E workflow tests** — chained API calls that simulate real user journeys
- **Data-driven testing** — same test logic, multiple scenarios
- **Test tagging** — `@smoke`, `@regression`, `@negative` for selective execution
- **Parallel execution** — tests run concurrently by default
- **Rich reporting** — HTML, JSON, JUnit, and list reporters
- **CI/CD ready** — GitHub Actions workflow with fast smoke-test PR feedback

---

## Project Structure

```
playwright-api-tests/
├── .github/workflows/
│   └── api-tests.yml            # CI/CD pipeline
├── config/
│   └── testData.ts              # Centralized test data
├── fixtures/
│   └── apiFixture.ts            # Custom request context fixture
├── schemas/
│   ├── user.schema.json         # Contract schema for User endpoint
│   └── post.schema.json         # Contract schema for Post endpoint
├── tests/
│   ├── users.spec.ts            # GET /users tests + schema validation
│   ├── posts.spec.ts            # Full CRUD for /posts
│   └── workflows.spec.ts        # E2E chained API calls
├── utils/
│   ├── endpoints.ts             # Centralized endpoint paths
│   ├── types.ts                 # TypeScript interfaces for API models
│   └── schemaValidator.ts       # Ajv-based JSON schema validator
├── .env.example                 # Environment variable template
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

## Quick Start

### Prerequisites
- Node.js 18 or higher

### Installation

```bash
git clone https://github.com/PiyushSinghal-QA/playwright-api-tests.git
cd playwright-api-tests

npm install
cp .env.example .env
```

### Running tests

```bash
# Run full suite
npm test

# Run only smoke tests (fast, for PR validation)
npm run test:smoke

# Run regression suite
npm run test:regression

# Debug a specific test
npm run test:debug

# Open UI mode for interactive debugging
npm run test:ui

# View the HTML report after a run
npm run report
```

---

## Architecture Highlights

### Native Playwright API testing — no extra libraries

Playwright's `request` fixture provides a full HTTP client. No axios, no supertest, no request, no got. Cleaner dependency tree, one less thing to learn:

```typescript
test('should create a post', async ({ apiContext }) => {
  const response = await apiContext.post('/posts', {
    data: { userId: 1, title: 'Test', body: 'Content' },
  });

  expect(response.status()).toBe(201);

  const created = await response.json();
  expect(created.id).toBeDefined();
});
```

### JSON Schema validation with Ajv

Contract tests catch breaking API changes automatically. Schemas are stored as JSON files, not inline — they can be shared with backend teams or generated from OpenAPI specs:

```typescript
const response = await apiContext.get('/users/1');
const user = await response.json();

// If the backend changes the response shape, this fails immediately
schemaValidator.validate('user', userSchema, user);
```

### Type-safe requests and responses

TypeScript interfaces model the API. Mistyped fields show up at compile time, not runtime:

```typescript
import { Post, CreatePostRequest } from '../utils/types';

const payload: CreatePostRequest = {
  userId: 1,
  title: 'Typed payload',
  body: 'Compiler enforces structure',
};

const created: Post = await response.json();
```

### Data-driven tests via loops

No heavyweight data provider framework needed — just a plain `for` loop generates one test case per scenario:

```typescript
for (const { id, scenario } of invalidUserIds) {
  test(`should return 404 for: ${scenario}`, async ({ apiContext }) => {
    const response = await apiContext.get(`/users/${id}`);
    expect(response.status()).toBe(404);
  });
}
```

### E2E workflow tests

Realistic multi-step scenarios catch integration issues that isolated endpoint tests miss:

```typescript
test('get user → list their posts → create new post for them', async ({ apiContext }) => {
  const user = await (await apiContext.get('/users/1')).json();
  const posts = await (await apiContext.get('/posts', { params: { userId: user.id } })).json();
  const created = await apiContext.post('/posts', { data: { userId: user.id, ... } });
  // Assertions at each step
});
```

---

## Test Coverage

| Area          | Tests | Coverage |
|---------------|-------|----------|
| GET /users    | 6+    | List, single, schema validation, filtering, negative cases |
| Posts CRUD    | 7     | GET, POST, PUT, PATCH, DELETE, long content, relationships |
| E2E Workflows | 2     | User → Posts chains, full CRUD lifecycle |

**Total:** 15+ tests covering positive paths, negative scenarios, contract validation, and realistic workflows.

---

## Design Decisions

### Why Playwright's native API over Supertest or axios?
Fewer dependencies, one unified toolchain across UI and API tests, and shared configuration. For teams already using Playwright for UI, the API layer costs zero additional setup.

### Why Ajv for schema validation?
Ajv is the fastest JSON Schema validator for JavaScript and supports JSON Schema Draft 07 out of the box. Alternatives like Joi use their own DSL — Ajv sticks to the JSON Schema standard, so schemas are portable.

### Why store schemas as .json files, not inline?
- They can be shared with backend teams as a single source of truth
- They can be auto-generated from OpenAPI/Swagger specs
- They're human-readable and diff-friendly in version control

### Why test tagging instead of test groups?
Tags on test titles (`@smoke`, `@regression`) are more flexible than groups. A single test can have multiple tags, and `--grep` lets you run arbitrary combinations from the command line.

---

## What This Framework Demonstrates

This project showcases modern API testing skills clients look for:

- Building lean, modern API test automation in TypeScript
- Unifying UI + API testing into one toolchain
- Contract testing via JSON Schema to catch breaking changes
- Type-safe API interactions with proper modeling
- E2E workflow testing beyond isolated endpoints
- CI/CD integration with smart smoke/regression separation
- Clean project organization scalable to dozens of endpoints

---

## Related Projects

Part of a comprehensive test automation portfolio:

- [Playwright UI Automation Framework](https://github.com/PiyushSinghal-QA/playwright-automation-framework) — TypeScript + Page Object Model for web UI testing
- [REST Assured API Framework](https://github.com/PiyushSinghal-QA/rest-assured-api-tests) — Java + TestNG + Allure, for enterprise JVM environments

---

## About the Author

**Piyush Singhal** — SDET with 5+ years in test automation across SaaS, ad-tech, and enterprise networking products.

- [LinkedIn](https://www.linkedin.com/in/nitb-piyush-singhal/)
- [Upwork Profile](https://www.upwork.com/freelancers/~01d6783f97ce092c7f)
- ISTQB Certified (Foundation Level + Generative AI Testing)

---

## License

MIT — Free to use as reference for your own projects.
