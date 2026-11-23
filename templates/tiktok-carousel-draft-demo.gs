/**
 * GOOGLE DRIVE TO TIKTOK DRAFT - BOOK DEMO
 *
 * What it does:
 * - Reads today's YYYY-MM-DD folder inside one Google Drive parent folder.
 * - Reads numbered carousel images: 01.png, 02.png, 03.png, and so on.
 * - Reads Title, SEO Description, and CTA from post-copy.csv.
 * - Sends a PHOTO draft through TikTok's Upload to TikTok flow.
 * - Never uses Direct Post. You finish the draft in the TikTok app.
 * - Stops on missing content, wrong slide order, or duplicate content.
 * - Emails you immediately when a scheduled run fails.
 *
 * BEFORE YOU RUN THIS:
 * 1. Replace every value marked REPLACE_THIS.
 * 2. Add the private Script Properties listed below.
 * 3. Deploy your own private relay that supports /api/upload and /api/cleanup.
 * 4. Create a TikTok developer app with Login Kit + Content Posting API.
 *
 * This is a generic teaching template. It is not the author's personal setup.
 */

const CONFIG = {
  // Google Drive folder that contains daily folders such as 2026-11-23.
  DRIVE_PARENT_FOLDER_ID: 'REPLACE_THIS_WITH_YOUR_GOOGLE_DRIVE_PARENT_FOLDER_ID',

  // Use the timezone where you decide what "today" means.
  TIME_ZONE: 'REPLACE_THIS_WITH_YOUR_TIME_ZONE', // Example: America/Aruba

  // Email that receives missing-content and failure alerts.
  ALERT_EMAIL: 'REPLACE_THIS_WITH_YOUR_ALERT_EMAIL',

  // The site address of YOUR private relay. Do not use a public upload form.
  RELAY_BASE_URL: 'https://REPLACE_THIS_WITH_YOUR_PRIVATE_RELAY.example',
  RELAY_URL_TTL_SECONDS: 30 * 60,

  // Replace only the bracketed portion with this Apps Script project's Script ID.
  TIKTOK_REDIRECT_URI: 'https://script.google.com/macros/d/REPLACE_THIS_WITH_YOUR_SCRIPT_ID/usercallback',

  CSV_FILE_NAME: 'post-copy.csv',
  STATUS_FILE_NAME: 'tiktok-draft-status.json',
  MAX_IMAGE_BYTES: 4 * 1024 * 1024,
  MAX_SLIDES: 35,

  TIKTOK_AUTHORIZE_URL: 'https://www.tiktok.com/v2/auth/authorize/',
  TIKTOK_TOKEN_URL: 'https://open.tiktokapis.com/v2/oauth/token/',
  TIKTOK_PHOTO_INIT_URL: 'https://open.tiktokapis.com/v2/post/publish/content/init/',
};

/**
 * PRIVATE SCRIPT PROPERTIES TO ADD IN APPS SCRIPT
 * Project Settings > Script properties > Add script property
 *
 * TIKTOK_CLIENT_KEY       - copy from TikTok for Developers
 * TIKTOK_CLIENT_SECRET    - keep private; never put it in GitHub
 * TIKTOK_RELAY_SECRET     - matches your private relay environment variable
 */

/** Run this first to preview the folder, order, and caption without sending anything. */
function previewTodaysCarousel() {
  const folder = findTodaysFolder_();
  const payload = buildPayload_(folder);
  return {
    folder: folder.getName(),
    slides: payload.slides.map(file => file.getName()),
    title: payload.title,
    description: payload.description,
  };
}

/** Run this once, open the returned link, and approve the intended TikTok account. */
function startTikTokAuthorization() {
  const state = ScriptApp.newStateToken()
    .withMethod('authCallback')
    .withTimeout(600)
    .createToken();
  return CONFIG.TIKTOK_AUTHORIZE_URL + '?' + formEncode_({
    client_key: requiredProperty_('TIKTOK_CLIENT_KEY'),
    response_type: 'code',
    scope: 'user.info.basic,video.upload',
    redirect_uri: CONFIG.TIKTOK_REDIRECT_URI,
    state: state,
  });
}

/** TikTok sends the approved authorization back here. Do not run this yourself. */
function authCallback(request) {
  if (!request || request.parameter.error || !request.parameter.code) {
    return HtmlService.createHtmlOutput('TikTok authorization was not completed.');
  }
  try {
    saveTikTokToken_(fetchTikTokToken_({
      client_key: requiredProperty_('TIKTOK_CLIENT_KEY'),
      client_secret: requiredProperty_('TIKTOK_CLIENT_SECRET'),
      code: request.parameter.code,
      grant_type: 'authorization_code',
      redirect_uri: CONFIG.TIKTOK_REDIRECT_URI,
    }));
    return HtmlService.createHtmlOutput('TikTok is connected. Return to Apps Script and run sendTodaysCarouselToTikTok.');
  } catch (error) {
    return HtmlService.createHtmlOutput('TikTok token exchange failed: ' + escapeHtml_(error.message));
  }
}

/** Sends one Upload to TikTok draft. It never publishes publicly. */
function sendTodaysCarouselToTikTok() {
  try {
    const token = getValidTikTokAccessToken_();
    if (!token) throw new Error('TikTok is not connected. Run startTikTokAuthorization first.');

    const folder = findTodaysFolder_();
    const payload = buildPayload_(folder);
    const fingerprint = fingerprint_(folder, payload);
    const previous = getStatus_(folder);
    if (previous && previous.fingerprint === fingerprint) {
      return { status: 'already_sent', message: 'This exact folder has already been sent. Nothing was duplicated.' };
    }

    const batchId = Utilities.getUuid();
    const uploaded = payload.slides.map((file, index) => uploadSlideToRelay_(file, batchId, index + 1));
    try {
      const response = UrlFetchApp.fetch(CONFIG.TIKTOK_PHOTO_INIT_URL, {
        method: 'post',
        contentType: 'application/json',
        headers: { Authorization: 'Bearer ' + token },
        payload: JSON.stringify({
          post_info: {
            title: payload.title,
            description: payload.description,
            privacy_level: 'SELF_ONLY',
            disable_comment: false,
            disable_duet: false,
            disable_stitch: false,
            auto_add_music: true,
          },
          source_info: {
            source: 'PULL_FROM_URL',
            photo_cover_index: 0,
            photo_images: uploaded.map(item => item.mediaUrl),
          },
          post_mode: 'MEDIA_UPLOAD',
          media_type: 'PHOTO',
        }),
        muteHttpExceptions: true,
      });
      const body = JSON.parse(response.getContentText() || '{}');
      if (response.getResponseCode() < 200 || response.getResponseCode() >= 300 || (body.error && body.error.code !== 'ok')) {
        throw new Error('TikTok rejected the draft upload: ' + response.getContentText());
      }
      saveStatus_(folder, fingerprint, body.data && body.data.publish_id, payload);
      scheduleRelayCleanup_(uploaded.map(item => item.pathname));
      return { status: 'sent', folder: folder.getName(), slides: uploaded.length, publishId: body.data && body.data.publish_id, message: 'Draft sent. Check the authorized TikTok account on your phone.' };
    } catch (error) {
      cleanupRelayPaths_(uploaded.map(item => item.pathname));
      throw error;
    }
  } catch (error) {
    emailFailure_('TikTok draft failed', error);
    throw error;
  }
}

/** Run once to add one daily Apps Script trigger. The exact minute can vary within the chosen hour. */
function installDailyMorningTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(trigger => trigger.getHandlerFunction() === 'sendTodaysCarouselToTikTok')
    .forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('sendTodaysCarouselToTikTok')
    .timeBased()
    .atHour(9) // Replace 9 with your preferred hour from 0 through 23.
    .everyDays(1)
    .inTimezone(CONFIG.TIME_ZONE)
    .create();
}

function findTodaysFolder_() {
  const dateName = Utilities.formatDate(new Date(), CONFIG.TIME_ZONE, 'yyyy-MM-dd');
  const matches = DriveApp.getFolderById(CONFIG.DRIVE_PARENT_FOLDER_ID).getFoldersByName(dateName);
  if (!matches.hasNext()) throw new Error('Waiting for today\'s required dated folder: ' + dateName);
  const folder = matches.next();
  if (matches.hasNext()) throw new Error('More than one folder is named ' + dateName + '. Keep only one.');
  return folder;
}

function buildPayload_(folder) {
  const rows = Utilities.parseCsv(requiredFile_(folder, CONFIG.CSV_FILE_NAME).getBlob().getDataAsString('UTF-8'));
  if (rows.length !== 2) throw new Error('post-copy.csv needs one header row and one post row.');
  const record = csvRecord_(rows[0], rows[1]);
  const title = requiredField_(record, 'Title');
  const description = [requiredField_(record, 'SEO Description'), requiredField_(record, 'CTA')].filter(Boolean).join('\n\n');
  const slides = getConsecutiveSlides_(folder);
  if (title.length > 90) throw new Error('TikTok photo title is longer than 90 characters.');
  if (description.length > 4000) throw new Error('TikTok photo description is longer than 4,000 characters.');
  return { title: title, description: description, slides: slides };
}

function getConsecutiveSlides_(folder) {
  const allowedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);
  const slides = [];
  const files = folder.getFiles();
  while (files.hasNext()) {
    const file = files.next();
    const match = file.getName().match(/^(\d{2})(?:[-._].*)?\.(png|jpe?g|webp)$/i);
    if (allowedMimeTypes.has(file.getMimeType()) && match) slides.push({ file: file, number: Number(match[1]) });
  }
  slides.sort((a, b) => a.number - b.number);
  if (!slides.length) throw new Error('No numbered image slides found. Name them 01.png, 02.png, and so on.');
  if (slides.length > CONFIG.MAX_SLIDES) throw new Error('This carousel has more than ' + CONFIG.MAX_SLIDES + ' slides.');
  slides.forEach((item, index) => {
    const expected = index + 1;
    if (item.number !== expected) throw new Error('Slides must be consecutive from 01 onward. Found ' + slides.map(x => String(x.number).padStart(2, '0')).join(', ') + '.');
  });
  return slides.map(item => item.file);
}

function getValidTikTokAccessToken_() {
  const raw = PropertiesService.getUserProperties().getProperty('TIKTOK_TOKEN');
  if (!raw) return null;
  let token = JSON.parse(raw);
  if (Date.now() < Number(token.expires_at) - 60 * 1000) return token.access_token;
  if (!token.refresh_token) return null;
  token = fetchTikTokToken_({
    client_key: requiredProperty_('TIKTOK_CLIENT_KEY'),
    client_secret: requiredProperty_('TIKTOK_CLIENT_SECRET'),
    refresh_token: token.refresh_token,
    grant_type: 'refresh_token',
  });
  saveTikTokToken_(token);
  return token.access_token;
}

function fetchTikTokToken_(form) {
  const response = UrlFetchApp.fetch(CONFIG.TIKTOK_TOKEN_URL, {
    method: 'post', contentType: 'application/x-www-form-urlencoded', payload: formEncode_(form), muteHttpExceptions: true,
  });
  const body = JSON.parse(response.getContentText() || '{}');
  if (response.getResponseCode() < 200 || response.getResponseCode() >= 300 || !body.access_token) {
    throw new Error('TikTok token request failed: ' + response.getContentText());
  }
  return body;
}

function saveTikTokToken_(token) {
  token.expires_at = Date.now() + Number(token.expires_in || 0) * 1000;
  PropertiesService.getUserProperties().setProperty('TIKTOK_TOKEN', JSON.stringify(token));
}

function uploadSlideToRelay_(file, batchId, slideNumber) {
  const blob = file.getBlob();
  if (blob.getBytes().length > CONFIG.MAX_IMAGE_BYTES) throw new Error(file.getName() + ' exceeds 4 MB. Export it smaller, then try again.');
  const extension = (file.getName().match(/\.([a-z0-9]+)$/i) || [])[1].toLowerCase();
  const pathname = 'uploads/' + batchId + '/' + String(slideNumber).padStart(2, '0') + '-' + Utilities.getUuid() + '.' + extension;
  const response = UrlFetchApp.fetch(CONFIG.RELAY_BASE_URL + '/api/upload', {
    method: 'post',
    payload: blob.getBytes(),
    headers: {
      'x-relay-secret': requiredProperty_('TIKTOK_RELAY_SECRET'),
      'x-relay-path': pathname,
      'x-relay-ttl': String(CONFIG.RELAY_URL_TTL_SECONDS),
      'Content-Type': blob.getContentType(),
    },
    muteHttpExceptions: true,
  });
  const body = JSON.parse(response.getContentText() || '{}');
  if (response.getResponseCode() !== 201 || !body.mediaUrl) throw new Error('Relay upload failed for ' + file.getName() + ': ' + response.getContentText());
  return body;
}

function fingerprint_(folder, payload) {
  const csv = requiredFile_(folder, CONFIG.CSV_FILE_NAME);
  const ingredients = payload.slides.map(file => file.getId() + ':' + file.getLastUpdated().getTime()).join('|') + '|' + csv.getId() + ':' + csv.getLastUpdated().getTime();
  return Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, ingredients)).replace(/=+$/, '');
}

function getStatus_(folder) {
  const file = optionalFile_(folder, CONFIG.STATUS_FILE_NAME);
  try { return file ? JSON.parse(file.getBlob().getDataAsString()) : null; } catch (error) { return null; }
}

function saveStatus_(folder, fingerprint, publishId, payload) {
  const value = JSON.stringify({ fingerprint: fingerprint, publishId: publishId, sentAt: new Date().toISOString(), title: payload.title });
  const existing = optionalFile_(folder, CONFIG.STATUS_FILE_NAME);
  if (existing) existing.setContent(value); else folder.createFile(CONFIG.STATUS_FILE_NAME, value, MimeType.PLAIN_TEXT);
}

function scheduleRelayCleanup_(pathnames) {
  const properties = PropertiesService.getUserProperties();
  properties.setProperty('PENDING_RELAY_CLEANUP', JSON.stringify(pathnames));
  ScriptApp.getProjectTriggers().filter(trigger => trigger.getHandlerFunction() === 'cleanupRelayMedia_').forEach(trigger => ScriptApp.deleteTrigger(trigger));
  ScriptApp.newTrigger('cleanupRelayMedia_').timeBased().after((CONFIG.RELAY_URL_TTL_SECONDS + 300) * 1000).create();
}

function cleanupRelayMedia_() {
  const properties = PropertiesService.getUserProperties();
  const raw = properties.getProperty('PENDING_RELAY_CLEANUP');
  if (raw) cleanupRelayPaths_(JSON.parse(raw));
  properties.deleteProperty('PENDING_RELAY_CLEANUP');
}

function cleanupRelayPaths_(pathnames) {
  if (!pathnames.length) return;
  UrlFetchApp.fetch(CONFIG.RELAY_BASE_URL + '/api/cleanup', {
    method: 'post', contentType: 'application/json',
    headers: { 'x-relay-secret': requiredProperty_('TIKTOK_RELAY_SECRET') },
    payload: JSON.stringify({ pathnames: pathnames }), muteHttpExceptions: true,
  });
}

function emailFailure_(subject, error) {
  if (!CONFIG.ALERT_EMAIL || CONFIG.ALERT_EMAIL.indexOf('REPLACE_THIS') !== -1) return;
  MailApp.sendEmail(CONFIG.ALERT_EMAIL, 'ACTION NEEDED: ' + subject, String(error && error.stack || error));
}

function csvRecord_(headers, values) {
  const record = {};
  headers.forEach((header, index) => record[String(header).replace(/^\uFEFF/, '').trim()] = String(values[index] || '').trim());
  return record;
}

function requiredField_(record, key) { if (!record[key]) throw new Error('post-copy.csv is missing ' + key + '.'); return record[key]; }
function optionalFile_(folder, name) { const files = folder.getFilesByName(name); return files.hasNext() ? files.next() : null; }
function requiredFile_(folder, name) { const file = optionalFile_(folder, name); if (!file) throw new Error('Missing ' + name + ' in ' + folder.getName() + '.'); return file; }
function requiredProperty_(key) { const value = PropertiesService.getScriptProperties().getProperty(key); if (!value) throw new Error('Missing Script Property: ' + key); return value; }
function formEncode_(object) { return Object.keys(object).filter(key => object[key] !== undefined && object[key] !== null).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(object[key])).join('&'); }
function escapeHtml_(value) { return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]); }
