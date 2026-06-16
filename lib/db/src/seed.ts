import { db } from "./index";
import { usersTable, campaignsTable, campaignInvitesTable, categoriesTable, settingsTable } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("Seeding database...");

  const adminHash = await bcrypt.hash("password", 10);
  const brandHash = await bcrypt.hash("password123", 10);
  const creatorHash = await bcrypt.hash("password123", 10);

  // Admin
  const [admin] = await db.insert(usersTable).values({
    firstName: "Super", lastName: "Admin", userName: "admin",
    email: "admin@igotrend.com", passwordHash: adminHash, role: "admin",
    isActive: true,
  }).onConflictDoNothing().returning();

  // Brands
  const [brand1] = await db.insert(usersTable).values({
    firstName: "Kwame", lastName: "Mensah", userName: "kwamedmc",
    email: "brand@igotrend.com", passwordHash: brandHash, role: "brand",
    companyName: "Apex Media Lagos", companyType: "Agency", companySize: "11-50",
    gender: "male", isActive: true,
  }).onConflictDoNothing().returning();

  const [brand2] = await db.insert(usersTable).values({
    firstName: "Amara", lastName: "Osei", userName: "amaramktng",
    email: "brand2@igotrend.com", passwordHash: brandHash, role: "brand",
    companyName: "Pulse Accra", companyType: "Agency", companySize: "51-200",
    gender: "female", isActive: true,
  }).onConflictDoNothing().returning();

  // Creators
  const creators = [
    { firstName: "Zara", lastName: "Diallo", userName: "zaraxvibes", email: "creator1@igotrend.com", gender: "female" as const, badge: "macro" as const, instagramProfile: "https://instagram.com/zaraxvibes", tiktokProfile: "https://tiktok.com/@zaraxvibes", bio: "Lifestyle & fashion creator based in Lagos", contentCategory: "Lifestyle, Fashion", instagramDayPostPrice: 350, instagramWeekPostPrice: 1800, tiktokDayPostPrice: 280, tiktokWeekPostPrice: 1400 },
    { firstName: "Kojo", lastName: "Asante", userName: "kojocreates", email: "creator2@igotrend.com", gender: "male" as const, badge: "mega" as const, instagramProfile: "https://instagram.com/kojocreates", youtubeProfile: "https://youtube.com/@kojocreates", bio: "Tech & gadgets reviewer from Accra", contentCategory: "Tech, Reviews", instagramDayPostPrice: 500, instagramWeekPostPrice: 2500, youtubeDayPostPrice: 600, youtubeWeekPostPrice: 3000 },
    { firstName: "Fatima", lastName: "Bangura", userName: "fatimafit", email: "creator3@igotrend.com", gender: "female" as const, badge: "micro" as const, instagramProfile: "https://instagram.com/fatimafit", tiktokProfile: "https://tiktok.com/@fatimafit", bio: "Fitness & wellness influencer — Freetown", contentCategory: "Fitness, Health", instagramDayPostPrice: 120, instagramWeekPostPrice: 600, tiktokDayPostPrice: 100, tiktokWeekPostPrice: 500 },
    { firstName: "Emeka", lastName: "Nwosu", userName: "emekafood", email: "creator4@igotrend.com", gender: "male" as const, badge: "mid_tier" as const, instagramProfile: "https://instagram.com/emekafood", youtubeProfile: "https://youtube.com/@emekafood", twitterProfile: "https://twitter.com/emekafood", bio: "Food & restaurant critic in Abuja", contentCategory: "Food, Travel", instagramDayPostPrice: 200, instagramWeekPostPrice: 1000, youtubeDayPostPrice: 250, youtubeWeekPostPrice: 1200 },
    { firstName: "Ama", lastName: "Boateng", userName: "amastyle", email: "creator5@igotrend.com", gender: "female" as const, badge: "nano" as const, instagramProfile: "https://instagram.com/amastyle", tiktokProfile: "https://tiktok.com/@amastyle", bio: "Emerging fashion creator from Kumasi", contentCategory: "Fashion, Beauty", instagramDayPostPrice: 60, instagramWeekPostPrice: 300, tiktokDayPostPrice: 50, tiktokWeekPostPrice: 250 },
    { firstName: "Chidi", lastName: "Okafor", userName: "chidimotivates", email: "creator6@igotrend.com", gender: "male" as const, badge: "macro" as const, instagramProfile: "https://instagram.com/chidimotivates", twitterProfile: "https://twitter.com/chidimotivates", youtubeProfile: "https://youtube.com/@chidimotivates", bio: "Business & motivation content — Lagos", contentCategory: "Business, Motivation", instagramDayPostPrice: 380, instagramWeekPostPrice: 1900, youtubeDayPostPrice: 400, youtubeWeekPostPrice: 2000 },
    { firstName: "Adaeze", lastName: "Eze", userName: "adabeauty", email: "creator7@igotrend.com", gender: "female" as const, badge: "mid_tier" as const, instagramProfile: "https://instagram.com/adabeauty", tiktokProfile: "https://tiktok.com/@adabeauty", bio: "Beauty & skincare influencer from Enugu", contentCategory: "Beauty, Skincare", instagramDayPostPrice: 220, instagramWeekPostPrice: 1100, tiktokDayPostPrice: 180, tiktokWeekPostPrice: 900 },
    { firstName: "Kofi", lastName: "Acheampong", userName: "kofigames", email: "creator8@igotrend.com", gender: "male" as const, badge: "micro" as const, instagramProfile: "https://instagram.com/kofigames", youtubeProfile: "https://youtube.com/@kofigames", tiktokProfile: "https://tiktok.com/@kofigames", bio: "Gaming & esports content from Accra", contentCategory: "Gaming, Entertainment", youtubeDayPostPrice: 150, youtubeWeekPostPrice: 750, tiktokDayPostPrice: 120, tiktokWeekPostPrice: 600 },
  ];

  const createdCreators = [];
  for (const c of creators) {
    const [creator] = await db.insert(usersTable).values({
      ...c,
      passwordHash: creatorHash, role: "creator", isActive: true, gems: Math.floor(Math.random() * 500),
    }).onConflictDoNothing().returning();
    if (creator) createdCreators.push(creator);
  }

  // Settings
  await db.insert(settingsTable).values({
    siteName: "iGoTrend", siteDescription: "West Africa's leading influencer marketing platform",
    gemPrice: 1, gemServiceFee: 5, creatorServiceFee: 10, brandServiceFee: 5,
    registrationStatus: true, loginStatus: true,
    contactEmail: "hello@igotrend.com",
  }).onConflictDoNothing();

  // Categories
  const contentCategories = ["Lifestyle", "Fashion", "Beauty", "Tech", "Gaming", "Food", "Travel", "Fitness", "Business", "Entertainment", "Music", "Sports"];
  for (const name of contentCategories) {
    await db.insert(categoriesTable).values({ name, slug: name.toLowerCase(), type: "content" }).onConflictDoNothing();
  }
  const creatorCategories = ["Influencer", "Content Creator", "Blogger", "Vlogger", "Photographer", "Podcaster"];
  for (const name of creatorCategories) {
    await db.insert(categoriesTable).values({ name, slug: name.toLowerCase().replace(/ /g, "-"), type: "creator" }).onConflictDoNothing();
  }

  // Campaigns for brand1
  if (brand1 && createdCreators.length >= 4) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const fmt = (d: Date) => d.toISOString().split("T")[0];

    const [camp1] = await db.insert(campaignsTable).values({
      brandId: brand1.id, name: "Q3 Brand Awareness — Apex Media", sponsor: "Apex Media Lagos",
      description: "Drive brand awareness for Apex Media's new digital services across West Africa",
      kpis: "10,000 impressions, 500 engagements, 50 story views",
      type: "influencer", campaignDuration: "day", status: "active",
      startDate: fmt(today), endDate: fmt(futureDate), noOfCreators: 4,
      dailyInstagramPost: 1, dailyInstagramStoryPost: 2, dailyInstagramReel: 1,
      dailyTiktokPost: 1, weeklyInstagramPost: 3,
      postCaptionText: "Discover how @ApexMediaLagos is transforming digital marketing in West Africa! #ApexMedia #iGoTrend",
      handlesHash: "@apexmedialagos #apexmedia #westafricamarketing #igotrend",
      dos: "Show authentic engagement, feature the product naturally, use all required hashtags",
      donts: "No negative comparisons with competitors, no political content",
    }).returning();

    if (camp1) {
      // Invite 4 creators
      for (let i = 0; i < 4 && i < createdCreators.length; i++) {
        await db.insert(campaignInvitesTable).values({
          campaignId: camp1.id, creatorId: createdCreators[i].id,
          status: i === 0 ? "active" : i === 1 ? "completed" : i === 2 ? "declined" : "pending",
        }).onConflictDoNothing();
      }
    }

    const [camp2] = await db.insert(campaignsTable).values({
      brandId: brand1.id, name: "Festive Season Launch", sponsor: "StyleHouse Africa",
      description: "Launch campaign for StyleHouse Africa's festive collection across social media",
      kpis: "50,000 reach, 2,000 clicks, 200 conversions",
      type: "influencer", campaignDuration: "weekly", status: "pending",
      startDate: fmt(new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)),
      endDate: fmt(new Date(today.getTime() + 37 * 24 * 60 * 60 * 1000)), noOfCreators: 6,
      weeklyInstagramPost: 2, weeklyTiktokPost: 2, weeklyYoutubePost: 1,
    }).returning();

    if (camp2 && createdCreators.length >= 2) {
      await db.insert(campaignInvitesTable).values({ campaignId: camp2.id, creatorId: createdCreators[4 % createdCreators.length].id, status: "pending" }).onConflictDoNothing();
    }
  }

  console.log("✅ Seeding complete!");
  console.log("Login credentials:");
  console.log("  Admin:   admin@igotrend.com / password");
  console.log("  Brand:   brand@igotrend.com / password123");
  console.log("  Creator: creator1@igotrend.com / password123");
}

seed().catch(console.error).finally(() => process.exit());
