import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { customFetch } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiSnapchat } from "react-icons/si";
import { ExternalLink, BadgeCheck, Users, ArrowRight, Tag } from "lucide-react";

const BADGE_CFG: Record<string, { bg: string; text: string; gradient: string }> = {
  nano:     { bg: "rgba(107,114,128,0.12)", text: "#4B5563", gradient: "linear-gradient(135deg, #6B7280, #374151)" },
  micro:    { bg: "rgba(59,130,246,0.12)",  text: "#2563EB", gradient: "linear-gradient(135deg, #3B82F6, #2563EB)" },
  mid_tier: { bg: "rgba(16,185,129,0.12)",  text: "#059669", gradient: "linear-gradient(135deg, #10B981, #059669)" },
  macro:    { bg: "rgba(139,92,246,0.12)",  text: "#7C3AED", gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)" },
  mega:     { bg: "rgba(249,115,22,0.12)",  text: "#EA580C", gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  elite:    { bg: "rgba(234,179,8,0.12)",   text: "#B45309", gradient: "linear-gradient(135deg, #FBBF24, #F59E0B)" },
};

const PLATFORM_STYLE: Record<string, { bg: string; color: string }> = {
  Instagram: { bg: "rgba(225,48,108,0.1)",  color: "#E1306C" },
  TikTok:    { bg: "rgba(0,0,0,0.07)",      color: "#333" },
  YouTube:   { bg: "rgba(255,0,0,0.1)",     color: "#CC0000" },
  Facebook:  { bg: "rgba(59,89,152,0.1)",   color: "#3B5998" },
  X:         { bg: "rgba(29,161,242,0.1)",  color: "#1DA1F2" },
  Snapchat:  { bg: "rgba(255,252,0,0.15)",  color: "#C0A000" },
};

interface PublicCreator {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  badge: string | null;
  avatarUrl: string | null;
  bio: string | null;
  contentCategory: string | null;
  creatorCategory: string | null;
  verified: boolean;
  instagramProfile: string | null;
  tiktokProfile: string | null;
  youtubeProfile: string | null;
  twitterProfile: string | null;
  facebookProfile: string | null;
  snapchatProfile: string | null;
  instagramFollowers: number | null;
  tiktokFollowers: number | null;
  youtubeFollowers: number | null;
  twitterFollowers: number | null;
  facebookFollowers: number | null;
  snapchatFollowers: number | null;
  instagramDayPostPrice: number | null;
  instagramWeekPostPrice: number | null;
  instagramDayStoryPrice: number | null;
  instagramWeekStoryPrice: number | null;
  instagramDayReelPrice: number | null;
  instagramWeekReelPrice: number | null;
  tiktokDayPostPrice: number | null;
  tiktokWeekPostPrice: number | null;
  youtubeDayPostPrice: number | null;
  youtubeWeekPostPrice: number | null;
  twitterDayPostPrice: number | null;
  twitterWeekPostPrice: number | null;
  fbDayPostPrice: number | null;
  fbWeekPostPrice: number | null;
  snapchatDayStoryPrice: number | null;
  snapchatWeekStoryPrice: number | null;
  contentCreatorRate: number | null;
}

function PriceRow({ label, value }: { label: string; value: number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-bold" style={{ color: "#0FA88E" }}>₦{value.toLocaleString()}</span>
    </div>
  );
}

function FollowerStat({ label, count, Icon }: { label: string; count: number | null | undefined; Icon: React.ElementType }) {
  if (!count) return null;
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-semibold">{count.toLocaleString()}</span>
      <span className="text-muted-foreground text-xs">{label} followers</span>
    </div>
  );
}

export default function PublicCreatorProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const { data: creator, isLoading, isError } = useQuery<PublicCreator>({
    queryKey: ["/public/creators", username],
    queryFn: () => customFetch(`/api/public/creators/${username}`),
    enabled: !!username,
    retry: false,
  });

  const appBase = window.location.origin;
  const publicUrl = `${appBase}/c/${username}`;

  const socials = creator ? [
    { profile: creator.instagramProfile, Icon: SiInstagram, label: "Instagram", followers: creator.instagramFollowers },
    { profile: creator.tiktokProfile, Icon: SiTiktok, label: "TikTok", followers: creator.tiktokFollowers },
    { profile: creator.youtubeProfile, Icon: SiYoutube, label: "YouTube", followers: creator.youtubeFollowers },
    { profile: creator.facebookProfile, Icon: SiFacebook, label: "Facebook", followers: creator.facebookFollowers },
    { profile: creator.twitterProfile, Icon: SiX, label: "X", followers: creator.twitterFollowers },
    { profile: creator.snapchatProfile, Icon: SiSnapchat, label: "Snapchat", followers: creator.snapchatFollowers },
  ].filter(s => s.profile) : [];

  const hasRates = creator && (
    creator.instagramDayPostPrice || creator.instagramWeekPostPrice ||
    creator.instagramDayStoryPrice || creator.instagramWeekStoryPrice ||
    creator.instagramDayReelPrice || creator.instagramWeekReelPrice ||
    creator.tiktokDayPostPrice || creator.tiktokWeekPostPrice ||
    creator.youtubeDayPostPrice || creator.youtubeWeekPostPrice ||
    creator.twitterDayPostPrice || creator.twitterWeekPostPrice ||
    creator.fbDayPostPrice || creator.fbWeekPostPrice ||
    creator.snapchatDayStoryPrice || creator.snapchatWeekStoryPrice
  );

  const badgeCfg = creator?.badge ? BADGE_CFG[creator.badge] : null;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(160deg, #f0fdfb 0%, #f8fafc 60%)" }}>
      {/* Top nav */}
      <div className="border-b border-border/40 bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/">
            <span className="font-extrabold text-lg" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              iGoTrend
            </span>
          </Link>
          <Link href="/register">
            <Button size="sm" className="rounded-xl font-semibold text-xs gap-1.5" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}>
              Join iGoTrend <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        )}

        {isError && (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: "rgba(29,207,179,0.1)" }}>
              <Users className="h-8 w-8" style={{ color: "#1DCFB3" }} />
            </div>
            <h2 className="text-lg font-bold mb-1">Profile not found</h2>
            <p className="text-sm text-muted-foreground">This creator's profile is private or doesn't exist.</p>
            <Link href="/">
              <Button variant="outline" size="sm" className="mt-4 rounded-xl">Back to home</Button>
            </Link>
          </div>
        )}

        {creator && (
          <>
            {/* Profile header */}
            <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm">
              <div className="flex items-start gap-5">
                <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                  <AvatarImage src={creator.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-2xl font-black" style={{ background: badgeCfg?.gradient ?? "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>
                    {creator.firstName[0]}{creator.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl font-extrabold">{creator.firstName} {creator.lastName}</h1>
                    {creator.verified && (
                      <BadgeCheck className="h-5 w-5 flex-shrink-0" style={{ color: "#1DCFB3" }} />
                    )}
                    {creator.badge && (
                      <span className="text-xs px-2.5 py-1 rounded-full font-bold capitalize" style={{ background: badgeCfg?.bg ?? "rgba(29,207,179,0.1)", color: badgeCfg?.text ?? "#0FA88E" }}>
                        {creator.badge.replace("_", " ")}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2 font-medium">@{creator.userName}</div>
                  {creator.bio && <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{creator.bio}</p>}
                  {(creator.contentCategory || creator.creatorCategory) && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      {creator.contentCategory && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(29,207,179,0.1)", color: "#0FA88E" }}>
                          <Tag className="h-2.5 w-2.5" />{creator.contentCategory}
                        </span>
                      )}
                      {creator.creatorCategory && creator.creatorCategory !== creator.contentCategory && (
                        <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(139,92,246,0.1)", color: "#7C3AED" }}>
                          <Tag className="h-2.5 w-2.5" />{creator.creatorCategory}
                        </span>
                      )}
                    </div>
                  )}
                  {socials.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {socials.map(({ profile, Icon, label }) => {
                        const style = PLATFORM_STYLE[label] ?? { bg: "rgba(0,0,0,0.07)", color: "#555" };
                        return (
                          <a key={label} href={profile!} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:opacity-80"
                            style={{ background: style.bg, color: style.color }}>
                            <Icon className="h-3.5 w-3.5" /> {label} <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Follower counts */}
            {socials.some(s => s.followers) && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="text-sm font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(#1DCFB3, #0FA88E)" }} />
                    Audience Reach
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {socials.map(({ label, Icon, followers }) => followers ? (
                      <div key={label} className="flex items-center gap-2 p-3 rounded-xl border border-border/40">
                        <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <div>
                          <div className="font-bold text-sm">{followers.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">{label}</div>
                        </div>
                      </div>
                    ) : null)}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rate card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="text-sm font-bold mb-4 flex items-center gap-2">
                  <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(#1DCFB3, #0FA88E)" }} />
                  Rate Card
                </div>
                {hasRates ? (
                  <>
                    {(creator.instagramDayPostPrice || creator.instagramWeekPostPrice || creator.instagramDayStoryPrice || creator.instagramWeekStoryPrice || creator.instagramDayReelPrice || creator.instagramWeekReelPrice) && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1" style={{ color: "#E1306C" }}>Instagram</p>
                        <PriceRow label="Post / day" value={creator.instagramDayPostPrice} />
                        <PriceRow label="Post / week" value={creator.instagramWeekPostPrice} />
                        <PriceRow label="Story / day" value={creator.instagramDayStoryPrice} />
                        <PriceRow label="Story / week" value={creator.instagramWeekStoryPrice} />
                        <PriceRow label="Reel / day" value={creator.instagramDayReelPrice} />
                        <PriceRow label="Reel / week" value={creator.instagramWeekReelPrice} />
                      </div>
                    )}
                    {(creator.tiktokDayPostPrice || creator.tiktokWeekPostPrice) && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">TikTok</p>
                        <PriceRow label="Post / day" value={creator.tiktokDayPostPrice} />
                        <PriceRow label="Post / week" value={creator.tiktokWeekPostPrice} />
                      </div>
                    )}
                    {(creator.youtubeDayPostPrice || creator.youtubeWeekPostPrice) && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1" style={{ color: "#CC0000" }}>YouTube</p>
                        <PriceRow label="Video / day" value={creator.youtubeDayPostPrice} />
                        <PriceRow label="Video / week" value={creator.youtubeWeekPostPrice} />
                      </div>
                    )}
                    {(creator.twitterDayPostPrice || creator.twitterWeekPostPrice) && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1" style={{ color: "#1DA1F2" }}>X / Twitter</p>
                        <PriceRow label="Post / day" value={creator.twitterDayPostPrice} />
                        <PriceRow label="Post / week" value={creator.twitterWeekPostPrice} />
                      </div>
                    )}
                    {(creator.fbDayPostPrice || creator.fbWeekPostPrice) && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1" style={{ color: "#3B5998" }}>Facebook</p>
                        <PriceRow label="Post / day" value={creator.fbDayPostPrice} />
                        <PriceRow label="Post / week" value={creator.fbWeekPostPrice} />
                      </div>
                    )}
                    {(creator.snapchatDayStoryPrice || creator.snapchatWeekStoryPrice) && (
                      <div className="mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Snapchat</p>
                        <PriceRow label="Story / day" value={creator.snapchatDayStoryPrice} />
                        <PriceRow label="Story / week" value={creator.snapchatWeekStoryPrice} />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground py-3 text-center">This creator hasn't published their rate card yet.</p>
                )}
              </CardContent>
            </Card>

            {/* CTA */}
            <div className="rounded-2xl p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(29,207,179,0.1), rgba(15,168,142,0.05))", border: "1px solid rgba(29,207,179,0.2)" }}>
              <h3 className="font-extrabold text-lg mb-1">Work with {creator.firstName}?</h3>
              <p className="text-sm text-muted-foreground mb-4">Create a free account on iGoTrend to send a campaign invite and start collaborating.</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Link href="/register">
                  <Button className="rounded-xl font-semibold px-6" style={{ background: "linear-gradient(135deg, #1DCFB3, #0FA88E)", border: "none" }}>
                    Get started free
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="rounded-xl font-semibold px-6">
                    Sign in
                  </Button>
                </Link>
              </div>
            </div>

            {/* Footer note */}
            <p className="text-center text-xs text-muted-foreground pb-4">
              Profile URL: <span className="font-mono">{publicUrl}</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
