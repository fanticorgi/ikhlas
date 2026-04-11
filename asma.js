/**
 * ══════════════════════════════════════════
 *  99 NAMES OF ALLAH (Asma ul-Husna)
 *  Full database with transliteration,
 *  meaning, and benefit of each name
 * ══════════════════════════════════════════
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const NAMES = [
  { num: 1,  arabic: "الله",         transliteration: "Allah",         meaning: "The Greatest Name — The One worthy of all worship", benefit: "The supreme name that encompasses all attributes" },
  { num: 2,  arabic: "الرَّحْمَن",   transliteration: "Ar-Rahman",     meaning: "The Most Gracious — The One with vast mercy encompassing all creation", benefit: "Reciting this name brings tranquility and compassion to the heart" },
  { num: 3,  arabic: "الرَّحِيم",    transliteration: "Ar-Raheem",     meaning: "The Most Merciful — The One whose mercy is specific to the believers", benefit: "Reminds the believer that Allah's mercy is always close" },
  { num: 4,  arabic: "الْمَلِك",     transliteration: "Al-Malik",      meaning: "The King — The One who owns and controls all dominion", benefit: "Humbles the heart before the true King of all kings" },
  { num: 5,  arabic: "الْقُدُّوس",   transliteration: "Al-Quddus",     meaning: "The Most Holy — The One free from all deficiencies and imperfections", benefit: "Purifies the heart from attachment to the flawed world" },
  { num: 6,  arabic: "السَّلَام",    transliteration: "As-Salam",      meaning: "The Source of Peace — The One from whom all peace and safety flows", benefit: "Seeking peace through this name brings inner calm" },
  { num: 7,  arabic: "الْمُؤْمِن",   transliteration: "Al-Mu'min",     meaning: "The Guardian of Faith — The One who grants security and faith", benefit: "Strengthens the believer's trust and sense of security" },
  { num: 8,  arabic: "الْمُهَيْمِن", transliteration: "Al-Muhaymin",   meaning: "The Overseer — The One who watches over and protects all things", benefit: "Brings comfort knowing nothing is hidden from Allah" },
  { num: 9,  arabic: "الْعَزِيز",    transliteration: "Al-Azeez",      meaning: "The Almighty — The One who is invincible and unconquerable", benefit: "Reminds us that true honor comes only from Allah" },
  { num: 10, arabic: "الْجَبَّار",   transliteration: "Al-Jabbar",     meaning: "The Compeller — The One who repairs what is broken and compels what He wills", benefit: "Allah can mend every broken heart and situation" },
  { num: 11, arabic: "الْمُتَكَبِّر",transliteration: "Al-Mutakabbir", meaning: "The Supreme — The One who rightfully has greatness; no arrogance belongs to creation", benefit: "Teaches humility — true greatness belongs to Allah alone" },
  { num: 12, arabic: "الْخَالِق",    transliteration: "Al-Khaliq",     meaning: "The Creator — The One who brings all things into existence from nothing", benefit: "Deepens awe and gratitude for existence itself" },
  { num: 13, arabic: "الْبَارِئ",    transliteration: "Al-Bari'",      meaning: "The Originator — The One who creates all with perfect proportion and distinction", benefit: "Reflects on the precision of Allah's design in creation" },
  { num: 14, arabic: "الْمُصَوِّر",  transliteration: "Al-Musawwir",   meaning: "The Fashioner — The One who gives each created thing its unique form", benefit: "Every unique face and form is a sign of Allah's artistry" },
  { num: 15, arabic: "الْغَفَّار",   transliteration: "Al-Ghaffar",    meaning: "The Repeatedly Forgiving — The One who perpetually forgives sins", benefit: "Never lose hope — Allah forgives again and again" },
  { num: 16, arabic: "الْقَهَّار",   transliteration: "Al-Qahhar",     meaning: "The Subduer — The One who overcomes and subdues all things", benefit: "Teaches reliance on Allah against all adversity" },
  { num: 17, arabic: "الْوَهَّاب",   transliteration: "Al-Wahhab",     meaning: "The Bestower — The One who gives freely and continuously without any return", benefit: "Ask of Al-Wahhab — He gives without limit or condition" },
  { num: 18, arabic: "الرَّزَّاق",   transliteration: "Ar-Razzaq",     meaning: "The Provider — The One who provides all sustenance for all of creation", benefit: "Trust in provision; your rizq is guaranteed by Allah" },
  { num: 19, arabic: "الْفَتَّاح",   transliteration: "Al-Fattah",     meaning: "The Opener — The One who opens all doors, hearts, and paths that are closed", benefit: "When all doors seem shut, call on Al-Fattah" },
  { num: 20, arabic: "الْعَلِيم",    transliteration: "Al-'Aleem",     meaning: "The All-Knowing — The One whose knowledge encompasses all things, hidden and manifest", benefit: "Nothing you feel or face is unknown to Allah" },
  { num: 21, arabic: "الْقَابِض",    transliteration: "Al-Qabid",      meaning: "The Withholder — The One who withholds sustenance and souls with wisdom", benefit: "Accepts that whatever Allah withholds is in wisdom" },
  { num: 22, arabic: "الْبَاسِط",    transliteration: "Al-Basit",      meaning: "The Expander — The One who expands sustenance and opens the heart with joy", benefit: "Call on Al-Basit when the heart feels constricted" },
  { num: 23, arabic: "الْخَافِض",    transliteration: "Al-Khafid",     meaning: "The Abaser — The One who lowers in rank whoever He wills with justice", benefit: "Reminds us that all rank and status belong to Allah" },
  { num: 24, arabic: "الرَّافِع",    transliteration: "Ar-Rafi'",      meaning: "The Exalter — The One who raises in rank whoever He wills with grace", benefit: "Ask Allah to raise your rank in this life and the next" },
  { num: 25, arabic: "الْمُعِز",     transliteration: "Al-Mu'izz",     meaning: "The Bestower of Honour — The One who grants honor and dignity to whom He wills", benefit: "True dignity is from Allah, not from status or wealth" },
  { num: 26, arabic: "الْمُذِل",     transliteration: "Al-Mudhill",    meaning: "The Humiliator — The One who humiliates and disgraces whoever He wills with justice", benefit: "Fear humiliation only from Allah, not from people" },
  { num: 27, arabic: "السَّمِيع",    transliteration: "As-Sami'",      meaning: "The All-Hearing — The One who hears every sound, word, and secret thought", benefit: "Your du'a is always heard — no matter how quietly spoken" },
  { num: 28, arabic: "الْبَصِير",    transliteration: "Al-Baseer",     meaning: "The All-Seeing — The One who sees all things, visible and hidden", benefit: "Allah sees your struggle even when no one else does" },
  { num: 29, arabic: "الْحَكَم",     transliteration: "Al-Hakam",      meaning: "The Judge — The One who judges between creation with perfect fairness", benefit: "Every injustice will be addressed before the true Judge" },
  { num: 30, arabic: "الْعَدْل",     transliteration: "Al-'Adl",       meaning: "The Just — The One who is perfectly just in all His decrees and judgments", benefit: "Rest assured — every decree of Allah is perfectly just" },
  { num: 31, arabic: "اللَّطِيف",    transliteration: "Al-Lateef",     meaning: "The Subtle One — The One who is kind and aware of the finest details", benefit: "Allah's help often comes in subtle, unexpected ways" },
  { num: 32, arabic: "الْخَبِير",    transliteration: "Al-Khabeer",    meaning: "The All-Aware — The One who is fully informed of all inner and outer states", benefit: "Nothing about your situation is unknown to Allah" },
  { num: 33, arabic: "الْحَلِيم",    transliteration: "Al-Haleem",     meaning: "The Forbearing — The One who does not hasten punishment despite seeing sins", benefit: "Allah's forbearance is why we still have time to repent" },
  { num: 34, arabic: "الْعَظِيم",    transliteration: "Al-'Azeem",     meaning: "The Magnificent — The One possessing the utmost degree of greatness and majesty", benefit: "Pondering this name fills the heart with awe and humility" },
  { num: 35, arabic: "الْغَفُور",    transliteration: "Al-Ghafoor",    meaning: "The Most Forgiving — The One who forgives abundantly and covers sins completely", benefit: "No sin is too great for Al-Ghafoor to forgive" },
  { num: 36, arabic: "الشَّكُور",    transliteration: "Ash-Shakoor",   meaning: "The Appreciative — The One who rewards even the smallest good deed enormously", benefit: "No act of worship is too small — Allah appreciates it all" },
  { num: 37, arabic: "الْعَلِي",     transliteration: "Al-'Ali",       meaning: "The Most High — The One who is above all things in essence and rank", benefit: "Lift your hands to the One who is above all" },
  { num: 38, arabic: "الْكَبِير",    transliteration: "Al-Kabeer",     meaning: "The Most Great — The One who is greater than anything that can be imagined", benefit: "Problems shrink when we remember how great Allah is" },
  { num: 39, arabic: "الْحَفِيظ",    transliteration: "Al-Hafeez",     meaning: "The Preserver — The One who protects and guards all things from harm", benefit: "Seek protection through this name in times of fear" },
  { num: 40, arabic: "الْمُقِيت",    transliteration: "Al-Muqeet",     meaning: "The Sustainer — The One who sustains all creation and watches over it", benefit: "Rely on Al-Muqeet for physical and spiritual nourishment" },
  { num: 41, arabic: "الْحَسِيب",    transliteration: "Al-Haseeb",     meaning: "The Reckoner — The One who is sufficient for His servants and takes account of all", benefit: "Sufficiency comes from Allah alone — 'HasbunAllah'" },
  { num: 42, arabic: "الْجَلِيل",    transliteration: "Al-Jaleel",     meaning: "The Majestic — The One possessing absolute majesty and grandeur", benefit: "Inspires reverence and proper etiquette in worship" },
  { num: 43, arabic: "الْكَرِيم",    transliteration: "Al-Kareem",     meaning: "The Most Generous — The One who gives abundantly and never disappoints those who ask", benefit: "Ask freely — Al-Kareem is never diminished by giving" },
  { num: 44, arabic: "الرَّقِيب",    transliteration: "Ar-Raqeeb",     meaning: "The Watchful — The One who is ever-watchful over all deeds and thoughts", benefit: "Consciousness of Ar-Raqeeb builds true taqwa" },
  { num: 45, arabic: "الْمُجِيب",    transliteration: "Al-Mujeeb",     meaning: "The Responsive — The One who answers every call and prayer", benefit: "Call on Al-Mujeeb — He never turns away a sincere caller" },
  { num: 46, arabic: "الْوَاسِع",    transliteration: "Al-Wasi'",      meaning: "The All-Encompassing — The One whose mercy, knowledge, and power are boundless", benefit: "Wherever you turn, the vastness of Allah surrounds you" },
  { num: 47, arabic: "الْحَكِيم",    transliteration: "Al-Hakeem",     meaning: "The All-Wise — The One who places all things in their most perfect position", benefit: "Whatever Allah decrees is the wisest possible outcome" },
  { num: 48, arabic: "الْوَدُود",    transliteration: "Al-Wadood",     meaning: "The Most Loving — The One who loves His righteous servants with a perfect love", benefit: "Allah loves you — this name is a constant source of hope" },
  { num: 49, arabic: "الْمَجِيد",    transliteration: "Al-Majeed",     meaning: "The Most Glorious — The One of extreme generosity and absolute glory", benefit: "The salawat on the Prophet ﷺ invokes this glorious name" },
  { num: 50, arabic: "الْبَاعِث",    transliteration: "Al-Ba'ith",     meaning: "The Resurrector — The One who will raise all creation on the Day of Judgment", benefit: "Certainty in resurrection motivates righteous action" },
  { num: 51, arabic: "الشَّهِيد",    transliteration: "Ash-Shaheed",   meaning: "The Witness — The One who witnesses all things at all times without exception", benefit: "Act as if Allah is watching — because He always is" },
  { num: 52, arabic: "الْحَق",       transliteration: "Al-Haqq",       meaning: "The Truth — The One whose existence and attributes are the absolute truth", benefit: "Ground yourself in Al-Haqq when falsehood is everywhere" },
  { num: 53, arabic: "الْوَكِيل",    transliteration: "Al-Wakeel",     meaning: "The Trustee — The One who is the best disposer of all affairs", benefit: "'HasbunAllahu wa ni'mal wakeel' — say it in every hardship" },
  { num: 54, arabic: "الْقَوِي",     transliteration: "Al-Qawi",       meaning: "The All-Strong — The One of perfect power and strength", benefit: "Draws strength from knowing the Strongest is your ally" },
  { num: 55, arabic: "الْمَتِين",    transliteration: "Al-Mateen",     meaning: "The Firm — The One who is absolutely firm and steadfast in His attributes", benefit: "Allah's support never weakens or wavers" },
  { num: 56, arabic: "الْوَلِي",     transliteration: "Al-Wali",       meaning: "The Protecting Friend — The One who is the helper and guardian of the believers", benefit: "The believer is never alone — Al-Wali is always close" },
  { num: 57, arabic: "الْحَمِيد",    transliteration: "Al-Hameed",     meaning: "The Praiseworthy — The One deserving all praise at all times", benefit: "Al-Hamdu lillah — all praise returns to Him alone" },
  { num: 58, arabic: "الْمُحْصِي",   transliteration: "Al-Muhsi",      meaning: "The All-Enumerating — The One who has counted and recorded every single thing", benefit: "Every good deed is recorded — not one is lost" },
  { num: 59, arabic: "الْمُبْدِئ",   transliteration: "Al-Mubdi'",     meaning: "The Originator — The One who begins creation from nothing", benefit: "The One who started it can renew it — including your faith" },
  { num: 60, arabic: "الْمُعِيد",    transliteration: "Al-Mu'eed",     meaning: "The Restorer — The One who will restore and recreate all things after death", benefit: "The One who created you once will recreate you again" },
  { num: 61, arabic: "الْمُحْيِي",   transliteration: "Al-Muhyi",      meaning: "The Giver of Life — The One who gives life to the living and to the dead hearts", benefit: "Call on Al-Muhyi to bring life to a dead heart" },
  { num: 62, arabic: "الْمُمِيت",    transliteration: "Al-Mumeet",     meaning: "The Taker of Life — The One who causes death at the appointed time", benefit: "Remembering Al-Mumeet motivates preparation for the afterlife" },
  { num: 63, arabic: "الْحَي",       transliteration: "Al-Hayy",       meaning: "The Ever-Living — The One who is alive without beginning or end", benefit: "Call on the Ever-Living who never sleeps nor dies" },
  { num: 64, arabic: "الْقَيُّوم",   transliteration: "Al-Qayyoom",    meaning: "The Self-Subsisting — The One upon whom all creation depends", benefit: "Al-Hayyu Al-Qayyoom — the greatest names to call on in distress" },
  { num: 65, arabic: "الْوَاجِد",    transliteration: "Al-Wajid",      meaning: "The Perceiver — The One who finds and perceives everything with ease", benefit: "Nothing is lost to Al-Wajid — your needs are known" },
  { num: 66, arabic: "الْمَاجِد",    transliteration: "Al-Majid",      meaning: "The Illustrious — The One of great honor and abundant generosity", benefit: "His generosity is as vast as His glory" },
  { num: 67, arabic: "الْوَاحِد",    transliteration: "Al-Wahid",      meaning: "The One — The One without any partner, equal, or rival", benefit: "Tawheed — there is none worthy of worship but Al-Wahid" },
  { num: 68, arabic: "الصَّمَد",     transliteration: "As-Samad",      meaning: "The Eternal Refuge — The One to whom all creation turns in every need", benefit: "In every need, turn to As-Samad — He alone is self-sufficient" },
  { num: 69, arabic: "الْقَادِر",    transliteration: "Al-Qadir",      meaning: "The Able — The One who is capable of doing everything without limitation", benefit: "Nothing is impossible for Al-Qadir" },
  { num: 70, arabic: "الْمُقْتَدِر", transliteration: "Al-Muqtadir",   meaning: "The Powerful — The One who has complete and perfect power over all things", benefit: "Allah's power over your situation is complete and certain" },
  { num: 71, arabic: "الْمُقَدِّم",  transliteration: "Al-Muqaddim",   meaning: "The Expediter — The One who brings forward and gives precedence to whom He wills", benefit: "Allah can bring your relief forward in any matter" },
  { num: 72, arabic: "الْمُؤَخِّر",  transliteration: "Al-Mu'akhkhir", meaning: "The Delayer — The One who delays and puts back whom and what He wills with wisdom", benefit: "What seems delayed by Al-Mu'akhkhir is being prepared perfectly" },
  { num: 73, arabic: "الأَوَّل",     transliteration: "Al-Awwal",      meaning: "The First — The One who existed before all things, with no beginning", benefit: "Before everything, there was only Allah" },
  { num: 74, arabic: "الآخِر",       transliteration: "Al-Akhir",      meaning: "The Last — The One who will remain after all things pass away, with no end", benefit: "After everything, only Allah will remain" },
  { num: 75, arabic: "الظَّاهِر",    transliteration: "Az-Zahir",      meaning: "The Manifest — The One who is apparent through His signs and creation", benefit: "Every sign in creation points to Az-Zahir" },
  { num: 76, arabic: "الْبَاطِن",    transliteration: "Al-Batin",      meaning: "The Hidden — The One who is beyond perception by sight or senses", benefit: "Though unseen, Al-Batin is closer than your jugular vein" },
  { num: 77, arabic: "الْوَالِي",    transliteration: "Al-Wali",       meaning: "The Governor — The One who governs and manages all affairs of creation", benefit: "Trust Al-Wali — He manages your affairs better than you" },
  { num: 78, arabic: "الْمُتَعَالِ", transliteration: "Al-Muta'ali",   meaning: "The Self-Exalted — The One who is infinitely exalted above all things", benefit: "His greatness transcends all description and imagination" },
  { num: 79, arabic: "الْبَر",       transliteration: "Al-Barr",       meaning: "The Source of Goodness — The One who is kind and good to His creation", benefit: "All goodness in the world flows from Al-Barr" },
  { num: 80, arabic: "التَّوَّاب",   transliteration: "At-Tawwab",     meaning: "The Ever-Returning — The One who continuously accepts the repentance of His servants", benefit: "Return to At-Tawwab — He will always turn back to you" },
  { num: 81, arabic: "الْمُنْتَقِم", transliteration: "Al-Muntaqim",   meaning: "The Avenger — The One who takes retribution on those who persist in oppression", benefit: "Justice will come — Al-Muntaqim does not forget" },
  { num: 82, arabic: "الْعَفُو",     transliteration: "Al-'Afuw",      meaning: "The Pardoner — The One who completely erases sins and eliminates their record", benefit: "Recite this especially in Laylatul Qadr: 'Allahumma innaka 'afuwwun...'" },
  { num: 83, arabic: "الرَّؤُوف",    transliteration: "Ar-Ra'oof",     meaning: "The Most Kind — The One with extreme gentleness and tenderness for His servants", benefit: "Allah is more gentle with you than a mother with her child" },
  { num: 84, arabic: "مَالِك الْمُلْك", transliteration: "Malikal-Mulk", meaning: "The Owner of All Sovereignty — The One who owns all dominion absolutely", benefit: "Kingdoms rise and fall; only Malikal-Mulk's reign is eternal" },
  { num: 85, arabic: "ذُو الْجَلَالِ وَالإِكْرَام", transliteration: "Dhul-Jalali wal-Ikram", meaning: "The Lord of Majesty and Generosity — The One possessing absolute majesty and complete generosity", benefit: "The Prophet ﷺ instructed: 'Persist in saying Dhul-Jalali wal-Ikram'" },
  { num: 86, arabic: "الْمُقْسِط",   transliteration: "Al-Muqsit",     meaning: "The Equitable — The One who is perfectly just and fair to all without exception", benefit: "No one is treated unjustly by Al-Muqsit — ever" },
  { num: 87, arabic: "الْجَامِع",    transliteration: "Al-Jami'",      meaning: "The Gatherer — The One who gathers all of creation on the Day of Judgment", benefit: "All will be gathered and no one will be missed" },
  { num: 88, arabic: "الْغَنِي",     transliteration: "Al-Ghani",      meaning: "The Self-Sufficient — The One who is in no need of anything from His creation", benefit: "Your acts of worship enrich you, not Allah" },
  { num: 89, arabic: "الْمُغْنِي",   transliteration: "Al-Mughni",     meaning: "The Enricher — The One who gives wealth and sufficiency to whom He wills", benefit: "Sufficiency comes from Al-Mughni alone, not from wealth" },
  { num: 90, arabic: "الْمَانِع",    transliteration: "Al-Mani'",      meaning: "The Preventer — The One who withholds and prevents what would cause harm", benefit: "What Allah prevents is often a protection, not a deprivation" },
  { num: 91, arabic: "الضَّار",      transliteration: "Ad-Darr",       meaning: "The Distresser — The One who creates adversity as a test and purification", benefit: "All hardship is from Allah and contains wisdom and mercy" },
  { num: 92, arabic: "النَّافِع",    transliteration: "An-Nafi'",      meaning: "The Benefiter — The One who creates all benefit and good for His creation", benefit: "Turn to An-Nafi' for all that benefits in this life and the next" },
  { num: 93, arabic: "النُّور",      transliteration: "An-Nur",        meaning: "The Light — The One who is the light of the heavens and the earth", benefit: "Ask An-Nur to illuminate your heart, path, and grave" },
  { num: 94, arabic: "الْهَادِي",    transliteration: "Al-Hadi",       meaning: "The Guide — The One who guides whoever He wills to the straight path", benefit: "Guidance is from Al-Hadi alone — ask for it every salah" },
  { num: 95, arabic: "الْبَدِيع",    transliteration: "Al-Badi'",      meaning: "The Incomparable — The One who creates what has never existed before", benefit: "No creation has ever existed like His — He is without precedent" },
  { num: 96, arabic: "الْبَاقِي",    transliteration: "Al-Baqi",       meaning: "The Everlasting — The One who will remain when all else has perished", benefit: "Invest in what connects you to Al-Baqi — it lasts forever" },
  { num: 97, arabic: "الْوَارِث",    transliteration: "Al-Warith",     meaning: "The Inheritor — The One who will inherit the earth and all that is on it", benefit: "All will return to Al-Warith — hold the world loosely" },
  { num: 98, arabic: "الرَّشِيد",    transliteration: "Ar-Rasheed",    meaning: "The Guide to the Right Path — The One who directs all things to their right end", benefit: "Follow the guidance of Ar-Rasheed — it leads to goodness only" },
  { num: 99, arabic: "الصَّبُور",    transliteration: "As-Saboor",     meaning: "The Most Patient — The One who does not hasten punishment though He is fully aware", benefit: "Allah's patience with His servants is greater than any patience we know" },
];

function buildNameEmbed(name) {
  return new EmbedBuilder()
    .setColor(0x880E4F)
    .setAuthor({ name: `✨  Asma ul-Husna — Name ${name.num} of 99` })
    .setTitle(`${name.arabic}  •  ${name.transliteration}`)
    .setDescription(`**${name.meaning}**`)
    .addFields(
      { name: "💡 Reflection", value: name.benefit }
    )
    .setFooter({ text: `${name.num}/99 Names of Allah • وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى` })
    .setTimestamp();
}

function buildNavButtons(num) {
  const prev = Math.max(1, num - 1);
  const next = Math.min(99, num + 1);
  const rand = Math.floor(Math.random() * 99) + 1;
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`asma_prev_${prev}`).setLabel("◀ Prev").setStyle(ButtonStyle.Secondary).setDisabled(num <= 1),
    new ButtonBuilder().setCustomId(`asma_next_${next}`).setLabel("Next ▶").setStyle(ButtonStyle.Secondary).setDisabled(num >= 99),
    new ButtonBuilder().setCustomId(`asma_rand_${rand}`).setLabel("🎲 Random").setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`asma_list_1`).setLabel("📋 List All").setStyle(ButtonStyle.Secondary)
  );
}

function buildListEmbed(page = 1) {
  const perPage = 10;
  const start   = (page - 1) * perPage;
  const slice   = NAMES.slice(start, start + perPage);
  const totalPages = Math.ceil(99 / perPage);
  return new EmbedBuilder()
    .setColor(0x880E4F)
    .setTitle(`✨  All 99 Names of Allah — Page ${page}/${totalPages}`)
    .setDescription(
      slice.map(n => `**${n.num}.** ${n.arabic} — *${n.transliteration}* — ${n.meaning.split(" — ")[1] || n.meaning}`).join("\n")
    )
    .setFooter({ text: `Page ${page} of ${totalPages} • Use /asmaallah number: to get full detail on any name` });
}

const command = new SlashCommandBuilder()
  .setName("asmaallah")
  .setDescription("Browse the 99 Names of Allah with meanings and reflections")
  .addIntegerOption(o =>
    o.setName("number").setDescription("Name number (1–99)").setMinValue(1).setMaxValue(99)
  );

async function handleAsmaAllah(interaction) {
  await interaction.deferReply();
  const num  = interaction.options.getInteger("number") || Math.floor(Math.random() * 99) + 1;
  const name = NAMES[num - 1];
  await interaction.editReply({ embeds: [buildNameEmbed(name)], components: [buildNavButtons(num)] });
}

async function handleButton(interaction) {
  await interaction.deferUpdate();
  const [, action, numStr] = interaction.customId.split("_");
  const num = parseInt(numStr);

  if (action === "list") {
    const page = num || 1;
    const totalPages = Math.ceil(99 / 10);
    const pageButtons = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId(`asma_list_${Math.max(1, page-1)}`).setLabel("◀").setStyle(ButtonStyle.Secondary).setDisabled(page <= 1),
      new ButtonBuilder().setCustomId(`asma_list_${Math.min(totalPages, page+1)}`).setLabel("▶").setStyle(ButtonStyle.Secondary).setDisabled(page >= totalPages),
      new ButtonBuilder().setCustomId(`asma_prev_1`).setLabel("↩ Back to Detail").setStyle(ButtonStyle.Primary)
    );
    await interaction.editReply({ embeds: [buildListEmbed(page)], components: [pageButtons] });
  } else {
    const name = NAMES[num - 1];
    await interaction.editReply({ embeds: [buildNameEmbed(name)], components: [buildNavButtons(num)] });
  }
}

module.exports = {
  NAMES,
  commands: [command.toJSON()],
  handlers: { asmaallah: handleAsmaAllah },
  buttonHandler: handleButton,
};
