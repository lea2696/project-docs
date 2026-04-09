#!/usr/bin/env node

/**
 * project-docs init
 *
 * Initializes project documentation after files have been copied.
 * Replaces template variables with project-specific values.
 *
 * Usage:
 *   node scripts/docs/init.mjs [options]
 *
 * Options:
 *   --prd <path>        Path to a PRD file to seed documentation
 *   --name <name>       Project name (skips prompt)
 *   --non-interactive   Use auto-detected defaults without prompting
 *   --help              Show this help message
 */

import { readFile, writeFile, copyFile, mkdir } from 'fs/promises';
import { join, dirname, resolve, basename } from 'path';
import { createInterface } from 'readline';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..', '..');

const FILES_WITH_PROJECT_NAME = [
  'CLAUDE.md',
  'AGENTS.md',
];

// --- Helpers ---

function parseArgs(argv) {
  const args = {
    prd: null,
    name: null,
    nonInteractive: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case '--prd':
        args.prd = argv[++i];
        break;
      case '--name':
        args.name = argv[++i];
        break;
      case '--non-interactive':
        args.nonInteractive = true;
        break;
      case '--help':
        args.help = true;
        break;
    }
  }
  return args;
}

function printHelp() {
  console.log(`
project-docs init

Initializes project documentation by replacing template placeholders
with project-specific values.

Usage:
  node scripts/docs/init.mjs [options]

Options:
  --prd <path>        Path to a PRD file. Copies it to plans/ and
                      sets up the bootstrapper to use it.
  --name <name>       Project name (skips interactive prompt)
  --non-interactive   Use auto-detected defaults without prompting
  --help              Show this help message

Examples:
  node scripts/docs/init.mjs
  node scripts/docs/init.mjs --name "my-project"
  node scripts/docs/init.mjs --prd docs/prd.md
  node scripts/docs/init.mjs --prd docs/prd.md --name "my-project" --non-interactive
`);
}

async function prompt(question, defaultValue) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    const suffix = defaultValue ? ` (${defaultValue})` : '';
    rl.question(`  ${question}${suffix}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

async function detectProjectName(repoRoot) {
  const pkgPath = join(repoRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
      if (pkg.name) return pkg.name;
    } catch { /* ignore */ }
  }
  return basename(repoRoot) || 'my-project';
}

// --- Main ---

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  console.log('\n📦 project-docs init\n');

  // 1. Detect or ask for project name
  const detectedName = await detectProjectName(REPO_ROOT);
  let projectName;

  if (args.name) {
    projectName = args.name;
  } else if (args.nonInteractive) {
    projectName = detectedName;
  } else {
    projectName = await prompt('Project name', detectedName);
  }

  console.log(`\n  Project: ${projectName}`);

  // 2. Replace {{PROJECT_NAME}} in target files
  let replaced = 0;
  for (const file of FILES_WITH_PROJECT_NAME) {
    const filePath = join(REPO_ROOT, file);
    if (!existsSync(filePath)) continue;

    const content = await readFile(filePath, 'utf-8');
    if (content.includes('{{PROJECT_NAME}}')) {
      const updated = content.replaceAll('{{PROJECT_NAME}}', projectName);
      await writeFile(filePath, updated, 'utf-8');
      replaced++;
      console.log(`  ✅ Updated: ${file}`);
    }
  }

  if (replaced === 0) {
    console.log('  ℹ️  No template variables to replace (already initialized)');
  }

  // 3. Handle PRD if provided
  if (args.prd) {
    const prdSource = resolve(args.prd);
    if (!existsSync(prdSource)) {
      console.error(`\n  ❌ PRD file not found: ${prdSource}`);
      process.exit(1);
    }

    const prdDest = join(REPO_ROOT, 'plans', 'initial-prd.md');
    await mkdir(join(REPO_ROOT, 'plans'), { recursive: true });
    await copyFile(prdSource, prdDest);
    console.log(`  ✅ PRD copied to: plans/initial-prd.md`);
  }

  // 4. Summary and next steps
  console.log(`
📊 Init complete!

Next steps:`);

  if (args.prd) {
    console.log(`
  1. Open Claude Code and run:

     "Use the bootstrapper agent to initialize docs from plans/initial-prd.md"

     This will read your PRD and fill in VISION.md, TECH_STACK.md,
     CONVENTIONS.md, and other documentation files.
`);
  } else {
    console.log(`
  1. Open Claude Code and run:

     "Use the bootstrapper agent to initialize project docs"

     It will ask about your project and fill in the documentation.
     Tip: pass a PRD next time with --prd <path> for faster setup.
`);
  }

  console.log(`  2. Review and commit the generated documentation
  3. Start building — the pre-commit hook enforces doc freshness
`);
}

main().catch((err) => {
  console.error('❌ Init failed:', err.message);
  process.exit(1);
});
