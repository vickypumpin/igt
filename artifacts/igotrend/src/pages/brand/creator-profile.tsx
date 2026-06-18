import { useParams } from "wouter";
import { useGetCreator, getGetCreatorQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiSnapchat } from "react-icons/si";
import { ExternalLink, TrendingUp, Gem, Trophy } from "lucide-react";

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

function PriceRow({ label, value }: { label: string; value: number | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/60 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-bold" style={{ color: "#0FA88E" }}>${value.toLocaleString()}</span>
    </div>
  );
}

export default function CreatorProfilePage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const { data: creator, isLoading } = useGetCreator(id, { query: { enabled: !!id, queryKey: getGetCreatorQueryKey(id) } });

  if (isLoading) return <BrandLayout><div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}</div></BrandLayout>;
  if (!creator) return <BrandLayout><div className="text-muted-foreground py-12 text-center">Creator not found</div></BrandLayout>;

  const badgeCfg = creator.badge ? BADGE_CFG[creator.badge] : null;

  const socials = [
    { profile: creator.instagramProfile, Icon: SiInstagram, label: "Instagram" },
    { profile: creator.tiktokProfile, Icon: SiTiktok, label: "TikTok" },
    { profile: creator.youtubeProfile, Icon: SiYoutube, label: "YouTube" },
    { profile: creator.facebookProfile, Icon: SiFacebook, label: "Facebook" },
    { profile: creator.twitterProfile, Icon: SiX, label: "X" },
    { profile: creator.snapchatProfile, Icon: SiSnapchat, label: "Snapchat" },
  ].filter(s => s.profile);

  return (
    <BrandLayout>
      <div className="max-w-3xl" data-testid="page-creator-profile">
        {/* Profile header */}
        <div className="bg-white rounded-2xl border border-border/60 p-6 shadow-sm mb-5">
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20">
              <AvatarImage src={creator.avatarUrl ?? undefined} />
              <AvatarFallback className="text-2xl font-black" style={{ background: badgeCfg?.gradient ?? "linear-gradient(135deg, #1DCFB3, #0FA88E)", color: "white" }}>{creator.firstName[0]}{creator.lastName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2.5 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold">{creator.firstName} {creator.lastName}</h1>
                {creator.badge && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold capitalize" style={{ background: badgeCfg?.bg ?? "rgba(29,207,179,0.1)", color: badgeCfg?.text ?? "#0FA88E" }}>
                    {creator.badge.replace("_", " ")}
                  </span>
                )}
              </div>
              <div className="text-sm text-muted-foreground mb-2 font-medium">@{creator.userName}{creator.country ? ` · ${creator.country}` : ""}</div>
              {creator.bio && <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">{creator.bio}</p>}
              {socials.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {socials.map(({ profile, Icon, label }) => {
                    const style = PLATFORM_STYLE[label] ?? { bg: "rgba(0,0,0,0.07)", color: "#555" };
                    return (
                      <a key={label} href={profile} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-semibold transition-all hover:opacity-80"
                        style={{ background: style.bg, color: style.color }}
                        data-testid={`link-${label.toLowerCase()}`}>
                        <Icon className="h-3.5 w-3.5" /> {label} <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          {[
            { label: "Total reach", value: creator.totalReach.toLocaleString(), gradient: "linear-gradient(135deg, #1DCFB3, #0FA88E)", Icon: TrendingUp },
            { label: "Campaigns done", value: creator.campaignsCompleted, gradient: "linear-gradient(135deg, #8B5CF6, #6D28D9)", Icon: Trophy },
            { label: "Gems earned", value: creator.gems, gradient: "linear-gradient(135deg, #F59E0B, #D97706)", Icon: Gem },
          ].map(({ label, value, gradient, Icon }) => (
            <Card key={label} className="border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2 text-white" style={{ background: gradient }}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-extrabold">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pricing */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="text-sm font-bold mb-4 flex items-center gap-2">
              <div className="w-1 h-4 rounded-full" style={{ background: "linear-gradient(#1DCFB3, #0FA88E)" }} />
              Pricing Rates (USD)
            </div>
            <PriceRow label="Instagram Post / day" value={creator.instagramDayPostPrice} />
            <PriceRow label="Instagram Post / week" value={creator.instagramWeekPostPrice} />
            <PriceRow label="TikTok Post / day" value={creator.tiktokDayPostPrice} />
            <PriceRow label="TikTok Post / week" value={creator.tiktokWeekPostPrice} />
            <PriceRow label="YouTube Video / day" value={creator.youtubeDayPostPrice} />
            <PriceRow label="YouTube Video / week" value={creator.youtubeWeekPostPrice} />
            {!creator.instagramDayPostPrice && !creator.tiktokDayPostPrice && !creator.youtubeDayPostPrice && (
              <p className="text-xs text-muted-foreground py-3 text-center">Pricing not set by this creator</p>
            )}
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
}
