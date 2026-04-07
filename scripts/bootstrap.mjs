#!/usr/bin/env node

/**
 * project-docs bootstrap script
 *
 * Copies scaffold templates to the host repo root and replaces
 * template variables with project-specific values.
 *
 * Usage:
 *   node scripts/bootstrap.mjs [options]
 *
 * Options:
 *   --dry-run           Preview changes without writing files
 *   --non-interactive   Use defaults without prompting
 *   --help              Show this help message
 */

import { readdir, readFile, writeFile, mkdir, stat, copyFile } from 'fs/promises';
import { join, dirname, relative, resolve, basename } from 'path';
import { createInterface } from 'readline';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_DOCS_DIR = resolve(SCRIPT_DIR, '..');
const SCAFFOLD_DIR = join(PROJECT_DOCS_DIR, 'scaffold');

const TEMPLATE_VARS = {
  '{{PROJECT_NAME}}': '',
  '{{PROJECT_DOCS_PATH}}': '',
  '{{TEST_DIR}}': '',
};

// --- Helpers ---

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    nonInteractive: argv.includes('--non-interactive'),
    help: argv.includes('--help'),
  };
}

function printHelp() {
  console.log(`
project-docs bootstrap

Copies scaffold templates to your repo root and sets up
Claude Code and Codex agent configuration.

Usage:
  node project-docs/scripts/bootstrap.mjs [options]

Options:
  --dry-run           Preview changes without writing files
  --non-interactive   Use defaults without prompting
  --help              Show this help message
`);
}

async function prompt(question, defaultValue) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    const suffix = defaultValue ? ` (${defaultValue})` : '';
    rl.question(`${question}${suffix}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

async function findRepoRoot(startDir) {
  let dir = startDir;
  while (dir !== '/') {
    if (existsSync(join(dir, '.git'))) return dir;
    dir = dirname(dir);
  }
  return null;
}

async function detectProjectName(repoRoot) {
  const pkgPath = join(repoRoot, 'package.json');
  if (existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
      if (pkg.name) return pkg.name;
    } catch { /* ignore parse errors */ }
  }
  return basename(repoRoot) || 'my-project';
}

async function detectTestDir(repoRoot) {
  for (const dir of ['tests', 'test', '__tests__', 'spec']) {
    if (existsSync(join(repoRoot, dir))) return dir;
  }
  return 'tests';
}

async function getAllFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllFiles(fullPath, base));
    } else {
      files.push(relative(base, fullPath));
    }
  }
  return files;
}

function replaceVars(content, vars) {
  let result = content;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(key, value);
  }
  return result;
}

// --- Main ---

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  console.log('\n📦 project-docs bootstrap\n');

  // 1. Find repo root
  const cwd = process.cwd();
  const repoRoot = await findRepoRoot(cwd);
  if (!repoRoot) {
    console.warn('⚠️  No git repository found. Using current directory as root.');
  }
  const targetRoot = repoRoot || cwd;
  console.log(`  Repo root: ${targetRoot}`);

  // 2. Detect project-docs path relative to repo root
  const projectDocsRel = relative(targetRoot, PROJECT_DOCS_DIR);
  TEMPLATE_VARS['{{PROJECT_DOCS_PATH}}'] = projectDocsRel || 'project-docs';

  // 3. Detect or ask for project name
  const detectedName = await detectProjectName(targetRoot);
  if (args.nonInteractive) {
    TEMPLATE_VARS['{{PROJECT_NAME}}'] = detectedName;
  } else {
    TEMPLATE_VARS['{{PROJECT_NAME}}'] = await prompt('  Project name', detectedName);
  }

  // 4. Detect or ask for test directory
  const detectedTestDir = await detectTestDir(targetRoot);
  if (args.nonInteractive) {
    TEMPLATE_VARS['{{TEST_DIR}}'] = detectedTestDir;
  } else {
    TEMPLATE_VARS['{{TEST_DIR}}'] = await prompt('  Test directory', detectedTestDir);
  }

  console.log(`\n  Project: ${TEMPLATE_VARS['{{PROJECT_NAME}}']}`);
  console.log(`  Docs path: ${TEMPLATE_VARS['{{PROJECT_DOCS_PATH}}']}`);
  console.log(`  Test dir: ${TEMPLATE_VARS['{{TEST_DIR}}']}`);

  // 5. Verify scaffold exists
  if (!existsSync(SCAFFOLD_DIR)) {
    console.error('\n❌ Scaffold directory not found at:', SCAFFOLD_DIR);
    process.exit(1);
  }

  // 6. Get all scaffold files
  const scaffoldFiles = await getAllFiles(SCAFFOLD_DIR);
  console.log(`\n  Found ${scaffoldFiles.length} scaffold files\n`);

  // 7. Process each file
  const created = [];
  const skipped = [];

  for (const relPath of scaffoldFiles) {
    const srcPath = join(SCAFFOLD_DIR, relPath);
    // .template files get variable substitution and renamed
    const isTemplate = relPath.endsWith('.template');
    const destRelPath = isTemplate ? relPath.replace('.template', '') : relPath;
    const destPath = join(targetRoot, destRelPath);

    // Check if destination exists
    if (existsSync(destPath)) {
      if (args.nonInteractive) {
        skipped.push(destRelPath);
        console.log(`  ⏭️  Skip (exists): ${destRelPath}`);
        continue;
      } else {
        const answer = await prompt(`  ⚠️  ${destRelPath} exists. Overwrite? (y/N)`, 'n');
        if (answer.toLowerCase() !== 'y') {
          skipped.push(destRelPath);
          continue;
        }
      }
    }

    if (args.dryRun) {
      console.log(`  📝 Would create: ${destRelPath}`);
      created.push(destRelPath);
      continue;
    }

    // Create directory and write file
    await mkdir(dirname(destPath), { recursive: true });

    if (isTemplate) {
      const content = await readFile(srcPath, 'utf-8');
      const processed = replaceVars(content, TEMPLATE_VARS);
      await writeFile(destPath, processed, 'utf-8');
    } else {
      await copyFile(srcPath, destPath);
    }

    created.push(destRelPath);
    console.log(`  ✅ Created: ${destRelPath}`);
  }

  // 8. Summary
  console.log(`\n📊 Summary:`);
  console.log(`  Created: ${created.length}`);
  console.log(`  Skipped: ${skipped.length}`);
  console.log(`  Total scaffold files: ${scaffoldFiles.length}`);

  if (args.dryRun) {
    console.log('\n  (dry run — no files were written)\n');
  } else {
    console.log(`
🎉 Bootstrap complete!

Next steps:
  1. Review the generated CLAUDE.md and AGENTS.md
  2. Run the bootstrapper agent to fill in documentation:

     Claude Code: "Use the bootstrapper agent to initialize project docs"
     Codex: "Use the bootstrap skill to initialize project docs"

  3. Commit the generated files
`);
  }
}

main().catch((err) => {
  console.error('❌ Bootstrap failed:', err.message);
  process.exit(1);
});
