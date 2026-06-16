import { useParams } from "wouter";
import { useGetCreator, getGetCreatorQueryKey } from "@workspace/api-client-react";
import BrandLayout from "@/components/layout/brand-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { SiInstagram, SiTiktok, SiYoutube, SiFacebook, SiX, SiSnapchat } from "react-icons/si";
import { ExternalLink, Star, Briefcase } from "lucide-react";

const BADGE_COLORS: Record<string, string> = {
  nano: "bg-gray-100 text-gray-700", micro: "bg-blue-100 text-blue-700", mid_tier: "bg-green-100 text-green-700",
  macro: "bg-purple-100 text-purple-700", mega: "bg-orange-100 text-orange-700", elite: "bg-yellow-100 text-yellow-700",
};

function PriceRow({ label, value }: { label: string; value: number | null | undefined }) {
  if (!value) return null;
  return <div className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xs font-medium">${value.toLocaleString()}</span>
  </div>;
}

export default function CreatorProfilePage() {
  const params = useParams<{ id: string }>();
  const id = parseInt(params.id, 10);
  const { data: creator, isLoading } = useGetCreator(id, { query: { enabled: !!id, queryKey: getGetCreatorQueryKey(id) } });

  if (isLoading) return <BrandLayout><div className="space-y-4">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div></BrandLayout>;
  if (!creator) return <BrandLayout><div className="text-muted-foreground py-12 text-center">Creator not found</div></BrandLayout>;

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
        <div className="flex items-start gap-5 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarImage src={creator.avatarUrl ?? undefined} />
            <AvatarFallback className="text-lg">{creator.firstName[0]}{creator.lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-semibold">{creator.firstName} {creator.lastName}</h1>
              {creator.badge && <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${BADGE_COLORS[creator.badge] ?? "bg-muted text-muted-foreground"}`}>{creator.badge.replace("_", " ")}</span>}
            </div>
            <div className="text-sm text-muted-foreground mb-2">@{creator.userName}{creator.country ? ` · ${creator.country}` : ""}</div>
            {creator.bio && <p className="text-sm text-muted-foreground max-w-xl">{creator.bio}</p>}
            {socials.length > 0 && (
              <div className="flex gap-3 mt-3">
                {socials.map(({ profile, Icon, label }) => (
                  <a key={label} href={profile ?? "#"} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-${label.toLowerCase()}`}>
                    <Icon className="h-3.5 w-3.5" /> {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{creator.totalReach.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-1">Total reach</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{creator.campaignsCompleted}</div>
            <div className="text-xs text-muted-foreground mt-1">Campaigns done</div>
          </CardContent></Card>
          <Card><CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{creator.gems}</div>
            <div className="text-xs text-muted-foreground mt-1">Gems earned</div>
          </CardContent></Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-3">Pricing Rates (USD)</div>
            <PriceRow label="Instagram Post / day" value={creator.instagramDayPostPrice} />
            <PriceRow label="Instagram Post / week" value={creator.instagramWeekPostPrice} />
            <PriceRow label="TikTok Post / day" value={creator.tiktokDayPostPrice} />
            <PriceRow label="TikTok Post / week" value={creator.tiktokWeekPostPrice} />
            <PriceRow label="YouTube Video / day" value={creator.youtubeDayPostPrice} />
            <PriceRow label="YouTube Video / week" value={creator.youtubeWeekPostPrice} />
            {!creator.instagramDayPostPrice && !creator.tiktokDayPostPrice && !creator.youtubeDayPostPrice && (
              <p className="text-xs text-muted-foreground py-2">Pricing not set</p>
            )}
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
}
