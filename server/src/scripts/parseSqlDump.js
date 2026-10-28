import fs from 'fs';
import path from 'path';

export function parseSqlDump(sqlPath) {
  const content = fs.readFileSync(sqlPath, 'utf8');
  const tables = {};

  // Find all INSERT INTO `table_name` VALUES ...;
  // Note: an INSERT might span multiple lines
  const insertRegex = /INSERT INTO `([^`]+)` VALUES\s*([\s\S]*?);/g;
  let match;

  while ((match = insertRegex.exec(content)) !== null) {
    const tableName = match[1];
    const valuesBlock = match[2].trim();

    if (!tables[tableName]) {
      tables[tableName] = [];
    }

    // Parse the values tuples: (row1), (row2), ...
    const rows = parseValuesTuples(valuesBlock);
    tables[tableName].push(...rows);
  }

  return tables;
}

function parseValuesTuples(str) {
  const rows = [];
  let inString = false;
  let escape = false;
  let currentRow = [];
  let currentVal = '';
  let inTuple = false;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if (escape) {
      currentVal += char;
      escape = false;
      continue;
    }

    if (char === '\\') {
      escape = true;
      continue;
    }

    if (char === "'") {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (char === '(' && !inTuple) {
        inTuple = true;
        currentRow = [];
        currentVal = '';
        continue;
      }

      if (char === ')' && inTuple) {
        currentRow.push(cleanVal(currentVal));
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
        inTuple = false;
        continue;
      }

      if (char === ',' && inTuple) {
        currentRow.push(cleanVal(currentVal));
        currentVal = '';
        continue;
      }
    }

    if (inTuple) {
      currentVal += char;
    }
  }

  return rows;
}

function cleanVal(v) {
  const trimmed = v.trim();
  if (trimmed === 'NULL') return null;
  if (!isNaN(trimmed) && trimmed !== '') return Number(trimmed);
  return trimmed;
}
