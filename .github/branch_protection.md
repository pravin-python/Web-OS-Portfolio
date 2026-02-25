# Branch Protection Rules

To ensure no broken code enters the `main` or `develop` branches, please configure the following Branch Protection Rules in your GitHub repository settings.

## How to Enable

1. Go to your repository on GitHub.
2. Click on **Settings** > **Branches**.
3. Under _Branch protection rules_, click **Add branch protection rule**.
4. In the **Branch name pattern** field, type `main` (and repeat for `develop` if applicable).

## Recommended Settings to Enable

- [x] **Require a pull request before merging**
  - [x] Require approvals (Set to at least 1)
  - [x] Dismiss stale pull request approvals when new commits are pushed
- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Search and select the following Status Checks to make them required:
    - `test` (Backend CI)
    - `build-and-test` (Frontend CI)
    - `lint-python` (Lint & Format)
    - `lint-frontend` (Lint & Format)
    - `security-python` (Security Scan)
    - `security-node` (Security Scan)
- [x] **Do not allow bypassing the above settings**
- [x] **Restrict who can push to matching branches** (Only allow specific teams or individuals, effectively preventing direct pushes without PRs)

By enforcing these rules, GitHub will block any Pull Request that fails the configured automated tests, formatters, type-checkers, or vulnerability scanners.
