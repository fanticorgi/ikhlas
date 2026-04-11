/**
 * ══════════════════════════════════════════
 *  DU'A DATABASE
 *  Authentic adhkar & supplications with
 *  Arabic, transliteration, translation,
 *  source, and when to recite
 * ══════════════════════════════════════════
 */

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");

const DUA_CATEGORIES = {
  morning:    { label: "Morning Adhkar",          emoji: "🌅", color: 0xF57C00 },
  evening:    { label: "Evening Adhkar",          emoji: "🌆", color: 0x4A148C },
  sleep:      { label: "Before Sleep",            emoji: "🌙", color: 0x1A237E },
  wakeup:     { label: "Upon Waking",             emoji: "☀️", color: 0xF9A825 },
  food:       { label: "Food & Eating",           emoji: "🍽️", color: 0x2E7D32 },
  travel:     { label: "Travel & Journeys",       emoji: "🚗", color: 0x37474F },
  distress:   { label: "Distress & Hardship",     emoji: "🤲", color: 0xB71C1C },
  mosque:     { label: "Entering/Leaving Mosque", emoji: "🕌", color: 0x1B5E20 },
  toilet:     { label: "Entering Toilet",         emoji: "🚪", color: 0x424242 },
  rain:       { label: "Rain & Wind",             emoji: "🌧️", color: 0x0D47A1 },
  forgiveness:{ label: "Seeking Forgiveness",     emoji: "🔑", color: 0x880E4F },
  protection: { label: "Seeking Protection",      emoji: "🛡️", color: 0x004D40 },
  gratitude:  { label: "Gratitude",               emoji: "💚", color: 0x33691E },
  anxiety:    { label: "Anxiety & Worry",         emoji: "💭", color: 0x5C4033 },
  quran:      { label: "Before/After Quran",      emoji: "📖", color: 0x311B92 },
};

const DUAS = [
  // ── MORNING ADHKAR ──────────────────────────────
  {
    id: "mor_001", category: "morning",
    title: "Morning Remembrance — Master of Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka, wa ana 'ala 'ahdika wa wa'dika mas-tata'tu, a'udhu bika min sharri ma sana'tu, abu'u laka bini'matika 'alayya, wa abu'u bidhanbi faghfir li fa innahu la yaghfirudh-dhunuba illa ant.",
    translation: "O Allah, You are my Lord, there is no deity worthy of worship except You. You created me and I am Your servant, and I am upon Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favor upon me and I acknowledge my sin, so forgive me, for none forgives sins except You.",
    source: "Sahih al-Bukhari 6306",
    when: "Recite once in the morning. The Prophet ﷺ said: 'Whoever says this during the day with conviction, and dies that day before evening — he is among the people of Paradise.'",
    count: "1x",
  },
  {
    id: "mor_002", category: "morning",
    title: "Morning Du'a — Protection of the Day",
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namutu, wa ilayka an-nushur.",
    translation: "O Allah, by Your leave we have reached the morning and by Your leave we have reached the evening, by Your leave we live and die, and unto You is the resurrection.",
    source: "Sunan Abu Dawud 5068, Sunan al-Tirmidhi 3391",
    when: "Recite in the morning (say 'amsayna' in the evening instead of 'asbahna')",
    count: "1x",
  },
  {
    id: "mor_003", category: "morning",
    title: "Morning Tasbih — SubhanAllah",
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "SubhanAllahi wa bihamdihi.",
    translation: "Glory be to Allah and all praise is for Him.",
    source: "Sahih al-Bukhari 6405, Sahih Muslim 2692",
    when: "Recite 100 times every morning. The Prophet ﷺ said: 'Whoever says this 100 times in the morning and 100 times in the evening will have no one bring more good deeds on the Day of Resurrection than him, except one who said the same or more.'",
    count: "100x",
  },

  // ── EVENING ADHKAR ──────────────────────────────
  {
    id: "eve_001", category: "evening",
    title: "Evening Remembrance — Master of Istighfar",
    arabic: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ",
    transliteration: "Allahumma anta rabbi la ilaha illa anta, khalaqtani wa ana 'abduka...",
    translation: "O Allah, You are my Lord, there is no deity worthy of worship except You. You created me and I am Your servant... (same as morning version)",
    source: "Sahih al-Bukhari 6306",
    when: "Recite once in the evening. 'Whoever says this in the evening with conviction, and dies that night — he is among the people of Paradise.'",
    count: "1x",
  },
  {
    id: "eve_002", category: "evening",
    title: "Ayat al-Kursi — Evening Protection",
    arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ",
    transliteration: "Allahu la ilaha illa huwal-Hayyul-Qayyum, la ta'khudhuhu sinatun wa la nawm...",
    translation: "Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep...",
    source: "Al-Baqarah 2:255 — Sahih al-Bukhari 2311",
    when: "Recite once every evening (and morning). The Prophet ﷺ said: 'Whoever recites Ayat al-Kursi every morning and evening, nothing will harm him.'",
    count: "1x",
  },
  {
    id: "eve_003", category: "evening",
    title: "Evening — Three Quls",
    arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ • قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ • قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    transliteration: "Qul huwa Allahu Ahad • Qul a'udhu bi-rabbil falaq • Qul a'udhu bi-rabbin-nas",
    translation: "Surah Al-Ikhlas, Surah Al-Falaq, and Surah An-Nas",
    source: "Sunan Abu Dawud 5082, Sunan al-Tirmidhi 3575",
    when: "Recite each 3 times every morning and evening. 'They are sufficient for you against everything.' — Prophet ﷺ",
    count: "3x each",
  },

  // ── BEFORE SLEEP ────────────────────────────────
  {
    id: "slp_001", category: "sleep",
    title: "Before Sleep — Tasbih of Fatimah",
    arabic: "سُبْحَانَ اللَّهِ (33) • الْحَمْدُ لِلَّهِ (33) • اللَّهُ أَكْبَرُ (34)",
    transliteration: "SubhanAllah (33) • Alhamdulillah (33) • Allahu Akbar (34)",
    translation: "Glory be to Allah (33) • All praise is for Allah (33) • Allah is the Greatest (34)",
    source: "Sahih al-Bukhari 3113, Sahih Muslim 2727",
    when: "Recite before sleeping. The Prophet ﷺ taught this to Fatimah (رضي الله عنها) when she asked for a servant to help with her work. He said this is better than a servant.",
    count: "33 + 33 + 34",
  },
  {
    id: "slp_002", category: "sleep",
    title: "Before Sleep — Seeking Protection",
    arabic: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    transliteration: "Bismika Allahumma amutu wa ahya.",
    translation: "In Your name, O Allah, I die and I live.",
    source: "Sahih al-Bukhari 6324",
    when: "Recite when laying down to sleep.",
    count: "1x",
  },
  {
    id: "slp_003", category: "sleep",
    title: "Before Sleep — Al-Kafirun",
    arabic: "قُلْ يَا أَيُّهَا الْكَافِرُونَ...",
    transliteration: "Qul ya ayyuhal-kafirun...",
    translation: "Surah Al-Kafirun (Say: O you disbelievers...)",
    source: "Sunan Abu Dawud 5055, Sunan al-Tirmidhi 3403",
    when: "Recite Surah Al-Kafirun before sleeping. The Prophet ﷺ said: 'It is a declaration of freedom from shirk.'",
    count: "1x",
  },

  // ── UPON WAKING ────────────────────────────────
  {
    id: "wak_001", category: "wakeup",
    title: "Upon Waking — Praise Allah",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    transliteration: "Alhamdulillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur.",
    translation: "All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.",
    source: "Sahih al-Bukhari 6312",
    when: "Recite immediately upon waking from sleep.",
    count: "1x",
  },

  // ── FOOD & EATING ──────────────────────────────
  {
    id: "fd_001", category: "food",
    title: "Before Eating",
    arabic: "بِسْمِ اللَّهِ",
    transliteration: "Bismillah.",
    translation: "In the name of Allah.",
    source: "Sunan Abu Dawud 3767, Sunan al-Tirmidhi 1858",
    when: "Say before every meal. If you forget and remember mid-meal, say: 'Bismillahi awwalahu wa akhirahu' — In the name of Allah at its beginning and its end.",
    count: "1x",
  },
  {
    id: "fd_002", category: "food",
    title: "After Eating",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلَا قُوَّةٍ",
    transliteration: "Alhamdulillahil-ladhi at'amani hadha wa razaqanihi min ghayri hawlin minni wa la quwwah.",
    translation: "All praise is for Allah who fed me this and provided it for me without any power or might on my part.",
    source: "Sunan Abu Dawud 4023, Sunan al-Tirmidhi 3458",
    when: "Recite after finishing a meal. The Prophet ﷺ said whoever says this after eating, his past sins will be forgiven.",
    count: "1x",
  },

  // ── DISTRESS & HARDSHIP ────────────────────────
  {
    id: "dis_001", category: "distress",
    title: "Du'a of Distress — Yunus (عليه السلام)",
    arabic: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin.",
    translation: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.",
    source: "Al-Anbiya' 21:87 — Sunan al-Tirmidhi 3505",
    when: "Recite in any hardship or distress. The Prophet ﷺ said: 'The supplication of my brother Yunus — no Muslim calls upon Allah with it in a matter except that Allah responds to him.'",
    count: "Repeat frequently",
  },
  {
    id: "dis_002", category: "distress",
    title: "Du'a for Anxiety — HasbunAllah",
    arabic: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ",
    transliteration: "HasbunAllahu wa ni'mal wakil.",
    translation: "Allah is sufficient for us, and He is the best Disposer of affairs.",
    source: "Al-Imran 3:173 — Sahih al-Bukhari 4563",
    when: "Say this when facing a difficult situation or feeling overwhelmed. Ibrahim (عليه السلام) said it when thrown into the fire. The Prophet ﷺ said it when told a large army was gathering against him.",
    count: "Repeat",
  },
  {
    id: "dis_003", category: "distress",
    title: "Du'a for Severe Distress",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ الْعَظِيمُ الْحَلِيمُ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ الْعَرْشِ الْعَظِيمِ، لَا إِلَهَ إِلَّا اللَّهُ رَبُّ السَّمَوَاتِ وَرَبُّ الأَرْضِ وَرَبُّ الْعَرْشِ الْكَرِيمِ",
    transliteration: "La ilaha illallahul-'Azimul-Halim, la ilaha illallahu Rabbul-'Arshil-'Azim, la ilaha illallahu Rabbus-samawati wa Rabbul-ardi wa Rabbul-'Arshil-Karim.",
    translation: "There is no deity except Allah, the Great, the Forbearing. There is no deity except Allah, Lord of the Mighty Throne. There is no deity except Allah, Lord of the heavens, Lord of the earth, and Lord of the Noble Throne.",
    source: "Sahih al-Bukhari 6346, Sahih Muslim 2730",
    when: "Recite when facing a severe calamity or distress.",
    count: "Repeat",
  },

  // ── MOSQUE ────────────────────────────────────
  {
    id: "msj_001", category: "mosque",
    title: "Entering the Mosque",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma aftah li abwaba rahmatik.",
    translation: "O Allah, open for me the gates of Your mercy.",
    source: "Sahih Muslim 713",
    when: "Enter with your right foot first and say this du'a.",
    count: "1x",
  },
  {
    id: "msj_002", category: "mosque",
    title: "Leaving the Mosque",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    transliteration: "Allahumma inni as'aluka min fadlik.",
    translation: "O Allah, I ask You from Your bounty.",
    source: "Sahih Muslim 713",
    when: "Exit with your left foot first and say this du'a.",
    count: "1x",
  },

  // ── FORGIVENESS ──────────────────────────────
  {
    id: "for_001", category: "forgiveness",
    title: "Seeking Forgiveness — Laylatul Qadr",
    arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni.",
    translation: "O Allah, You are the Pardoner, You love to pardon, so pardon me.",
    source: "Sunan al-Tirmidhi 3513",
    when: "Especially in the last 10 nights of Ramadan, and at all times. The Prophet ﷺ taught this to Aisha (رضي الله عنها) specifically for Laylatul Qadr.",
    count: "Repeat frequently",
  },
  {
    id: "for_002", category: "forgiveness",
    title: "Istighfar — 100 Times",
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha wa atubu ilayh.",
    translation: "I seek Allah's forgiveness and repent to Him.",
    source: "Sahih al-Bukhari 6307, Sahih Muslim 2702",
    when: "The Prophet ﷺ said: 'By Allah, I seek Allah's forgiveness and repent to Him more than seventy times a day.' Make it a constant practice.",
    count: "100x daily",
  },

  // ── PROTECTION ────────────────────────────────
  {
    id: "pro_001", category: "protection",
    title: "Complete Protection — Morning & Evening",
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahil-ladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-Sami'ul-'Alim.",
    translation: "In the name of Allah, with whose name nothing on earth or in the sky can cause harm, and He is the All-Hearing, the All-Knowing.",
    source: "Sunan Abu Dawud 5088, Sunan al-Tirmidhi 3388",
    when: "Recite 3 times every morning and evening. The Prophet ﷺ said: 'Whoever says it three times in the morning, no sudden affliction will harm him until evening, and whoever says it in the evening, until morning.'",
    count: "3x",
  },
  {
    id: "pro_002", category: "protection",
    title: "Protection from Evil Eye — A'udhu",
    arabic: "أُعِيذُكَ بِكَلِمَاتِ اللَّهِ التَّامَّةِ مِنْ كُلِّ شَيْطَانٍ وَهَامَّةٍ، وَمِنْ كُلِّ عَيْنٍ لَامَّةٍ",
    transliteration: "U'idhuka bikalimati-Llahit-tammati min kulli shaytanin wa hammah, wa min kulli 'aynin lammah.",
    translation: "I seek protection for you in the perfect words of Allah from every devil, every harmful creature, and every evil eye.",
    source: "Sahih al-Bukhari 3371",
    when: "The Prophet ﷺ used to say this for al-Hasan and al-Husayn (رضي الله عنهم). Recite over children or yourself for protection.",
    count: "1x",
  },

  // ── ANXIETY ──────────────────────────────────
  {
    id: "anx_001", category: "anxiety",
    title: "Du'a for Anxiety and Grief",
    arabic: "اللَّهُمَّ إِنِّي عَبْدُكَ وَابْنُ عَبْدِكَ وَابْنُ أَمَتِكَ، نَاصِيَتِي بِيَدِكَ، مَاضٍ فِيَّ حُكْمُكَ، عَدْلٌ فِيَّ قَضَاؤُكَ، أَسْأَلُكَ بِكُلِّ اسْمٍ هُوَ لَكَ سَمَّيْتَ بِهِ نَفْسَكَ...",
    transliteration: "Allahumma inni 'abduka wa ibnu 'abdika wa ibnu amatika, nasiyati biyadika, madin fiyya hukmuka, 'adlun fiyya qada'uka, as'aluka bikulli ismin huwa laka sammayta bihi nafsaka...",
    translation: "O Allah, I am Your servant, son of Your servant, son of Your maidservant. My forelock is in Your hand. Your judgment upon me is inevitable. Your decree concerning me is just. I ask You by every name that You have called Yourself...",
    source: "Musnad Ahmad 3712 — Classified Sahih by Ibn Hibban",
    when: "Recite when feeling grief, anxiety, or sadness. The Prophet ﷺ said: 'There is no person who is afflicted with anxiety or grief and says this except that Allah will remove his anxiety and replace his grief with joy.'",
    count: "1x",
  },

  // ── TRAVEL ───────────────────────────────────
  {
    id: "trv_001", category: "travel",
    title: "Du'a When Travelling",
    arabic: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    transliteration: "Allahu Akbar, Allahu Akbar, Allahu Akbar. SubhanaLladhi sakhkhara lana hadha wa ma kunna lahu muqrinin, wa inna ila Rabbina lamunqalibun.",
    translation: "Allah is the Greatest (3x). Glory be to the One who has subjected this to us and we could not have done it ourselves. And indeed, to our Lord we shall return.",
    source: "Sunan Abu Dawud 2602, Sunan al-Tirmidhi 3447",
    when: "Say when mounting any vehicle, boarding a plane, or beginning a journey.",
    count: "1x",
  },

  // ── RAIN ─────────────────────────────────────
  {
    id: "ran_001", category: "rain",
    title: "Du'a When It Rains",
    arabic: "اللَّهُمَّ صَيِّباً نَافِعاً",
    transliteration: "Allahumma sayyiban nafi'a.",
    translation: "O Allah, may it be a beneficial rain.",
    source: "Sahih al-Bukhari 1032",
    when: "Say when it rains. The time of rain is a time when du'a is answered.",
    count: "1x",
  },

  // ── GRATITUDE ────────────────────────────────
  {
    id: "grt_001", category: "gratitude",
    title: "Du'a of Gratitude — Sulayman (عليه السلام)",
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ وَعَلَى وَالِدَيَّ وَأَنْ أَعْمَلَ صَالِحاً تَرْضَاهُ وَأَدْخِلْنِي بِرَحْمَتِكَ فِي عِبَادِكَ الصَّالِحِينَ",
    transliteration: "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya wa 'ala walidayya wa an a'mala salihan tardahu wa adkhilni birahmatika fi 'ibadikassalihin.",
    translation: "My Lord, inspire me to be grateful for Your favor which You have bestowed upon me and upon my parents, and to do righteousness of which You approve, and admit me by Your mercy into the ranks of Your righteous servants.",
    source: "An-Naml 27:19",
    when: "Recite to ask Allah for the ability to be truly grateful for His blessings.",
    count: "1x",
  },
];

const CAT_KEYS = Object.keys(DUA_CATEGORIES);

function buildDuaEmbed(dua) {
  const cat = DUA_CATEGORIES[dua.category] || { label: dua.category, emoji: "🤲", color: 0x1B5E20 };
  return new EmbedBuilder()
    .setColor(cat.color)
    .setAuthor({ name: `${cat.emoji}  ${cat.label}` })
    .setTitle(dua.title)
    .addFields(
      { name: "🕌 Arabic",           value: dua.arabic },
      { name: "🔤 Transliteration",  value: `*${dua.transliteration}*` },
      { name: "🌐 Translation",      value: dua.translation },
      { name: "📖 Source",           value: dua.source,     inline: true },
      { name: "🔢 Count",            value: dua.count,      inline: true },
      { name: "⏰ When to Recite",   value: dua.when },
    )
    .setFooter({ text: "ادْعُونِي أَسْتَجِبْ لَكُمْ — Call upon Me; I will respond to you (40:60)" })
    .setTimestamp();
}

function buildCategoryMenu(currentCat = "") {
  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select_dua_category")
      .setPlaceholder("Filter by category...")
      .addOptions([
        { label: "All Du'as", value: "all", emoji: "🤲" },
        ...CAT_KEYS.map(k => ({
          label: DUA_CATEGORIES[k].label,
          value: k,
          emoji: DUA_CATEGORIES[k].emoji,
          default: k === currentCat,
        }))
      ])
  );
}

function buildNavButtons(duaId, catFilter = "all") {
  const pool = catFilter === "all" ? DUAS : DUAS.filter(d => d.category === catFilter);
  const idx  = pool.findIndex(d => d.id === duaId);
  const prev = pool[idx - 1];
  const next = pool[idx + 1];
  const rand = pool[Math.floor(Math.random() * pool.length)];
  const row  = new ActionRowBuilder();
  if (prev) row.addComponents(new ButtonBuilder().setCustomId(`dua_nav_${prev.id}_${catFilter}`).setLabel("◀ Prev").setStyle(ButtonStyle.Secondary));
  if (next) row.addComponents(new ButtonBuilder().setCustomId(`dua_nav_${next.id}_${catFilter}`).setLabel("Next ▶").setStyle(ButtonStyle.Secondary));
  if (rand) row.addComponents(new ButtonBuilder().setCustomId(`dua_nav_${rand.id}_${catFilter}`).setLabel("🎲 Random").setStyle(ButtonStyle.Primary));
  return row.components.length ? row : null;
}

const command = new SlashCommandBuilder()
  .setName("dua")
  .setDescription("Get authentic du'as and adhkar with Arabic, transliteration and source")
  .addStringOption(o =>
    o.setName("category").setDescription("Filter by category")
      .addChoices(...CAT_KEYS.slice(0, 25).map(k => ({ name: `${DUA_CATEGORIES[k].emoji} ${DUA_CATEGORIES[k].label}`, value: k })))
  );

async function handleDua(interaction) {
  await interaction.deferReply();
  const cat  = interaction.options.getString("category") || "all";
  const pool = cat === "all" ? DUAS : DUAS.filter(d => d.category === cat);
  if (!pool.length) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription("No du'as found.")] });
  const dua  = pool[Math.floor(Math.random() * pool.length)];
  const nav  = buildNavButtons(dua.id, cat);
  const comps = [buildCategoryMenu(cat)];
  if (nav) comps.push(nav);
  await interaction.editReply({ embeds: [buildDuaEmbed(dua)], components: comps });
}

async function handleSelectCategory(interaction) {
  await interaction.deferUpdate();
  const cat  = interaction.values[0];
  const pool = cat === "all" ? DUAS : DUAS.filter(d => d.category === cat);
  const dua  = pool[Math.floor(Math.random() * pool.length)];
  const nav  = buildNavButtons(dua.id, cat);
  const comps = [buildCategoryMenu(cat)];
  if (nav) comps.push(nav);
  await interaction.editReply({ embeds: [buildDuaEmbed(dua)], components: comps });
}

async function handleButton(interaction) {
  await interaction.deferUpdate();
  const parts = interaction.customId.split("_");
  const duaId = parts[2];
  const cat   = parts[3] || "all";
  const dua   = DUAS.find(d => d.id === duaId);
  if (!dua) return;
  const nav   = buildNavButtons(dua.id, cat);
  const comps = [buildCategoryMenu(cat)];
  if (nav) comps.push(nav);
  await interaction.editReply({ embeds: [buildDuaEmbed(dua)], components: comps });
}

module.exports = {
  DUAS, DUA_CATEGORIES,
  commands: [command.toJSON()],
  handlers: { dua: handleDua },
  selectHandler: handleSelectCategory,
  buttonHandler: handleButton,
};
