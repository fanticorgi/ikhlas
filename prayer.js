/**
 * ══════════════════════════════════════════
 *  PRAYER TIMES & ISLAMIC CALENDAR
 *  API: aladhan.com — free, no key needed
 * ══════════════════════════════════════════
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");

const ALADHAN = "https://api.aladhan.com/v1";

// Calculation methods — maps to aladhan method numbers
const METHODS = {
  "Muslim World League":        { id: 3,  regions: "Europe, Far East, parts of USA" },
  "ISNA (North America)":       { id: 2,  regions: "USA, Canada" },
  "Egyptian General Authority": { id: 5,  regions: "Africa, Syria, Lebanon, Malaysia" },
  "Umm al-Qura (Makkah)":       { id: 4,  regions: "Saudi Arabia" },
  "University of Karachi":      { id: 1,  regions: "Pakistan, Bangladesh, India, Afghanistan" },
  "Gulf Region":                { id: 8,  regions: "UAE, Qatar, Kuwait, Bahrain" },
  "Kuwait":                     { id: 9,  regions: "Kuwait" },
  "Qatar":                      { id: 10, regions: "Qatar" },
  "Singapore":                  { id: 11, regions: "Singapore, Malaysia, Indonesia" },
  "Turkey":                     { id: 13, regions: "Turkey" },
  "Tehran":                     { id: 7,  regions: "Iran, some Shia communities" },
};

// Auto-detect best method from country name
function detectMethod(country = "") {
  const c = country.toLowerCase();
  if (["saudi", "saudi arabia", "ksa"].some(x => c.includes(x)))            return 4;
  if (["uae", "emirates", "dubai", "qatar", "kuwait", "bahrain"].some(x => c.includes(x))) return 8;
  if (["pakistan", "bangladesh", "india", "afghanistan"].some(x => c.includes(x))) return 1;
  if (["egypt", "africa", "nigeria", "malaysia", "syria"].some(x => c.includes(x))) return 5;
  if (["usa", "united states", "america", "canada"].some(x => c.includes(x))) return 2;
  if (["turkey", "türkiye"].some(x => c.includes(x)))                        return 13;
  if (["singapore", "indonesia"].some(x => c.includes(x)))                   return 11;
  if (["iran", "iraq"].some(x => c.includes(x)))                             return 7;
  return 3; // Muslim World League as global default
}

async function fetchPrayerTimes(city, country = "") {
  const method = detectMethod(country);
  const params = new URLSearchParams({ city, country: country || city, method });
  const today  = new Date();
  const date   = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth()+1).padStart(2,"0")}-${today.getFullYear()}`;
  const res    = await fetch(`${ALADHAN}/timingsByCity/${date}?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchHijriDate() {
  const today  = new Date();
  const date   = `${String(today.getDate()).padStart(2, "0")}-${String(today.getMonth()+1).padStart(2,"0")}-${today.getFullYear()}`;
  const res    = await fetch(`${ALADHAN}/gToH/${date}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function buildPrayerEmbed(data, city, country) {
  const timings = data?.data?.timings;
  const meta    = data?.data?.meta;
  const date    = data?.data?.date;
  if (!timings) throw new Error("No timings in response");

  const hijri   = date?.hijri;
  const greg    = date?.gregorian;
  const methodName = meta?.method?.name || "Standard";

  // Format: show prayer name + time + icon
  const prayers = [
    { name: "🌙 Fajr",    time: timings.Fajr    },
    { name: "🌅 Sunrise", time: timings.Sunrise  },
    { name: "☀️ Dhuhr",   time: timings.Dhuhr   },
    { name: "🌤️ Asr",    time: timings.Asr     },
    { name: "🌇 Maghrib", time: timings.Maghrib  },
    { name: "🌃 Isha",    time: timings.Isha     },
  ];

  const embed = new EmbedBuilder()
    .setColor(0x1A237E)
    .setTitle(`🕌  Prayer Times — ${city}${country ? ", " + country : ""}`)
    .setDescription(
      prayers.map(p => `**${p.name}** — \`${p.time}\``).join("\n")
    )
    .addFields(
      { name: "📅 Gregorian", value: greg ? `${greg.weekday?.en}, ${greg.day} ${greg.month?.en} ${greg.year}` : "—", inline: true },
      { name: "🌙 Hijri",     value: hijri ? `${hijri.day} ${hijri.month?.en} ${hijri.year} AH` : "—",              inline: true },
      { name: "📐 Method",    value: methodName, inline: false },
    )
    .setFooter({ text: "Times are based on your city's local time • Powered by aladhan.com" })
    .setTimestamp();

  return embed;
}

function buildHijriEmbed(data) {
  const hijri = data?.data?.hijri;
  const greg  = data?.data?.gregorian;
  if (!hijri) throw new Error("No Hijri data");

  const islamicHolidays = hijri.holidays?.length ? hijri.holidays.join(", ") : null;

  const embed = new EmbedBuilder()
    .setColor(0x4A148C)
    .setTitle("🌙  Islamic Calendar — Today's Date")
    .addFields(
      { name: "🌙 Hijri Date",   value: `**${hijri.day} ${hijri.month?.en} ${hijri.year} AH**\n${hijri.date}`, inline: true },
      { name: "📅 Gregorian",    value: `**${greg.day} ${greg.month?.en} ${greg.year}**\n${greg.date}`,         inline: true },
      { name: "📖 Hijri Month",  value: `${hijri.month?.en} (${hijri.month?.ar})`,                              inline: false },
      { name: "🗓️ Day of Week", value: `${hijri.weekday?.en} (${hijri.weekday?.ar})`,                          inline: true },
    )
    .setFooter({ text: "القرآن الكريم — Islamic Hijri Calendar" })
    .setTimestamp();

  if (islamicHolidays) {
    embed.addFields({ name: "✨ Islamic Occasion", value: islamicHolidays });
  }

  return embed;
}

// Slash command definitions
const prayerCommand = new SlashCommandBuilder()
  .setName("prayertime")
  .setDescription("Get prayer times for any city in the world")
  .addStringOption(o => o.setName("city").setDescription("City name (e.g. Dubai, London, Cairo)").setRequired(true))
  .addStringOption(o => o.setName("country").setDescription("Country name to narrow down results (optional)"));

const dateCommand = new SlashCommandBuilder()
  .setName("date")
  .setDescription("Show today's Hijri (Islamic) and Gregorian date");

// Command handlers
async function handlePrayerTime(interaction) {
  await interaction.deferReply();
  const city    = interaction.options.getString("city");
  const country = interaction.options.getString("country") || "";
  try {
    const data  = await fetchPrayerTimes(city, country);
    const embed = buildPrayerEmbed(data, city, country);
    await interaction.editReply({ embeds: [embed] });
  } catch (e) {
    await interaction.editReply({ embeds: [
      new EmbedBuilder().setColor(0xB71C1C).setTitle("⚠️ Not Found")
        .setDescription(`Could not find prayer times for **${city}**. Try adding a country — e.g. \`/prayertime city:Birmingham country:UK\``)
    ]});
  }
}

async function handleDate(interaction) {
  await interaction.deferReply();
  try {
    const data  = await fetchHijriDate();
    const embed = buildHijriEmbed(data);
    await interaction.editReply({ embeds: [embed] });
  } catch {
    await interaction.editReply({ embeds: [
      new EmbedBuilder().setColor(0xB71C1C).setDescription("Could not fetch today's date.")
    ]});
  }
}

module.exports = {
  commands: [prayerCommand.toJSON(), dateCommand.toJSON()],
  handlers: { prayertime: handlePrayerTime, date: handleDate },
};
