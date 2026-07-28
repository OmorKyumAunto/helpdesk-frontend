// Shared list of unit / company names used by the Address Book filters.
export const UNIT_NAMES: string[] = [
  "Sylhet EZ",
  "Corporate Office",
  "Jinnat Apparels Ltd",
  "Jinnat Knitwears Ltd",
  "Jinnat Fashions Ltd",
  "Matin Spinning Mills PLC",
  "Thanbee Print World Ltd",
  "Hamza Textiles Ltd",
  "Flamingo Fashions Ltd",
  "DB Tex Ltd",
  "Dulal Brothers Ltd",
  "Color City Ltd",
  "DBL Digital Ltd",
  "Parkway Packaging and Printing Ltd",
  "Mymun Textiles Ltd",
  "DBL Pharmaceuticals Ltd",
  "DBL Ceramics Ltd",
  "DBL Telecom Ltd",
  "DBL Distributions Ltd",
  "DBL Lifestyles Ltd",
  "Digital Corporate",
  "ECO Thread Plant",
  "DBL Dredging Ltd.",
  "Farmgate Office",
  "Mawna Fashions Ltd.",
  "Ceramics Plant",
  "DB TRIMS Ltd.",
  "Jinnat Complex",
  "Mymun Complex",
  "Glory Textile and Apparels Limited",
  "DBL Industrial Park Ltd",
  "Knitting",
  "Thanbee Complex",
  "DBL Textile Recycling Ltd",
  "Matin Complex",
  "Jinnat Textile Mills Ltd",
  "Textile Testing Services Ltd",
  "Atelier Sourcing Ltd",
  "Mawna Fashions Ltd",
  "DBL Tours and Travels Limited",
  "Chittagong C and F Office",
  "Ceramics Field",
  "Flamingo2",
  "Dredging Office",
  "JKL2",
  "Pharma Field",
  "Pharma Plant",
  "Lifestyle Corporate",
  "Pharma Corporate",
  "ECO Thread Corporate",
  "DBTrims Plant",
  "Ceramics Corporate",
  "PPPL Corporate",
  "EUDB Accessories Limited",
  "PPPL Plant",
  "DBL Healthcare Ltd",
  "EUDB",
  "DBLCL",
  "Jinnat Knitting Ltd",
  "DBL Pharma",
  "FFL2",
  "eco Plant",
  "MSML Complex",
  "DTRL (Matin Complex)",
];

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

/**
 * Collapses a long department list into fewer, prefix-grouped options.
 *
 * Departments that share a first word (IT Support, IT Admin, IT Network) fold
 * into a single "IT" option — the backend prefix-matches it (LIKE 'IT%'), so
 * picking it shows every department in that family. Departments whose first
 * word is unique stay as their full name, so specificity isn't lost where there
 * is no cluster. Grouping is case-insensitive; single-letter first words are
 * never grouped (too broad).
 */
// Placeholder / non-department values that pollute the data — hidden from the
// filter dropdown (compared trimmed + lowercased).
const JUNK_DEPARTMENTS = new Set([
  "n/a",
  "na",
  "n\\a",
  "n.a",
  "null",
  "none",
  "nil",
  "-",
  "--",
  ".",
  "tbd",
  "test",
]);

export const departmentOptions = (list: string[]): string[] => {
  const byFirst = new Map<string, { first: string; count: number; full: string }>();
  for (const raw of list) {
    const d = String(raw || "").trim();
    if (!d || JUNK_DEPARTMENTS.has(d.toLowerCase())) continue;
    const first = d.split(/\s+/)[0];
    const key = first.toLowerCase();
    const e = byFirst.get(key);
    if (e) {
      e.count += 1;
    } else {
      byFirst.set(key, { first, count: 1, full: d });
    }
  }
  const options: string[] = [];
  for (const { first, count, full } of byFirst.values()) {
    // Group only when several share a first word AND the word is meaningful.
    // Grouped labels are Capitalised (the DB casing is inconsistent, e.g.
    // "knitting"); the backend match is case-insensitive so the value is safe.
    if (count > 1 && first.length > 1) {
      options.push(first.charAt(0).toUpperCase() + first.slice(1));
    } else {
      options.push(full);
    }
  }
  return options.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
};
