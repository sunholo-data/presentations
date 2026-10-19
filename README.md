# Sunholo presentations

HTML slide decks published at https://www.sunholo.com/presentations/. Each deck is a folder of self-contained HTML files, and the root `index.html` links to them.

This guide assumes a fresh laptop with only Claude Desktop installed. You can skip any step you already have.

## What you need

| Tool | Needed for | Required? |
| --- | --- | --- |
| Claude Desktop | Working on the repo with Claude (Code tab) | Yes |
| git | Downloading the repo, committing, pushing | Yes |
| GitHub CLI (`gh`) | Letting Claude open and check pull requests | Recommended |
| Node.js | Exporting a deck to PDF (`scripts/`) | Only for PDF export |

Claude Desktop does not necessarily include git, so check for it in the steps below. Git is a separate install on every platform.

You also need access to the `sunholo-data` GitHub organisation. Ask Mark to add you before you try to clone or push.

## 1. Install Claude Desktop

Download it from https://claude.com/download, install it, and sign in.

## 2. Install git

### macOS

Open Terminal and run:

```bash
xcode-select --install
```

Accept the prompt. This installs Apple's developer tools, which include git. Check it worked:

```bash
git --version
```

### Windows

Download **Git for Windows** from https://git-scm.com/download/win and run the installer. The defaults are fine. This also installs **Git Bash**, which Claude uses for shell commands. Open a new PowerShell window and check:

```powershell
git --version
```

### Linux

On Debian or Ubuntu:

```bash
sudo apt update && sudo apt install -y git
```

On Fedora:

```bash
sudo dnf install -y git
```

Check with `git --version`.

## 3. Tell git who you are

Use the name and email address on your GitHub account. These commands are the same on every platform:

```bash
git config --global user.name "Your Name"
```

```bash
git config --global user.email "you@example.com"
```

## 4. Install the GitHub CLI (recommended)

Claude can use `gh` to open pull requests and read CI results. Without it you can still commit and push, but you'll open PRs in the browser.

- **macOS:** `brew install gh` (needs Homebrew, from https://brew.sh)
- **Windows:** `winget install --id GitHub.cli`
- **Linux:** see https://github.com/cli/cli/blob/trunk/docs/install_linux.md

Then sign in:

```bash
gh auth login
```

Choose GitHub.com, HTTPS, and log in with the browser. Check it worked:

```bash
gh auth status
```

## 5. Clone the repo

Pick a folder for your projects, for example `Documents` or `dev`, and run:

```bash
git clone https://github.com/sunholo-data/presentations.git
```

Then open Claude Desktop, go to the **Code** tab, and choose the `presentations` folder. Claude works on files on your own computer, so the clone is where your edits and commits will live.

## 6. (Optional) Node.js for PDF export

Only needed if you want to export a deck to PDF. Install the LTS version from https://nodejs.org, then:

```bash
cd scripts
```

```bash
npm install
```

The first install downloads a headless Chromium, so it takes a few minutes. See the usage notes at the top of [scripts/export-pdf.mjs](scripts/export-pdf.mjs).

## Working on the repo

- Work on a branch, not on `main`. Ask Claude to create one, for example `presentations/your-change`.
- Commit on your branch and push it. The coordinator opens the PR against `main`, as described in [AGENTS.md](AGENTS.md).
- Never push directly to `main`. The GitHub Pages workflow publishes `main` after merge.
- Keep the URLs of existing decks stable, and only add a deck to the root `index.html` when you're adding or renaming one.

## Troubleshooting

- **`git: command not found`**: git is not installed or your terminal was open before the install. Close it, open a new one and try again.
- **Windows: Claude can't find Git Bash**: install Git for Windows (step 2), then restart Claude Desktop.
- **`Permission denied` or `Repository not found` when cloning**: your GitHub account needs access to `sunholo-data`. Ask Mark.
- **`gh auth status` says you're not logged in**: run `gh auth login` again.
