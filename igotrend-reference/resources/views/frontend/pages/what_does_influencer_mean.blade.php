@extends('layouts.app')
@section('title','Blog')
@section('content')
<div class="pt-8 pb-0" data-aos="fade-up">
        <div class="container">
            <div class="" style="background: url({{asset('images/alma.jpg')}})no-repeat; height: 430px;">
            </div>
        </div>
    </div>
    <!-- single pageheader close -->
    <div class="mt-n12 mb-6" data-aos="fade-up">
        <div class="container">
            <div class="row">
                <div class="offset-xl-1 col-xl-10 col-lg-8 col-md-12 col-sm-12 col-12">
                    <!-- post-content -->
                    <div class="">
                        <div class="row">
                            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                <!-- post single start -->
                                <div class="card p-4 border-0">
                                    <div class="mb-8 border-bottom pb-8">
                                        <div class="">
                                            <p class="badge badge-lightpeach text-danger mb-3 text-uppercase">Influencer 101</p>
                                            <a href="{{route('blog')}}" class="badge badge-warning text-danger mb-3 text-uppercase">Back to Blog Home</a>
                                            <h1 class=" mb-3"><strong>What does influencer mean?</strong></h1>
                                            <div class="mb-3">
                                                <div class="font-14">
                                                    <span>December 11, 2020</span>
                                                </div>
                                            </div>
                                            <div class="media align-items-center mt-4 mb-5">
                                                <img src="{{asset('images/igt_logo.png')}}" alt=""
                                                    class="img-fluid icon-md rounded-circle mr-2">
                                                <div class="media-body">
                                                    <span class="mr-2 font-weight-bold font-12">
                                                        <a href="#" class="text-primarydarker">IGT Team</a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>


                                        <strong>An influencer</strong> is someone who has:<p></p>
                                        <ul>
                                            <li>the power to affect the purchasing decisions of others because of his or her authority, knowledge, position, or relationship with his or her audience.</li>
                                            <li>a following in a distinct niche, with whom he or she actively engages. The size of the following depends on the size of his/her topic of the niche.</li>
                                        </ul>

                                        <h2><strong>What Are Social Media Influencers?</strong></h2>
                                        <p>Over the last decade, we have seen social media grow rapidly in importance. According to the January 2019 We Are Social report, 3.484 billion people actively use social media - that's 45% of the world’s population.</p>
                                        <p>Inevitably these people look up to influencers in social media to guide them with their decision making.</p>
                                        <p><strong>Influencers in social media</strong> are people who have built a reputation for their knowledge and expertise on a specific topic. They make regular posts about that topic on their preferred social media channels and generate large followings of enthusiastic, engaged people who pay close attention to their views.</p>
                                        <p>Brands love social media influencers because they can create trends and encourage their followers to buy products they promote.</p>
                                        <hr class="">
                                        <h2><strong>Types of Influencers</strong></h2>
                                        <p>You can separate different types of influencers in multiple ways. Some of the most common methods are by follower numbers, by types of content, and by the level of influence. You can also group influencers by the niche in which they operate. This means that influencers who may appear in a low category by one measure may seem more influential when looked at in another way. For example, many mega-influencers are also celebrities. Yet both these groups often have less real influence on their audience because they lack expertise in a dedicated narrow niche. Some micro and even nano-influencers can have a tremendous impact on followers in their specialist niche. They may be of significant benefit to a firm selling a product targeting that sector.</p>
                                        <hr class="">
                                        <h3><strong>By Follower Numbers</strong></h3>
                                        <p><strong>Mega-Influencers</strong></p>
                                        <p>Mega influencers are the people with a vast number of followers on their social networks. Although there are no fixed rules on the boundaries between the different types of followers, a common view is that mega-influencers have more than 1 million followers on at least one social platform.</p>
                                        <p>Many mega-influencers are celebrities who have gained their fame offline – movie stars, sportspeople, musicians, and even reality television stars. Some mega-influencers have gained their vast followings through their online and social activities, however.<br>
                                        Only major brands should approach mega-influencers for influencer marketing, however. Their services will be costly, up to $1 million per post, and they will most likely be extremely fussy about with whom they choose to partner. In virtually every case, mega-influencers will have agents working on their behalf to make any marketing deals.</p>
                                        <p><strong>Macro-Influencers</strong></p>
                                        <p>Macro-influencers are one step down from the mega-influencers, and maybe more accessible as influencer marketers. You would consider people with followers in the range between 40,000 and 1 million followers on a social network to be macro-influencers.<br>
                                        This group tends to consists of two types of people. They are either B-grade celebrities, who haven't yet made it to the big time. Or they are successful online experts, who have built up more significant followings than the typical micro-influencers. The latter type of macro-influencer is likely to be more useful for firms engaging in influencer marketing.<br>
                                        Macro-influencers generally have a high profile and can be excellent at raising awareness. There are more macro-influencers than mega-influencers, so it should be easier for a brand to find a macro-influencer willing to work with them. They are also more likely to be used to working with brands than micro-influencers, making communication easier.<br>
                                        However, you do need to be careful with this level of influencer. This is the category most likely to engage in influencer fraud – some have only reached their position thanks to the followers they have purchased.</p>
                                        <p><strong>Micro-Influencers</strong></p>
                                        <p>Micro-influencers are ordinary everyday people who have become known for their knowledge about some specialist niche. As such, they have usually gained a sizable social media following amongst devotees of that niche. Of course, it is not just the number of followers that indicates a level of influence; it is the relationship and interaction that a micro-influencer has with his or her followers.</p>
                                        <p>Although views differ, you could consider micro-influencers as having between 1,000 and 40,000 followers on a single social platform.<br>
                                        A micro-influencer may not be aware of the existence of a company before that company tries to reach out to him or her. If that is the case, the company will have first to convince the influencer of its worth. Micro-influencers have built up specialist followings, and they will not want to harm their relationship with their fans if they are seen to promote a lemon.<br>
                                        This requirement for the relationship between micro-influencers and brands to align with target audiences means that influencers are often picky about with whom they work. Some micro-influencers are happy to promote a brand for free. Others will expect some form of payment. Regardless of the price, any influencer is unlikely to want involvement with an "inappropriate" brand for their audience.</p>
                                        <p>The nature of influence is changing. Micro-influencers are becoming more common and more famous. Some have risen from virtual obscurity to being nearly as well known as traditional celebrities. This is particularly the case for Generation Z, who spend more time on the internet than watching television or going to sports or movies.<br>
                                        In all reality, micro-influencers are the influencers of the future. The internet has led to the fragmentation of the media into many small niche topics. Even if you are into something relatively obscure, you are likely to find a Facebook group or Pinterest board devoted to it. And it is in these niche groups and boards that micro-influencers establish themselves as genuine influencers.</p>
                                        <p><strong>Nano-Influencers</strong></p>
                                        <p>The newest influencer-type to gain recognition is the nano-influencer. These people only have a small number of followers, but they tend to be experts in an obscure or highly specialized field. You can think of nano-influencers as being the proverbial big fish in a small pond. In many cases, they have fewer than 1,000 followers – but they will be keen and interested followers, willing to engage with the nano-influencer, and listen to his/her opinions.<br>
                                        While many brands would consider nano-influencers as being inconsequential, they can be of extreme importance to firms who make highly specialized and niche products.<br>
                                        For most firms, however, nano-influencers probably lack sufficient influence to be of much use. They may be cheap and carry tremendous sway with a small number of people, but in most niches, you would need to work with hundreds of nano-influencers to reach a broad audience.</p>
                                        <hr class="">
                                        <h3><strong>By Types of Content</strong></h3>
                                        <p>The bulk of influencer marketing today occurs in social media, predominantly with micro-influencers, and blogging. With an increased interest in video, YouTubers are rapidly becoming more important too.</p>
                                        <p><strong>Bloggers</strong></p>
                                        <p>Bloggers and influencers in social media (predominantly micro-bloggers) have the most authentic and active relationships with their fans. Brands are now recognizing and encouraging this.<br>
                                        Blogging has been connected to influencer marketing for some time now. There are many highly influential blogs on the internet. If a popular blogger positively mentions your product in a post, it can lead to the blogger’s supporters wanting to try out your product.</p>
                                        <p>Many bloggers have built up sizeable followings in specific sectors. For instance, there are highly influential blogs about personal development, finance, health, childrearing, music, and many other topics, including blogging itself. The critical thing successful blogs have in common is the respect of their readers.</p>
                                        <p>A variation on having a blogger write something that recommends your product is to participate in guest posting. If you can grab a guest posting spot on a large blog, you can control the content, and you will typically be allowed to place a link to your own site in your author bio.</p>
                                        <p>If a blog is large and influential enough, you may be able to buy a sponsored post on their site. This allows you to either write a post yourself or heavily influence the blogger to write a post on your behalf. Unlike a casual mention in a blogger’s post or a guest post you have written, you will have to pay for a sponsored post (and it is likely to be labeled as such). However, this hasn’t harmed the results for many firms that have sponsored posts on blogs. Generation Z, in particular, seems to be immune to the Sponsored Post tag, and as long as the product aligns with the blog’s core audience, there shouldn’t be a problem.</p>
                                        <p><strong>YouTubers</strong></p>
                                        <p>Of course, a blog is not the only type of popular content on the internet. Another favorite type of content is video. In this case, rather than each video maker having their own site, most create a channel on YouTube. Brands often align with popular YouTube content creators.</p>
                                        <p><strong>Podcasters</strong></p>
                                        <p>Podcasting is a relatively recent form of online content that is growing in popularity. It has made quite a few household names now, possibly best epitomized by John Lee Dumas of Entrepreneurs on Fire. If you haven’t yet had the opportunity to enjoy podcasts, Digital Trends has put together a comprehensive list of the Best Podcasts of 2019.</p>
                                        <p><strong>Social Posts Only</strong></p>
                                        <p>Of course, bloggers, podcasters, and YouTubers rarely rely solely on their existing audiences to just turn up to their site, hoping there is new material. They usually promote new posts or videos heavily on social media - which makes most of these bloggers and content creators micro-influencers as well.<br>
                                        In fact, the vast majority of influencers now make their name on social media. While you will find influencers on all the leading social channels, the standout network in recent years has been Instagram, where many influencers craft their posts around a stunning image.</p>
                                        <hr class="">
                                        <h3><strong>By Level of Influence</strong></h3>
                                        <p><strong>Celebrities</strong></p>
                                        <p>Celebrities were the original influencers, and they still have a role to play, although their importance as influencers is waning.</p>
                                        <p>Influencer marketing grew out of celebrity endorsement. Businesses have found for many years that their sales usually rise when a celebrity promotes or endorses their product. There are still many cases of companies, particularly high-end brands, using celebrities as influencers.</p>
                                        <p>The problem for most brands is that there are only so many traditional celebrities willing to participate in this kind of influencer campaign, and they are unlikely to come cheaply. The exception will if a firm makes a product that a celebrity already likes and uses. In that situation, the celebrity may well be prepared to use his or her influence to say how good he/she believes the product to be. I am sure many musical instrument producers benefit from musicians playing their instruments by choice.</p>
                                        <p>One problem with using celebrities as influencers is if they may lack credibility with a product’s target audience. Justin Bieber may be highly influential if he recommended a type of acne cream, but would have little chance of influencing the buying patterns of those looking for a retirement village.</p>
                                        <p>Celebrities may have many fans and gigantic social media followings. However, it is debatable exactly how much real influence they hold over those who follow them.</p>
                                        <p>&nbsp;</p>
                                        <p><strong>Key Opinion Leaders</strong></p>
                                        <p>Industry experts and thought leaders such as journalists can also be considered influencers and hold an important position for brands.</p>
                                        <p>Industry leaders and thought leaders gain respect because of their qualifications, position, or experience about their topic of expertise. Often, this respect is earned more because of the reputation of where they work. For instance, a journalist at a major newspaper is probably no expert on the subjects he writes a news report on, but he is respected for being a good enough writer to work as such a prestigious publication.</p>
                                        <p>These experts include:</p>
                                        <ul>
                                        <li>Journalists</li>
                                        <li>Academics</li>
                                        <li>Industry experts</li>
                                        <li>Professional advisors</li>
                                        </ul>
                                        <p>If you can gain the attention of a journalist in a national newspaper, who in turn talks positively about your company in an article, then you are using him or her as an influencer in much the same way as you would a blogger or a social media influencer. There is a bonus in this situation in that the journalist will most probably write his/her report for free.</p>
                                        <p>Bloggers and content creators often work with industry leaders and thought leaders, and it is not uncommon to see them quoted in blog posts and even used in social media campaigns. The line between traditional media and social media is blurring.</p>
                                        <p>One thing to be aware of when working with key opinion leaders is that many have built up their reputation in an offline setting and may not have a large or active social following.</p>
                                        <p><strong>People with Above Average Influence on Their Audience</strong></p>
                                        <p>In many ways, the best influencers have built their reputation online for being an expert in some particular niche. They are similar to key opinion leaders but usually have gained their reputation more informally through their online activity. And they have created that reputation through the quality of the social posts they make, the blog posts they write, the podcasts they speak, and the videos they craft and post on their YouTube channels.</p>
                                        <p>Although nobody has yet created a generic term for these people, the British agency, PMYB, has come up with their trade-marked name - Chromo-Influencers™. These are the agency's highest-performing influencers, based on 46 crucial factors that impact consumer behavior.</p>
                                        <p>These influencers have the best communication skills and engagement with their audience. They have enticed their followers and become recognized as experts in their field.</p>
                                        <p>Their follower numbers very much depend on their subject of expertise. However, you will find that these people have incredibly high followings in comparison to others in their niche.</p>

                                    </div>

                                    <!-- post single close -->


                                    <!-- post auhtor start -->
                                    <div class="media mb-8 pb-7 border-bottom">
                                        <div class="mr-4"><img src="{{asset('images/igt_logo.png')}}" alt=""
                                                class="rounded-circle icon-xxl "></div>
                                        <div class="media-body">

                                            <h5 class="">IGT Team!</h5>
                                            <p>Building a better world by disrupting the social media marketing landscape in Africa</p>
                                        </div>
                                    </div>
                                    <a href="{{route('blog')}}"class="badge badge-warning text-danger mb-3 text-uppercase">Back to Blog Home</a>
                                    <!-- post author close -->
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection
