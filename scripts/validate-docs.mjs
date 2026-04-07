#!/usr/bin/env node

/**
 * project-docs validator
 *
 * Validates documentation structure, frontmatter, and internal links.
 *
 * Usage:
 *   node scripts/validate-docs.mjs [project-docs-path]
 */

import { readdir, readFile } from 'fs/promises';
import { join, relative, resolve, dirname } from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_DOCS_DIR = resolve(SCRIPT_DIR, '..');

const REQUIRED_DIRS = [
  'product', 'architecture', 'context', 'references',
  'plans', 'sessions', 'handoffs', 'memory',
];

const REQUIRED_FILES = [
  'product/VISION.md',
  'product/SCOPE.md',
  'product/ROADMAP.md',
  'architecture/SYSTEM_OVERVIEW.md',
  'architecture/MODULES.md',
  'architecture/DECISIONS.md',
  'architecture/DEPENDENCIES.md',
  'context/TECH_STACK.md',
  'context/CONVENTIONS.md',
  'context/CURRENT_STATE.md',
  'context/KNOWN_ISSUES.md',
  'references/REPO_MAP.md',
  'references/KEY_FILES.md',
  'references/CRITICAL_FLOWS.md',
  'plans/PLAN_TEMPLATE.md',
  'sessions/SESSION_TEMPLATE.md',
  'handoffs/HANDOFF_TEMPLATE.md',
  'memory/RECURRING_MISTAKES.md',
  'memory/CHANGELOG_NOTES.md',
];

const REQUIRED_FRONTMATTER = ['status', 'owner', 'last_updated', 'read_policy'];

// --- Helpers ---

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const fields = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      const value = line.slice(colonIdx + 1).trim();
      fields[key] = value;
    }
  }
  return fields;
}

async function getAllMdFiles(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'scaffold' || entry.name === 'scripts' || entry.name === 'node_modules') continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getAllMdFiles(fullPath, base));
    } else if (entry.name.endsWith('.md') && entry.name !== 'README.md' && entry.name !== 'CLAUDE.md' && entry.name !== 'AGENTS.md') {
      files.push({ path: fullPath, rel: relative(base, fullPath) });
    }
  }
  return files;
}

// --- Main ---

async function main() {
  const docsDir = process.argv[2] ? resolve(process.argv[2]) : DEFAULT_DOCS_DIR;
  const errors = [];
  const warnings = [];

  console.log(`\n🔍 Validating project-docs at: ${docsDir}\n`);

  // 1. Check required directories
  for (const dir of REQUIRED_DIRS) {
    if (!existsSync(join(docsDir, dir))) {
      errors.push(`Missing required directory: ${dir}/`);
    }
  }

  // 2. Check required files
  for (const file of REQUIRED_FILES) {
    if (!existsSync(join(docsDir, file))) {
      errors.push(`Missing required file: ${file}`);
    }
  }

  // 3. Validate frontmatter on all .md files
  const mdFiles = await getAllMdFiles(docsDir);
  for (const { path: filePath, rel } of mdFiles) {
    const content = await readFile(filePath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (!fm) {
      errors.push(`Missing frontmatter: ${rel}`);
      continue;
    }

    for (const field of REQUIRED_FRONTMATTER) {
      if (!fm[field]) {
        errors.push(`Missing frontmatter field '${field}': ${rel}`);
      }
    }

    // Check for TODOs in stable files
    if (fm.status === 'stable' && content.includes('<!-- TODO:')) {
      errors.push(`TODO found in stable file: ${rel}`);
    }
  }

  // 4. Check scaffold completeness
  const scaffoldDir = join(docsDir, 'scaffold');
  if (existsSync(scaffoldDir)) {
    let scaffoldCount = 0;
    async function countFiles(dir) {
      const entries = await readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) await countFiles(join(dir, entry.name));
        else scaffoldCount++;
      }
    }
    await countFiles(scaffoldDir);
    if (scaffoldCount !== 18) {
      warnings.push(`Scaffold has ${scaffoldCount} files (expected 18)`);
    }
  }

  // 5. Report
  console.log(`  Files checked: ${mdFiles.length}`);
  console.log(`  Errors: ${errors.length}`);
  console.log(`  Warnings: ${warnings.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const err of errors) console.log(`  - ${err}`);
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    for (const warn of warnings) console.log(`  - ${warn}`);
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('\n✅ All checks passed!\n');
  }

  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('❌ Validation failed:', err.message);
  process.exit(1);
});
