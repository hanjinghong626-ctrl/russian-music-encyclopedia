#!/usr/bin/env node
/**
 * validate-data.mjs — Data integrity checker for encyclopedia_unified.json
 * Run: node scripts/validate-data.mjs
 *
 * Checks:
 *   1. ID uniqueness
 *   2. Required fields non-empty (id, zh, category)
 *   3. cross_refs point to existing IDs
 *   4. back_refs are bidirectionally consistent with cross_refs
 *   5. category_zh exists in category_tree
 *   6. learning_paths reference valid, non-duplicate IDs
 *   7. stats can be recomputed from data
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'public', 'data', 'encyclopedia_unified.json');

const data = JSON.parse(readFileSync(DATA_PATH, 'utf-8'));
const entries = data.entries || [];
const errors = [];
const warnings = [];

// Build lookup maps
const idSet = new Set();
const idMap = new Map();
for (const e of entries) {
  if (idSet.has(e.id)) {
    errors.push(`DUPLICATE ID: ${e.id}`);
  }
  idSet.add(e.id);
  idMap.set(e.id, e);
}

// 1. Required fields
for (const e of entries) {
  if (e.id == null) errors.push(`Entry with null/undefined id`);
  if (!e.zh || !e.zh.trim()) errors.push(`ID ${e.id}: missing zh title`);
  if (!e.ru || !e.ru.trim()) warnings.push(`ID ${e.id} (${e.zh}): missing ru title`);
  if (!e.category_zh) errors.push(`ID ${e.id} (${e.zh}): missing category_zh`);
}

// 2. Cross-refs point to existing IDs
let totalRefs = 0;
let entriesWithRefs = 0;
for (const e of entries) {
  const refs = e.cross_refs || [];
  if (refs.length > 0) entriesWithRefs++;
  for (const refId of refs) {
    totalRefs++;
    if (!idSet.has(refId)) {
      errors.push(`ID ${e.id} (${e.zh}): cross_ref to non-existent ID ${refId}`);
    }
  }
}

// 3. Back-refs bidirectional consistency
for (const e of entries) {
  const backRefs = e.back_refs || [];
  for (const refId of backRefs) {
    if (!idSet.has(refId)) {
      errors.push(`ID ${e.id} (${e.zh}): back_ref to non-existent ID ${refId}`);
      continue;
    }
    // Check that refId has e.id in its cross_refs
    const refEntry = idMap.get(refId);
    if (refEntry && !(refEntry.cross_refs || []).includes(e.id)) {
      errors.push(`ID ${e.id} (${e.zh}): back_ref from ${refId}, but ${refId}.cross_refs does not include ${e.id}`);
    }
  }
}

// 4. category_zh exists in category_tree
const treeKeys = new Set(Object.keys(data.category_tree || {}));
for (const e of entries) {
  if (e.category_zh && !treeKeys.has(e.category_zh)) {
    errors.push(`ID ${e.id} (${e.zh}): category_zh "${e.category_zh}" not in category_tree`);
  }
}

// 5. Learning paths
const allPathIds = new Set();
for (const [catName, levels] of Object.entries(data.learning_paths || {})) {
  for (const [level, ids] of Object.entries(levels)) {
    const seen = new Set();
    for (const eid of ids) {
      if (!idSet.has(eid)) {
        errors.push(`Learning path ${catName}/${level}: references non-existent ID ${eid}`);
      }
      if (seen.has(eid)) {
        errors.push(`Learning path ${catName}/${level}: duplicate ID ${eid}`);
      }
      seen.add(eid);
      if (allPathIds.has(eid)) {
        warnings.push(`Learning path ID ${eid} appears in multiple categories/levels`);
      }
      allPathIds.add(eid);
    }
  }
}

// 6. Stats recomputation
const stats = data.stats || {};
const computed = {
  total_entries: entries.length,
  categories: Object.keys(data.category_tree || {}).length,
  chinese_definitions: entries.filter(e => e.definition_zh && e.definition_zh.trim()).length,
  russian_definitions: entries.filter(e => e.definition_ru && e.definition_ru.trim()).length,
};

if (stats.total_entries !== computed.total_entries) {
  errors.push(`Stats mismatch: total_entries=${stats.total_entries}, computed=${computed.total_entries}`);
}
if (stats.categories !== computed.categories) {
  errors.push(`Stats mismatch: categories=${stats.categories}, computed=${computed.categories}`);
}
if (stats.chinese_definitions !== computed.chinese_definitions) {
  warnings.push(`Stats: chinese_definitions=${stats.chinese_definitions}, computed=${computed.chinese_definitions}`);
}
if (stats.russian_definitions !== computed.russian_definitions) {
  warnings.push(`Stats: russian_definitions=${stats.russian_definitions}, computed=${computed.russian_definitions}`);
}

// Cross-reference stats
const crStats = stats.cross_references || {};
if (crStats.total_references !== totalRefs) {
  warnings.push(`Stats: cross_references.total_references=${crStats.total_references}, computed=${totalRefs}`);
}
if (crStats.entries_with_refs !== entriesWithRefs) {
  warnings.push(`Stats: cross_references.entries_with_refs=${crStats.entries_with_refs}, computed=${entriesWithRefs}`);
}

// Report
console.log('═══ Data Validation Report ═══');
console.log(`Entries: ${entries.length}`);
console.log(`Categories: ${computed.categories}`);
console.log(`Chinese definitions: ${computed.chinese_definitions}`);
console.log(`Russian definitions: ${computed.russian_definitions}`);
console.log(`Cross-references: ${totalRefs} total, ${entriesWithRefs} entries with refs`);
console.log(`Learning path entries: ${allPathIds.size}`);
console.log('');

if (errors.length > 0) {
  console.log(`❌ ERRORS (${errors.length}):`);
  errors.forEach(e => console.log(`  ✗ ${e}`));
} else {
  console.log('✅ No errors');
}

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.log(`  ⚠ ${w}`));
} else {
  console.log('✅ No warnings');
}

console.log('');
if (errors.length > 0) {
  console.log(`Validation FAILED with ${errors.length} error(s).`);
  process.exit(1);
} else {
  console.log('Validation PASSED.');
  process.exit(0);
}
