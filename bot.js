/**
 * ═══════════════════════════════════════════════════
 *   ISLAMIC KNOWLEDGE BOT — Full Hadith Collections
 *   Powered by fawazahmed0/hadith-api (no key needed)
 *   + AlQuran.cloud API for Quran
 * ═══════════════════════════════════════════════════
 */

require("dotenv").config();
const {
  Client, GatewayIntentBits, EmbedBuilder,
  SlashCommandBuilder, REST, Routes,
  ActionRowBuilder, ButtonBuilder, ButtonStyle,
  StringSelectMenuBuilder
} = require("discord.js");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const {
  SCHOLARS, SCHOLAR_KEYS,
  FATAWA, FATWA_TOPICS, FATWA_TOPIC_KEYS,
  getFatawaByScholar, getFatawaByTopic,
  getRandomFatwa, searchFatawa,
} = require("./fatawa");

// ─────────────────────────────────────────────────────
//  COLLECTION REGISTRY  (all free, no API key needed)
//  Source: cdn.jsdelivr.net/gh/fawazahmed0/hadith-api
// ─────────────────────────────────────────────────────
const COLLECTIONS = {
  bukhari:  { name: "Sahih al-Bukhari",     color: 0x1B5E20, emoji: "📗", edition: "eng-bukhari",  totalHadiths: 7563 },
  muslim:   { name: "Sahih Muslim",         color: 0x0D47A1, emoji: "📘", edition: "eng-muslim",   totalHadiths: 7563 },
  abudawud: { name: "Sunan Abu Dawud",      color: 0x4A148C, emoji: "📙", edition: "eng-abudawud", totalHadiths: 5274 },
  tirmidhi: { name: "Jami' al-Tirmidhi",   color: 0x880E4F, emoji: "📕", edition: "eng-tirmidhi", totalHadiths: 3956 },
  ibnmajah: { name: "Sunan Ibn Majah",      color: 0x004D40, emoji: "📒", edition: "eng-ibnmajah", totalHadiths: 4341 },
  nasai:    { name: "Sunan al-Nasai",       color: 0x37474F, emoji: "📓", edition: "eng-nasai",    totalHadiths: 5758 },
  malik:    { name: "Muwatta Imam Malik",   color: 0x6D4C41, emoji: "📔", edition: "eng-malik",    totalHadiths: 1832 },
  nawawi:   { name: "40 Hadith al-Nawawi",  color: 0x1A237E, emoji: "🌿", edition: "eng-nawawi",   totalHadiths: 42   },
  qudsi:    { name: "40 Hadith Qudsi",      color: 0x311B92, emoji: "✨", edition: "eng-qudsi",    totalHadiths: 40   },
};

const COLLECTION_KEYS = Object.keys(COLLECTIONS);
const CDN       = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions";
const QURAN_API = "https://api.alquran.cloud/v1";

// ─────────────────────────────────────────────────────
//  QURAN TRANSLATION REGISTRY
//  All free via alquran.cloud — no key needed
//  Fetch multiple editions in one request using:
//  /ayah/2:255/editions/en.asad,en.pickthall,en.sahih
// ─────────────────────────────────────────────────────
const TRANSLATIONS = {
  "en.asad":        { name: "Muhammad Asad",              lang: "English",  flag: "🇬🇧" },
  "en.pickthall":   { name: "Marmaduke Pickthall",        lang: "English",  flag: "🇬🇧" },
  "en.sahih":       { name: "Saheeh International",       lang: "English",  flag: "🇬🇧" },
  "en.yusufali":    { name: "Yusuf Ali",                  lang: "English",  flag: "🇬🇧" },
  "en.hilali":      { name: "Al-Hilali & Khan",           lang: "English",  flag: "🇸🇦" },
  "en.itani":       { name: "Clear Quran (Talal Itani)",  lang: "English",  flag: "🇬🇧" },
  "ar.muyassar":    { name: "Al-Tafsir Al-Muyassar",      lang: "Arabic",   flag: "🇸🇦" },
  "fr.hamidullah":  { name: "Muhammad Hamidullah",        lang: "French",   flag: "🇫🇷" },
  "de.bubenheim":   { name: "Bubenheim & Elyas",          lang: "German",   flag: "🇩🇪" },
  "tr.diyanet":     { name: "Diyanet Isleri",             lang: "Turkish",  flag: "🇹🇷" },
  "ur.jalandhry":   { name: "Fateh Muhammad Jalandhry",   lang: "Urdu",     flag: "🇵🇰" },
  "ur.ahmedali":    { name: "Ahmed Ali",                  lang: "Urdu",     flag: "🇵🇰" },
  "ru.kuliev":      { name: "Elmir Kuliev",               lang: "Russian",  flag: "🇷🇺" },
  "bn.bengali":     { name: "Muhiuddin Khan",             lang: "Bengali",  flag: "🇧🇩" },
  "id.indonesian":  { name: "Indonesian Ministry",        lang: "Indonesian", flag: "🇮🇩" },
  "ms.basmeih":     { name: "Abdullah Muhammad Basmeih",  lang: "Malay",    flag: "🇲🇾" },
  "zh.majian":      { name: "Ma Jian",                    lang: "Chinese",  flag: "🇨🇳" },
  "es.cortes":      { name: "Julio Cortes",               lang: "Spanish",  flag: "🇪🇸" },
};

const TRANSLATION_KEYS = Object.keys(TRANSLATIONS);
const DEFAULT_TRANSLATION = "en.sahih";

// Collections where ALL hadiths are considered Sahih by default
// (no per-hadith grading needed — the entire book is authenticated)
const SAHIH_BY_DEFAULT = new Set(["bukhari", "muslim", "nawawi", "qudsi"]);

// Grade display config
const GRADE_CONFIG = {
  sahih:        { label: "Sahih — Authentic",          emoji: "🟢", color: 0x1B5E20 },
  hasan:        { label: "Hasan — Good",               emoji: "🟡", color: 0xF9A825 },
  daif:         { label: "Da'if — Weak",               emoji: "🔴", color: 0xB71C1C },
  "daif ":      { label: "Da'if — Weak",               emoji: "🔴", color: 0xB71C1C },
  sahihdarussalam: { label: "Sahih (Darussalam)",      emoji: "🟢", color: 0x1B5E20 },
  hasandarussalam: { label: "Hasan (Darussalam)",      emoji: "🟡", color: 0xF9A825 },
  daifdarussalam:  { label: "Da'if (Darussalam)",      emoji: "🔴", color: 0xB71C1C },
  "hasan sahih":   { label: "Hasan Sahih",             emoji: "🟢", color: 0x2E7D32 },
  mawdu:           { label: "Mawdu' — Fabricated",     emoji: "⛔", color: 0x000000 },
  mursal:          { label: "Mursal",                  emoji: "🟠", color: 0xE65100 },
};

function parseGrade(gradeStr) {
  if (!gradeStr) return null;
  const normalized = gradeStr.toLowerCase().replace(/\s+/g, " ").trim();
  // Direct match
  if (GRADE_CONFIG[normalized]) return { raw: gradeStr, ...GRADE_CONFIG[normalized] };
  // Partial match
  for (const [key, val] of Object.entries(GRADE_CONFIG)) {
    if (normalized.includes(key)) return { raw: gradeStr, ...val };
  }
  // Unknown grade — still show it
  return { raw: gradeStr, label: gradeStr, emoji: "⚪", color: null };
}

// ─────────────────────────────────────────────────────
//  API HELPERS
// ─────────────────────────────────────────────────────
async function fetchHadith(edition, number) {
  const res = await fetch(`${CDN}/${edition}/${number}.min.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchRandomHadith(collectionKey) {
  const col = COLLECTIONS[collectionKey];
  const num = Math.floor(Math.random() * col.totalHadiths) + 1;
  try {
    const data = await fetchHadith(col.edition, num);
    return { data, number: num };
  } catch {
    const data = await fetchHadith(col.edition, 1);
    return { data, number: 1 };
  }
}

async function fetchAyah(surah, ayah, translationKey = DEFAULT_TRANSLATION) {
  // Fetch English (Sahih Int) + Arabic + requested translation in one call
  const editions = [...new Set([translationKey, "quran-uthmani"])].join(",");
  const res = await fetch(`${QURAN_API}/ayah/${surah}:${ayah}/editions/${editions}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchRandomAyah(translationKey = DEFAULT_TRANSLATION) {
  const surah = Math.floor(Math.random() * 114) + 1;
  const infoRes = await fetch(`${QURAN_API}/surah/${surah}`);
  const info = await infoRes.json();
  const ayahCount = info.data?.numberOfAyahs || 7;
  const ayah = Math.floor(Math.random() * ayahCount) + 1;
  return fetchAyah(surah, ayah, translationKey);
}

// ─────────────────────────────────────────────────────
//  EMBED BUILDERS
// ─────────────────────────────────────────────────────
function buildHadithEmbed(collectionKey, hadithData, number, includeArabic = false, arabicData = null) {
  const col    = COLLECTIONS[collectionKey];
  const hadith = hadithData?.hadiths?.[0] || {};
  const text   = hadith.text || hadithData?.text || "Text unavailable.";
  const section = hadithData?.metadata?.name || hadithData?.section?.title || null;

  // Grade detection
  let grade = null;
  if (SAHIH_BY_DEFAULT.has(collectionKey)) {
    grade = { label: "Sahih — Authentic", emoji: "🟢", color: 0x1B5E20 };
  } else {
    const rawGrade = hadith.grades?.[0]?.grade || hadith.grade || null;
    if (rawGrade) grade = parseGrade(rawGrade);
  }

  const embed = new EmbedBuilder()
    .setColor(grade?.color || col.color)
    .setAuthor({ name: `${col.emoji}  ${col.name}  •  Hadith #${number}` })
    .setDescription(`*"${text}"*`)
    .setFooter({ text: "No knowledge except what Allah has taught • لا علم إلا ما علَّم الله" })
    .setTimestamp();

  if (grade) {
    embed.addFields({ name: "📊 Grade", value: `${grade.emoji}  **${grade.label}**`, inline: true });
  }

  embed.addFields(
    { name: "📖 Collection", value: col.name,    inline: true },
    { name: "🔢 Number",     value: `#${number}`, inline: true }
  );

  if (section) {
    embed.addFields({ name: "📂 Chapter", value: section });
  }

  if (includeArabic && arabicData) {
    const arabicText = arabicData?.hadiths?.[0]?.text || arabicData?.text;
    if (arabicText) {
      embed.addFields({ name: "🕌 Arabic Text", value: `\`\`\`${arabicText.substring(0, 1000)}\`\`\`` });
    }
  }

  return embed;
}

function buildAyahEmbed(ayahData, translationKey = DEFAULT_TRANSLATION) {
  // Multi-edition response: ayahData.data is an array of edition objects
  const editions = ayahData?.data;
  if (!editions || !Array.isArray(editions)) {
    // Fallback: single edition response
    const a = ayahData?.data;
    if (!a) return new EmbedBuilder().setColor(0x2E7D32).setDescription("Could not fetch ayah.");
    return new EmbedBuilder().setColor(0x2E7D32).setDescription(`*"${a.text}"*`);
  }

  // Find translation and arabic editions
  const transEdition  = editions.find(e => e.edition?.identifier === translationKey) || editions[0];
  const arabicEdition = editions.find(e => e.edition?.identifier === "quran-uthmani");

  const surahName    = transEdition?.surah?.englishName || "";
  const surahArabic  = transEdition?.surah?.name || "";
  const surahNum     = transEdition?.surah?.number || "";
  const ayahNum      = transEdition?.numberInSurah || "";
  const transInfo    = TRANSLATIONS[translationKey] || { name: translationKey, flag: "🌐" };
  const transText    = transEdition?.text || "Translation unavailable.";
  const arabicText   = arabicEdition?.text || null;

  const embed = new EmbedBuilder()
    .setColor(0x2E7D32)
    .setAuthor({ name: `📖  ${surahName} (${surahArabic})  •  Ayah ${surahNum}:${ayahNum}` })
    .setDescription(`*"${transText}"*`);

  if (arabicText) {
    embed.addFields({ name: "🕌 Arabic", value: arabicText });
  }

  embed.addFields(
    { name: "📍 Reference",    value: `${surahName} ${surahNum}:${ayahNum}`, inline: true },
    { name: "🌐 Translation",  value: `${transInfo.flag} ${transInfo.name}`, inline: true },
    { name: "🗣️ Language",    value: transInfo.lang,                         inline: true }
  )
  .setFooter({ text: "القرآن الكريم — The Noble Quran" })
  .setTimestamp();

  return embed;
}

function buildTranslationSelectMenu(currentKey = DEFAULT_TRANSLATION) {
  // Discord limits select menus to 25 options
  const options = TRANSLATION_KEYS.slice(0, 25).map(k => ({
    label: `${TRANSLATIONS[k].flag} ${TRANSLATIONS[k].name}`,
    description: TRANSLATIONS[k].lang,
    value: k,
    default: k === currentKey,
  }));
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_translation")
      .setPlaceholder("Switch translation...")
      .addOptions(options)
  );
}

function buildAyahNavButtons(surah, ayahNum, maxAyah, translationKey) {
  const prev = Math.max(1, ayahNum - 1);
  const next = Math.min(maxAyah, ayahNum + 1);
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`ayahnav_${surah}_${prev}_${translationKey}`).setLabel("◀ Prev Ayah").setStyle(ButtonStyle.Secondary).setDisabled(ayahNum <= 1),
    new ButtonBuilder().setCustomId(`ayahnav_${surah}_${next}_${translationKey}`).setLabel("Next Ayah ▶").setStyle(ButtonStyle.Secondary).setDisabled(ayahNum >= maxAyah),
    new ButtonBuilder().setCustomId(`ayahrandom_${translationKey}`).setLabel("🎲 Random").setStyle(ButtonStyle.Primary)
  );
}

function buildCollectionListEmbed() {
  const totalHadiths = Object.values(COLLECTIONS).reduce((s, c) => s + c.totalHadiths, 0);
  return new EmbedBuilder()
    .setColor(0x5C4033)
    .setTitle("📚  Available Hadith Collections")
    .setDescription(
      Object.entries(COLLECTIONS).map(([k, v]) =>
        `${v.emoji} **${v.name}** — ${v.totalHadiths.toLocaleString()} hadiths`
      ).join("\n") +
      `\n\n**Total: ${totalHadiths.toLocaleString()} hadiths** across ${COLLECTION_KEYS.length} collections\n` +
      `📖 **Quran** — 6,236 ayahs across 114 surahs`
    )
    .setFooter({ text: "All sourced from fawazahmed0/hadith-api + alquran.cloud — no key required" });
}

function buildNavButtons(collectionKey, currentNum) {
  const col  = COLLECTIONS[collectionKey];
  const prev = Math.max(1, currentNum - 1);
  const next = Math.min(col.totalHadiths, currentNum + 1);
  const rand = Math.floor(Math.random() * col.totalHadiths) + 1;

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`nav_${collectionKey}_${prev}`).setLabel("◀ Prev").setStyle(ButtonStyle.Secondary).setDisabled(currentNum <= 1),
    new ButtonBuilder().setCustomId(`nav_${collectionKey}_${next}`).setLabel("Next ▶").setStyle(ButtonStyle.Secondary).setDisabled(currentNum >= col.totalHadiths),
    new ButtonBuilder().setCustomId(`nav_${collectionKey}_${rand}`).setLabel("🎲 Random").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`arabic_${collectionKey}_${currentNum}`).setLabel("🕌 Show Arabic").setStyle(ButtonStyle.Secondary)
  );
}

function buildCollectionMenu() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_collection")
      .setPlaceholder("Switch collection...")
      .addOptions(
        COLLECTION_KEYS.map(k => ({
          label: COLLECTIONS[k].name,
          description: `${COLLECTIONS[k].totalHadiths.toLocaleString()} hadiths`,
          value: k,
          emoji: COLLECTIONS[k].emoji,
        }))
      )
  );
}

function buildFatwaEmbed(fatwa) {
  const scholar = SCHOLARS[fatwa.scholar];
  const topic   = FATWA_TOPICS[fatwa.topic] || { label: fatwa.topic, emoji: "📜" };

  return new EmbedBuilder()
    .setColor(scholar.color)
    .setAuthor({ name: `${scholar.emoji}  ${scholar.name}  (${scholar.dates})` })
    .setTitle(`${topic.emoji}  ${fatwa.question}`)
    .setDescription(fatwa.answer)
    .addFields(
      { name: "📚 Source",   value: `**${fatwa.source.book}**`, inline: true },
      { name: "🔢 Vol/Page", value: `Vol. ${fatwa.source.volume}, p. ${fatwa.source.page}`, inline: true },
      { name: "🏷️ Topic",   value: topic.label, inline: true }
    )
    .setFooter({ text: `${scholar.arabic} • رحمه الله` })
    .setTimestamp();
}

function buildScholarListEmbed() {
  return new EmbedBuilder()
    .setColor(0x4E342E)
    .setTitle("📜  Scholars in the Fatawa Database")
    .setDescription(
      SCHOLAR_KEYS.map(k => {
        const s = SCHOLARS[k];
        const count = getFatawaByScholar(k).length;
        return `${s.emoji} **${s.name}** (${s.dates})\n${s.bio.substring(0, 100)}...\n*${count} fatawa in database*`;
      }).join("\n\n")
    )
    .setFooter({ text: "Use /fatwa to browse • رحمهم الله أجمعين" });
}

function buildFatwaNavButtons(fatwaId, scholarFilter, topicFilter) {
  const pool = FATAWA.filter(f =>
    (!scholarFilter || f.scholar === scholarFilter) &&
    (!topicFilter   || f.topic === topicFilter || f.tags.includes(topicFilter))
  );
  const idx  = pool.findIndex(f => f.id === fatwaId);
  const prev = pool[idx - 1];
  const next = pool[idx + 1];
  const rand = pool[Math.floor(Math.random() * pool.length)];

  const row = new ActionRowBuilder();
  if (prev) row.addComponents(
    new ButtonBuilder().setCustomId(`fatwa_nav_${prev.id}_${scholarFilter||""}_${topicFilter||""}`).setLabel("◀ Prev").setStyle(ButtonStyle.Secondary)
  );
  if (next) row.addComponents(
    new ButtonBuilder().setCustomId(`fatwa_nav_${next.id}_${scholarFilter||""}_${topicFilter||""}`).setLabel("Next ▶").setStyle(ButtonStyle.Secondary)
  );
  if (rand) row.addComponents(
    new ButtonBuilder().setCustomId(`fatwa_nav_${rand.id}_${scholarFilter||""}_${topicFilter||""}`).setLabel("🎲 Random").setStyle(ButtonStyle.Primary)
  );
  return row.components.length ? row : null;
}

function buildScholarSelectMenu() {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_scholar")
      .setPlaceholder("Filter by scholar...")
      .addOptions([
        { label: "All Scholars", value: "all", emoji: "📜" },
        ...SCHOLAR_KEYS.map(k => ({
          label: SCHOLARS[k].name,
          description: SCHOLARS[k].dates,
          value: k,
          emoji: SCHOLARS[k].emoji,
        }))
      ])
  );
}

function buildTopicSelectMenu() {
  const options = FATWA_TOPIC_KEYS.slice(0, 25).map(k => ({
    label: FATWA_TOPICS[k].label,
    value: k,
    emoji: FATWA_TOPICS[k].emoji,
  }));
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_fatwa_topic")
      .setPlaceholder("Filter by topic...")
      .addOptions(options)
  );
}

function buildErrorEmbed(msg) {
  return new EmbedBuilder()
    .setColor(0xB71C1C)
    .setTitle("⚠️  Could not load")
    .setDescription(msg)
    .setFooter({ text: "Try a different number or collection" });
}

// ─────────────────────────────────────────────────────
//  SLASH COMMAND DEFINITIONS
// ─────────────────────────────────────────────────────
const commands = [

  new SlashCommandBuilder()
    .setName("hadith")
    .setDescription("Get a specific hadith by number")
    .addStringOption(o =>
      o.setName("collection").setDescription("The hadith collection").setRequired(true)
        .addChoices(...COLLECTION_KEYS.map(k => ({ name: COLLECTIONS[k].name, value: k })))
    )
    .addIntegerOption(o =>
      o.setName("number").setDescription("Hadith number").setRequired(true).setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName("random")
    .setDescription("Get a random hadith from any or a specific collection")
    .addStringOption(o =>
      o.setName("collection").setDescription("Pick a collection (leave blank for any)")
        .addChoices(...COLLECTION_KEYS.map(k => ({ name: COLLECTIONS[k].name, value: k })))
    ),

  new SlashCommandBuilder()
    .setName("browse")
    .setDescription("Browse a collection interactively with prev/next buttons")
    .addStringOption(o =>
      o.setName("collection").setDescription("The hadith collection").setRequired(true)
        .addChoices(...COLLECTION_KEYS.map(k => ({ name: COLLECTIONS[k].name, value: k })))
    )
    .addIntegerOption(o =>
      o.setName("start").setDescription("Start at hadith number (default 1)").setMinValue(1)
    ),

  new SlashCommandBuilder()
    .setName("ayah")
    .setDescription("Get a Quran verse by surah and ayah number")
    .addIntegerOption(o => o.setName("surah").setDescription("Surah number (1–114)").setRequired(true).setMinValue(1).setMaxValue(114))
    .addIntegerOption(o => o.setName("ayah").setDescription("Ayah number").setRequired(true).setMinValue(1))
    .addStringOption(o =>
      o.setName("translation").setDescription("Translation to use (default: Saheeh International)")
        .addChoices(...TRANSLATION_KEYS.slice(0, 25).map(k => ({ name: `${TRANSLATIONS[k].flag} ${TRANSLATIONS[k].name} (${TRANSLATIONS[k].lang})`, value: k })))
    ),

  new SlashCommandBuilder()
    .setName("randomayah")
    .setDescription("Get a random Quran verse")
    .addStringOption(o =>
      o.setName("translation").setDescription("Translation to use (default: Saheeh International)")
        .addChoices(...TRANSLATION_KEYS.slice(0, 25).map(k => ({ name: `${TRANSLATIONS[k].flag} ${TRANSLATIONS[k].name} (${TRANSLATIONS[k].lang})`, value: k })))
    ),

  new SlashCommandBuilder()
    .setName("translations")
    .setDescription("List all available Quran translations"),

  new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Today's daily reminder — auto-selected hadith + ayah, changes every day"),

  new SlashCommandBuilder()
    .setName("collections")
    .setDescription("List all available hadith collections and their sizes"),

  new SlashCommandBuilder()
    .setName("explore")
    .setDescription("Open an interactive collection explorer with a dropdown menu"),

  new SlashCommandBuilder()
    .setName("fatwa")
    .setDescription("Get a fatwa from Ibn Taymiyyah, Ibn al-Qayyim, Ibn Baz, or Ibn Uthaymeen")
    .addStringOption(o =>
      o.setName("scholar").setDescription("Filter by scholar")
        .addChoices(
          { name: "All Scholars", value: "all" },
          ...SCHOLAR_KEYS.map(k => ({ name: SCHOLARS[k].name, value: k }))
        )
    )
    .addStringOption(o =>
      o.setName("topic").setDescription("Filter by topic")
        .addChoices(...FATWA_TOPIC_KEYS.slice(0, 25).map(k => ({ name: FATWA_TOPICS[k].label, value: k })))
    ),

  new SlashCommandBuilder()
    .setName("scholars")
    .setDescription("List all scholars in the fatawa database with their backgrounds"),

  new SlashCommandBuilder()
    .setName("searchfatwa")
    .setDescription("Search fatawa by keyword")
    .addStringOption(o =>
      o.setName("keyword").setDescription("Keyword to search for").setRequired(true)
    ),

].map(c => c.toJSON());

// ─────────────────────────────────────────────────────
//  BOT EVENTS
// ─────────────────────────────────────────────────────
client.once("ready", async () => {
  console.log(`✅ Bot ready: ${client.user.tag}`);
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log("✅ Slash commands registered globally");
  } catch (e) {
    console.error("Command registration error:", e);
  }
});

client.on("interactionCreate", async interaction => {

  // ── SLASH COMMANDS ─────────────────────────────────
  if (interaction.isChatInputCommand()) {
    await interaction.deferReply();
    const cmd = interaction.commandName;

    if (cmd === "hadith") {
      const colKey = interaction.options.getString("collection");
      const num    = interaction.options.getInteger("number");
      const col    = COLLECTIONS[colKey];
      if (num > col.totalHadiths) {
        return interaction.editReply({ embeds: [buildErrorEmbed(`${col.name} only goes up to #${col.totalHadiths}.`)] });
      }
      try {
        const data = await fetchHadith(col.edition, num);
        await interaction.editReply({
          embeds: [buildHadithEmbed(colKey, data, num)],
          components: [buildNavButtons(colKey, num), buildCollectionMenu()]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed(`Hadith #${num} could not be loaded.`)] });
      }
    }

    else if (cmd === "random") {
      const colKey = interaction.options.getString("collection")
        || COLLECTION_KEYS[Math.floor(Math.random() * COLLECTION_KEYS.length)];
      try {
        const { data, number } = await fetchRandomHadith(colKey);
        await interaction.editReply({
          embeds: [buildHadithEmbed(colKey, data, number)],
          components: [buildNavButtons(colKey, number), buildCollectionMenu()]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed("Could not fetch a random hadith. Try again.")] });
      }
    }

    else if (cmd === "browse") {
      const colKey = interaction.options.getString("collection");
      const start  = interaction.options.getInteger("start") || 1;
      try {
        const data = await fetchHadith(COLLECTIONS[colKey].edition, start);
        await interaction.editReply({
          embeds: [buildHadithEmbed(colKey, data, start)],
          components: [buildNavButtons(colKey, start), buildCollectionMenu()]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed("Could not load that hadith.")] });
      }
    }

    else if (cmd === "ayah") {
      const surah      = interaction.options.getInteger("surah");
      const ayahNum    = interaction.options.getInteger("ayah");
      const transKey   = interaction.options.getString("translation") || DEFAULT_TRANSLATION;
      try {
        const data = await fetchAyah(surah, ayahNum, transKey);
        // Get max ayahs in this surah for nav buttons
        const surahInfo = await fetch(`${QURAN_API}/surah/${surah}`).then(r => r.json());
        const maxAyah   = surahInfo?.data?.numberOfAyahs || 286;
        await interaction.editReply({
          embeds: [buildAyahEmbed(data, transKey)],
          components: [buildTranslationSelectMenu(transKey), buildAyahNavButtons(surah, ayahNum, maxAyah, transKey)]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed(`Could not load ${surah}:${ayahNum}. Check the ayah number.`)] });
      }
    }

    else if (cmd === "randomayah") {
      const transKey = interaction.options.getString("translation") || DEFAULT_TRANSLATION;
      try {
        const data = await fetchRandomAyah(transKey);
        const editions = data?.data;
        const first = Array.isArray(editions) ? editions[0] : editions;
        const surahNum = first?.surah?.number || 1;
        const ayahNum  = first?.numberInSurah || 1;
        const maxAyah  = first?.surah?.numberOfAyahs || 7;
        await interaction.editReply({
          embeds: [buildAyahEmbed(data, transKey)],
          components: [buildTranslationSelectMenu(transKey), buildAyahNavButtons(surahNum, ayahNum, maxAyah, transKey)]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed("Could not fetch a random ayah.")] });
      }
    }

    else if (cmd === "translations") {
      const embed = new EmbedBuilder()
        .setColor(0x2E7D32)
        .setTitle("🌍  Available Quran Translations")
        .setDescription(
          Object.entries(TRANSLATIONS).map(([k, v]) =>
            `${v.flag} **${v.name}** — ${v.lang} \`${k}\``
          ).join("\n")
        )
        .addFields({ name: "Usage", value: "Use `/ayah` or `/randomayah` and pick a translation from the dropdown, or pass it as an option." })
        .setFooter({ text: "All translations via alquran.cloud — free, no key required" });
      await interaction.editReply({ embeds: [embed] });
    }

    else if (cmd === "daily") {
      const today  = new Date();
      const seed   = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
      const colKey = COLLECTION_KEYS[seed % COLLECTION_KEYS.length];
      const col    = COLLECTIONS[colKey];
      const hNum   = (seed % col.totalHadiths) + 1;

      try {
        const [hData, aData] = await Promise.all([
          fetchHadith(col.edition, hNum),
          fetchRandomAyah(DEFAULT_TRANSLATION)
        ]);
        const hEmbed = buildHadithEmbed(colKey, hData, hNum);
        hEmbed.setTitle(`🌅  Daily Hadith — ${today.toDateString()}`);
        const aEmbed = buildAyahEmbed(aData);
        aEmbed.setTitle("📖  Daily Ayah");
        await interaction.editReply({ embeds: [hEmbed, aEmbed] });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed("Could not load daily content.")] });
      }
    }

    else if (cmd === "collections") {
      await interaction.editReply({ embeds: [buildCollectionListEmbed()] });
    }

    else if (cmd === "fatwa") {
      const scholarKey = interaction.options.getString("scholar") || "all";
      const topic      = interaction.options.getString("topic") || null;
      const filter = {};
      if (scholarKey !== "all") filter.scholar = scholarKey;
      if (topic) filter.topic = topic;
      const fatwa = getRandomFatwa(filter);
      if (!fatwa) {
        return interaction.editReply({ embeds: [buildErrorEmbed("No fatawa found for that combination. Try different filters.")] });
      }
      const navRow = buildFatwaNavButtons(fatwa.id, filter.scholar || "", filter.topic || "");
      const components = [buildScholarSelectMenu(), buildTopicSelectMenu()];
      if (navRow) components.push(navRow);
      await interaction.editReply({ embeds: [buildFatwaEmbed(fatwa)], components });
    }

    else if (cmd === "scholars") {
      await interaction.editReply({ embeds: [buildScholarListEmbed()], components: [buildScholarSelectMenu()] });
    }

    else if (cmd === "searchfatwa") {
      const keyword = interaction.options.getString("keyword");
      const results = searchFatawa(keyword);
      if (!results.length) {
        return interaction.editReply({ embeds: [buildErrorEmbed(`No fatawa found for keyword: "${keyword}". Try a different word.`)] });
      }
      const fatwa = results[0];
      const navRow = buildFatwaNavButtons(fatwa.id, "", "");
      const components = [buildScholarSelectMenu(), buildTopicSelectMenu()];
      if (navRow) components.push(navRow);
      const embed = buildFatwaEmbed(fatwa);
      embed.setFooter({ text: `Found ${results.length} result(s) for "${keyword}" • showing first result` });
      await interaction.editReply({ embeds: [embed], components });
    }

    else if (cmd === "explore") {
      const embed = new EmbedBuilder()
        .setColor(0x4E342E)
        .setTitle("📚  Islamic Knowledge Explorer")
        .setDescription(
          "Select a collection from the dropdown to start browsing.\nUse **◀ Prev / Next ▶** to go hadith by hadith, or **🎲 Random** to jump.\n\n" +
          COLLECTION_KEYS.map(k => `${COLLECTIONS[k].emoji} **${COLLECTIONS[k].name}** — ${COLLECTIONS[k].totalHadiths.toLocaleString()} hadiths`).join("\n")
        )
        .setFooter({ text: "بسم الله الرحمن الرحيم • In the name of Allah" });
      await interaction.editReply({ embeds: [embed], components: [buildCollectionMenu()] });
    }
  }

  // ── SELECT MENU ────────────────────────────────────
  else if (interaction.isStringSelectMenu() && interaction.customId === "select_collection") {
    await interaction.deferUpdate();
    const colKey = interaction.values[0];
    try {
      const data = await fetchHadith(COLLECTIONS[colKey].edition, 1);
      await interaction.editReply({
        embeds: [buildHadithEmbed(colKey, data, 1)],
        components: [buildNavButtons(colKey, 1), buildCollectionMenu()]
      });
    } catch {
      await interaction.editReply({ embeds: [buildErrorEmbed("Could not load that collection.")] });
    }
  }

  // ── BUTTONS ────────────────────────────────────────
  else if (interaction.isButton()) {
    const parts    = interaction.customId.split("_");
    const action   = parts[0];
    const colKey   = parts[1];
    const num      = parseInt(parts[2]);

    if (action === "nav") {
      await interaction.deferUpdate();
      try {
        const data = await fetchHadith(COLLECTIONS[colKey].edition, num);
        await interaction.editReply({
          embeds: [buildHadithEmbed(colKey, data, num)],
          components: [buildNavButtons(colKey, num), buildCollectionMenu()]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed(`Could not load hadith #${num}.`)] });
      }
    }

    else if (action === "arabic") {
      await interaction.deferUpdate();
      const col = COLLECTIONS[colKey];
      const arabicEdition = col.edition.replace(/^eng-/, "ara-");
      try {
        const [engData, araData] = await Promise.all([
          fetchHadith(col.edition, num),
          fetchHadith(arabicEdition, num).catch(() => null)
        ]);
        await interaction.editReply({
          embeds: [buildHadithEmbed(colKey, engData, num, true, araData)],
          components: [buildNavButtons(colKey, num), buildCollectionMenu()]
        });
      } catch {
        await interaction.editReply({ embeds: [buildErrorEmbed(`Could not load Arabic text for #${num}.`)] });
      }
    }
  }

  // ── TRANSLATION SELECT MENU ───────────────────────
  else if (interaction.isStringSelectMenu() && interaction.customId === "select_translation") {
    await interaction.deferUpdate();
    const transKey = interaction.values[0];
    // Parse current ayah reference from existing embed footer/author
    const currentEmbed = interaction.message.embeds[0];
    const authorName   = currentEmbed?.author?.name || "";
    // Author format: "📖  SurahName (Arabic)  •  Ayah X:Y"
    const match = authorName.match(/Ayah\s+(\d+):(\d+)/);
    const surahNum = match ? parseInt(match[1]) : 1;
    const ayahNum  = match ? parseInt(match[2]) : 1;
    try {
      const data      = await fetchAyah(surahNum, ayahNum, transKey);
      const surahInfo = await fetch(`${QURAN_API}/surah/${surahNum}`).then(r => r.json());
      const maxAyah   = surahInfo?.data?.numberOfAyahs || 286;
      await interaction.editReply({
        embeds: [buildAyahEmbed(data, transKey)],
        components: [buildTranslationSelectMenu(transKey), buildAyahNavButtons(surahNum, ayahNum, maxAyah, transKey)]
      });
    } catch {
      await interaction.editReply({ embeds: [buildErrorEmbed("Could not switch translation.")] });
    }
  }

  // ── AYAH NAV BUTTONS ──────────────────────────────
  else if (interaction.isButton() && interaction.customId.startsWith("ayahnav_")) {
    await interaction.deferUpdate();
    const parts    = interaction.customId.split("_");
    const surahNum = parseInt(parts[1]);
    const ayahNum  = parseInt(parts[2]);
    const transKey = parts[3] || DEFAULT_TRANSLATION;
    try {
      const data      = await fetchAyah(surahNum, ayahNum, transKey);
      const surahInfo = await fetch(`${QURAN_API}/surah/${surahNum}`).then(r => r.json());
      const maxAyah   = surahInfo?.data?.numberOfAyahs || 286;
      await interaction.editReply({
        embeds: [buildAyahEmbed(data, transKey)],
        components: [buildTranslationSelectMenu(transKey), buildAyahNavButtons(surahNum, ayahNum, maxAyah, transKey)]
      });
    } catch {
      await interaction.editReply({ embeds: [buildErrorEmbed("Could not load that ayah.")] });
    }
  }

  else if (interaction.isButton() && interaction.customId.startsWith("ayahrandom_")) {
    await interaction.deferUpdate();
    const transKey = interaction.customId.split("_")[1] || DEFAULT_TRANSLATION;
    try {
      const data     = await fetchRandomAyah(transKey);
      const editions = data?.data;
      const first    = Array.isArray(editions) ? editions[0] : editions;
      const surahNum = first?.surah?.number || 1;
      const ayahNum  = first?.numberInSurah || 1;
      const maxAyah  = first?.surah?.numberOfAyahs || 7;
      await interaction.editReply({
        embeds: [buildAyahEmbed(data, transKey)],
        components: [buildTranslationSelectMenu(transKey), buildAyahNavButtons(surahNum, ayahNum, maxAyah, transKey)]
      });
    } catch {
      await interaction.editReply({ embeds: [buildErrorEmbed("Could not load a random ayah.")] });
    }
  }

  // ── FATWA SELECT MENUS ────────────────────────────
  else if (interaction.isStringSelectMenu() && interaction.customId === "select_scholar") {
    await interaction.deferUpdate();
    const scholarKey = interaction.values[0];
    const filter = scholarKey === "all" ? {} : { scholar: scholarKey };
    const fatwa = getRandomFatwa(filter);
    if (!fatwa) return interaction.editReply({ embeds: [buildErrorEmbed("No fatawa found for that selection.")] });
    const navRow = buildFatwaNavButtons(fatwa.id, filter.scholar || "", "");
    const components = [buildScholarSelectMenu(), buildTopicSelectMenu()];
    if (navRow) components.push(navRow);
    await interaction.editReply({ embeds: [buildFatwaEmbed(fatwa)], components });
  }

  else if (interaction.isStringSelectMenu() && interaction.customId === "select_fatwa_topic") {
    await interaction.deferUpdate();
    const topic = interaction.values[0];
    const fatwa = getRandomFatwa({ topic });
    if (!fatwa) return interaction.editReply({ embeds: [buildErrorEmbed("No fatawa found for that topic.")] });
    const navRow = buildFatwaNavButtons(fatwa.id, "", topic);
    const components = [buildScholarSelectMenu(), buildTopicSelectMenu()];
    if (navRow) components.push(navRow);
    await interaction.editReply({ embeds: [buildFatwaEmbed(fatwa)], components });
  }

  // ── FATWA NAV BUTTONS ────────────────────────────
  else if (interaction.isButton() && interaction.customId.startsWith("fatwa_nav_")) {
    await interaction.deferUpdate();
    const parts = interaction.customId.split("_");
    // fatwa_nav_<id>_<scholar>_<topic>
    const fatwaId      = parts[2];
    const scholarFilter = parts[3] || "";
    const topicFilter   = parts[4] || "";
    const fatwa = FATAWA.find(f => f.id === fatwaId);
    if (!fatwa) return interaction.editReply({ embeds: [buildErrorEmbed("Could not find that fatwa.")] });
    const navRow = buildFatwaNavButtons(fatwaId, scholarFilter, topicFilter);
    const components = [buildScholarSelectMenu(), buildTopicSelectMenu()];
    if (navRow) components.push(navRow);
    await interaction.editReply({ embeds: [buildFatwaEmbed(fatwa)], components });
  }
});

// ─────────────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────────────
if (!process.env.DISCORD_TOKEN) {
  console.error("❌  DISCORD_TOKEN not set. Create a .env file with your token.");
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
