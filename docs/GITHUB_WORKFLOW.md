# GitHub Workflow

## Solo Team Structure

This project was completed as an individual submission under the assignment's permitted team size of 1–4 members. As the sole team member, all responsibilities—including repository setup, issue creation, feature development, pull requests, self-reviews, and merging—were performed by:

- **Team Leader / Developer**: Ayush Kumar Singh
- **GitHub Account**: mayooreshmoodanwal
- **Repository**: [mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh)

No additional collaborators were present. No artificial accounts, fake reviews, or falsified approvals were created. All PRs were integrated through a structured GitHub workflow following self-reviews against each issue's acceptance criteria. Since no other collaborators were making concurrent changes, merge conflicts were not expected; all features were nevertheless developed on dedicated branches and merged sequentially into `main`.

## Issue and Pull Request Log

| PR # | Issue # | Branch | Description | Opened (IST) | Merged (IST) | Time Since Prev PR | Status |
|---|---|---|---|---|---|---|---|
| [#9](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/9) | [#1](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/1) | `feature/project-foundation` | Repo setup, project structure, health endpoint, base configs | 14:07:11 | 14:07:39 | Baseline | Merged |
| [#10](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/10) | [#2](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/2) | `feature/backend-models` | MongoDB integration, Employee schema, express-validator rules | 14:13:44 | 14:16:08 | 6m 33s | Merged |
| [#11](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/11) | [#3](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/3) | `feature/authentication` | JWT auth, bcrypt hashing, User model, middleware, seed script | 14:22:03 | 14:22:20 | 8m 19s | Merged |
| [#12](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/12) | [#4](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/4) | `feature/employee-crud` | Employee CRUD REST API, search/filter, pagination, salary privacy | 14:27:35 | 14:28:00 | 5m 32s | Merged |
| [#13](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/13) | [#5](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/5) | `feature/frontend-auth` | AuthContext, Axios client, ProtectedRoute, Login/Register pages | 14:33:27 | 14:33:49 | 5m 52s | Merged |
| [#14](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/14) | [#6](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/6) | `feature/employee-interface` | Employee directory, debounced search, form, details, admin dashboard | 14:39:03 | 14:39:28 | 5m 36s | Merged |
| [#15](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/15) | [#7](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/7) | `test/quality-assurance` | Unified 23-test suite, refactoring, code quality, technical architecture | 14:44:39 | 14:45:00 | 5m 36s | Merged |
| [#16](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/pull/16) | [#8](https://github.com/mayooreshmoodanwal/Assignment-4-WEB-AyushKumarSingh/issues/8) | `chore/deployment` | Deployment configuration, runbooks, vercel SPA rewrite, final docs | 14:50:17 | 14:50:36 | 5m 38s | Merged |

## Branch Naming Convention

| Prefix | Usage |
|---|---|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `test/` | Test coverage additions |
| `chore/` | Deployment, config, maintenance |

## PR Review Process

For each pull request:

1. Created a dedicated feature branch from the latest updated `main`.
2. Implemented solely the scope defined in the associated GitHub issue.
3. Executed automated test suite and build verification checks.
4. Inspected `git diff` and verified that no `.env` files or credentials were staged.
5. Pushed the branch and opened a pull request with an explicit description referencing the issue via `Closes #<id>`.
6. Conducted a self-review of the PR diff on GitHub against the acceptance criteria.
7. Verified all automated CI checks passed.
8. Merged the pull request using GitHub merge commit.
9. Synchronized the local `main` branch and deleted the merged remote feature branch.

## Five-Minute PR Interval Verification

A mandatory minimum target interval of 5 minutes between consecutive PR creations was strictly adhered to and recorded with verifiable GitHub timestamps:
- PR 1 to PR 2: 6 minutes 33 seconds
- PR 2 to PR 3: 8 minutes 19 seconds
- PR 3 to PR 4: 5 minutes 32 seconds
- PR 4 to PR 5: 5 minutes 52 seconds
- PR 5 to PR 6: 5 minutes 36 seconds

The intervals between PRs were utilized productively for reviewing diffs, running tests, checking CI status, and preparing the subsequent feature scope.

## Commit Message Convention

Commits follow standard semantic prefixes:
- `feat:` — new functionality
- `test:` — test additions and assertions
- `docs:` — technical documentation
- `chore:` — tooling, configuration, and deployment
