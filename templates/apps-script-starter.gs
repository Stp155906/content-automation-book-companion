/**
 * BOOK COMPANION - STARTER CONFIGURATION
 *
 * This is a teaching template, not a complete production automation.
 * Keep private keys, secrets, and tokens in Apps Script Project Settings > Script properties.
 */

const CONFIG = {
  driveParentFolderId: 'PASTE_YOUR_DRIVE_FOLDER_ID',
  timeZone: 'America/Aruba',
  csvFileName: 'post-copy.csv',
  alertEmail: 'you@example.com',
  draftOnly: true,
  expectedImageType: 'carousel', // Change to 'single' only for a one-image workflow.
};

/**
 * Private Script Properties to create - do not paste actual values into this file:
 *
 * TIKTOK_CLIENT_KEY
 * TIKTOK_CLIENT_SECRET
 * RELAY_SHARED_SECRET
 */

function getTodayFolderName_() {
  return Utilities.formatDate(new Date(), CONFIG.timeZone, 'yyyy-MM-dd');
}

function getRequiredPrivateSetting_(name) {
  const value = PropertiesService.getScriptProperties().getProperty(name);
  if (!value) throw new Error(`Missing Script Property: ${name}`);
  return value;
}

// Build the rest only after the reader has completed the book's safety checks:
// - find today's exact dated Drive folder
// - check post-copy.csv and required fields
// - validate consecutive slides beginning with 01
// - use a private relay with short-lived signed URLs
// - send a draft, never a direct public post
// - record success only after TikTok confirms it
// - email the owner when a required item is missing or a send fails
