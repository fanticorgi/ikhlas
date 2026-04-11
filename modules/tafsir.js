/**
 * ══════════════════════════════════════════
 *  TAFSIR — Quranic Commentary
 *  Sources: Ibn Kathir (primary)
 *  API: quran.com/api/v4 — free, no key
 * ══════════════════════════════════════════
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");

const QURAN_COM = "https://api.quran.com/api/v4";

// Tafsir editions available on quran.com API
const TAFSIR_EDITIONS = {
  "en-tafisr-ibn-kathir": { name: "Ibn Kathir",         lang: "English", scholar: "Isma'il ibn Kathir (d. 774 AH)" },
  "en-tafsir-maarif-ul-quran": { name: "Ma'arif ul-Quran", lang: "English", scholar: "Mufti Shafi Usmani" },
  "en-tafsir-al-jalalayn":  { name: "Tafsir al-Jalalayn", lang: "English", scholar: "Al-Suyuti & Al-Mahalli" },
};

const DEFAULT_TAFSIR = "en-tafisr-ibn-kathir";
const TAFSIR_KEYS = Object.keys(TAFSIR_EDITIONS);

// Surah names for display
const SURAH_NAMES = [
  "", "Al-Fatihah","Al-Baqarah","Ali 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
  "Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
  "Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum",
  "Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
  "Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
  "Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
  "As-Saf","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
  "Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","'Abasa",
  "At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
  "Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-'Adiyat",
  "Al-Qari'ah","At-Takathur","Al-'Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
  "Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

async function fetchTafsir(surah, ayah, tafsirEdition = DEFAULT_TAFSIR) {
  // quran.com uses verse_key format: surah:ayah
  const verseKey = `${surah}:${ayah}`;
  const url = `${QURAN_COM}/tafsirs/${tafsirEdition}/by_ayah/${verseKey}?language=en`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchAyahText(surah, ayah) {
  const res = await fetch(`${QURAN_COM}/verses/by_key/${surah}:${ayah}?translations=131&language=en&fields=text_uthmani`);
  if (!res.ok) return null;
  return res.json();
}

function stripHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncate(text, max = 900) {
  if (text.length <= max) return text;
  return text.substring(0, max) + "...";
}

function buildTafsirEmbed(surah, ayah, tafsirData, ayahData, tafsirKey) {
  const edition   = TAFSIR_EDITIONS[tafsirKey] || TAFSIR_EDITIONS[DEFAULT_TAFSIR];
  const tafsirText = tafsirData?.tafsir?.text
    ? truncate(stripHtml(tafsirData.tafsir.text))
    : "Tafsir text not available for this verse. Try a different tafsir.";

  const surahName  = SURAH_NAMES[surah] || `Surah ${surah}`;
  const arabicText = ayahData?.verse?.text_uthmani || null;
  const transText  = ayahData?.verse?.translations?.[0]?.text
    ? stripHtml(ayahData.verse.translations[0].text)
    : null;

  const embed = new EmbedBuilder()
    .setColor(0x311B92)
    .setAuthor({ name: `📖  Tafsir — ${edition.name}` })
    .setTitle(`${surahName} ${surah}:${ayah}`);

  if (arabicText) embed.addFields({ name: "🕌 Arabic", value: arabicText });
  if (transText)  embed.addFields({ name: "🌐 Translation", value: truncate(transText, 400) });

  embed.addFields(
    { name: `📜 ${edition.name} Commentary`, value: tafsirText },
    { name: "🎓 Scholar", value: edition.scholar, inline: true },
    { name: "🌐 Language", value: edition.lang,   inline: true },
  )
  .setFooter({ text: `${surahName} • Use /tafsir to explore any verse` })
  .setTimestamp();

  return embed;
}

function buildTafsirNavButtons(surah, ayah, tafsirKey) {
  const prev = Math.max(1, ayah - 1);
  const next = ayah + 1;
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`tafsir_prev_${surah}_${prev}_${tafsirKey}`).setLabel("◀ Prev Ayah").setStyle(ButtonStyle.Secondary).setDisabled(ayah <= 1),
    new ButtonBuilder().setCustomId(`tafsir_next_${surah}_${next}_${tafsirKey}`).setLabel("Next Ayah ▶").setStyle(ButtonStyle.Secondary),
  );
}

function buildTafsirSelectMenu(current = DEFAULT_TAFSIR) {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_tafsir")
      .setPlaceholder("Switch tafsir...")
      .addOptions(
        TAFSIR_KEYS.map(k => ({
          label: TAFSIR_EDITIONS[k].name,
          description: TAFSIR_EDITIONS[k].scholar,
          value: k,
          default: k === current,
        }))
      )
  );
}

const command = new SlashCommandBuilder()
  .setName("tafsir")
  .setDescription("Get Ibn Kathir's tafsir (commentary) for any Quran verse")
  .addIntegerOption(o => o.setName("surah").setDescription("Surah number (1–114)").setRequired(true).setMinValue(1).setMaxValue(114))
  .addIntegerOption(o => o.setName("ayah").setDescription("Ayah number").setRequired(true).setMinValue(1))
  .addStringOption(o =>
    o.setName("tafsir").setDescription("Which tafsir to use (default: Ibn Kathir)")
      .addChoices(...TAFSIR_KEYS.map(k => ({ name: `${TAFSIR_EDITIONS[k].name} — ${TAFSIR_EDITIONS[k].scholar}`, value: k })))
  );

async function handleTafsir(interaction) {
  await interaction.deferReply();
  const surah     = interaction.options.getInteger("surah");
  const ayah      = interaction.options.getInteger("ayah");
  const tafsirKey = interaction.options.getString("tafsir") || DEFAULT_TAFSIR;

  try {
    const [tafsirData, ayahData] = await Promise.all([
      fetchTafsir(surah, ayah, tafsirKey),
      fetchAyahText(surah, ayah).catch(() => null),
    ]);

    const embed = buildTafsirEmbed(surah, ayah, tafsirData, ayahData, tafsirKey);
    await interaction.editReply({
      embeds: [embed],
      components: [buildTafsirSelectMenu(tafsirKey), buildTafsirNavButtons(surah, ayah, tafsirKey)]
    });
  } catch {
    await interaction.editReply({ embeds: [
      new EmbedBuilder().setColor(0xB71C1C).setTitle("⚠️ Not Found")
        .setDescription(`Could not load tafsir for **${surah}:${ayah}**. The ayah number may exceed the surah's length.`)
    ]});
  }
}

async function handleSelectTafsir(interaction) {
  await interaction.deferUpdate();
  const tafsirKey = interaction.values[0];
  const embed     = interaction.message.embeds[0];
  // Parse surah:ayah from embed title
  const match     = embed?.title?.match(/(\d+):(\d+)/);
  if (!match) return;
  const surah = parseInt(match[1]);
  const ayah  = parseInt(match[2]);
  try {
    const [tafsirData, ayahData] = await Promise.all([
      fetchTafsir(surah, ayah, tafsirKey),
      fetchAyahText(surah, ayah).catch(() => null),
    ]);
    await interaction.editReply({
      embeds: [buildTafsirEmbed(surah, ayah, tafsirData, ayahData, tafsirKey)],
      components: [buildTafsirSelectMenu(tafsirKey), buildTafsirNavButtons(surah, ayah, tafsirKey)]
    });
  } catch {
    await interaction.followUp({ content: "Could not switch tafsir.", ephemeral: true });
  }
}

async function handleButton(interaction) {
  await interaction.deferUpdate();
  const parts     = interaction.customId.split("_");
  const surah     = parseInt(parts[2]);
  const ayah      = parseInt(parts[3]);
  const tafsirKey = parts[4] || DEFAULT_TAFSIR;
  try {
    const [tafsirData, ayahData] = await Promise.all([
      fetchTafsir(surah, ayah, tafsirKey),
      fetchAyahText(surah, ayah).catch(() => null),
    ]);
    await interaction.editReply({
      embeds: [buildTafsirEmbed(surah, ayah, tafsirData, ayahData, tafsirKey)],
      components: [buildTafsirSelectMenu(tafsirKey), buildTafsirNavButtons(surah, ayah, tafsirKey)]
    });
  } catch {
    await interaction.followUp({ content: "Could not load that ayah.", ephemeral: true });
  }
}

module.exports = {
  commands: [command.toJSON()],
  handlers: { tafsir: handleTafsir },
  selectHandler: handleSelectTafsir,
  buttonHandler: handleButton,
};
