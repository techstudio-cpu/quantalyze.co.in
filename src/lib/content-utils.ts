import { fallbackQuery } from './fallback-db';

// Initialize content tables
export async function initContentTables() {
  try {
    // Create website_content table
    await fallbackQuery(`
      CREATE TABLE IF NOT EXISTS website_content (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section TEXT NOT NULL,
        component TEXT NOT NULL,
        field_name TEXT NOT NULL,
        field_value TEXT,
        field_type TEXT DEFAULT 'text',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(section, component, field_name)
      )
    `);

    // Create website_sections table for section metadata
    await fallbackQuery(`
      CREATE TABLE IF NOT EXISTS website_sections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        section_id TEXT UNIQUE NOT NULL,
        section_name TEXT NOT NULL,
        section_order INTEGER DEFAULT 0,
        is_visible BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

  } catch (error) {
    throw error;
  }
}
