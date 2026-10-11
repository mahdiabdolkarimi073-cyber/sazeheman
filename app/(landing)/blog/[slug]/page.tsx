import HeaderBlogPostItem from "@/app/(landing)/blog/components/HeaderBlogPostItem";
import {Button} from "@mantine/core";
import Link from "next/link";
import BlogPostItemRelated from "@/app/(landing)/blog/[slug]/BlogPostItemRelated";
import 'swiper/css';
import TabsTitleList from "@/components/ui/stuff/TabsTitleList";
import {IconEmail, IconInstragram, IconTelegram} from "@/components/ui/SVGs";
import {api} from "@/lib/api/base";
import {notFound} from "next/navigation";
import {BlogPost} from "@/lib/api/base.type";
import StyledDiv from "@/components/helper/StyledDiv";
import {defaultBlogContentStyles} from "@/app/(landing)/blog/[slug]/styles";
import BlogPostShareUrl from "@/app/(landing)/blog/[slug]/BlogPostShareUrl";
import {Metadata} from "next";


export const generateMetadata = async (props: any): Promise<Metadata> => {
    const {slug} = await props.params;
    const post = await api("/blog/" + slug)
        .then(e => e.data?.post)
        .then(e => e as BlogPost);
    const base = {
        title: post?.meta?.title ?? post.title,
        description: post?.meta?.title ?? post.description,
    }
    return {
        ...base,
        keywords: post?.tags || [],
        category: post?.category,
        twitter: {
            ...base,
            images: [post?.thumbnail],
            card: "summary_large_image"
        },
        alternates: {
            canonical: "https://donofa.com/blog/" + slug + "/",
        },
    }
}

async function Page(props: any) {
    const {slug} = await props.params;
    const [post, posts] = await Promise.all([
        api("/blog/" + slug)
            .then(e => e.data?.post)
            .then(e => e as BlogPost)
            .catch(()=>undefined),
        api("/blog")
            .then(e => e.data.posts)
    ])

    if (!post) notFound();

    return (
        <div className={'relative'}>
            <HeaderBlogPostItem noBtn post={post}/>
            <div className={'container mx-auto p-3 lg:p-0 flex flex-col gap-5 pt-5!'}>
                <div className={'grid grid-cols-1 gap-7 lg:grid-cols-5'}>
                    <div className={'flex flex-col gap-3 col-span-4 items-stretch justify-stretch'}>
                        <div className={'grow'}>
                            <StyledDiv base={'.content'} className={'content'} style={defaultBlogContentStyles as any}>
                                {post.content.map((c, i) => {
                                    switch (c.type) {
                                        case "image":
                                            return (
                                                <img
                                                    key={i}
                                                    alt={c.data.alt}
                                                    src={c.data.url}
                                                    className={'w-full object-contain'}
                                                />
                                            );
                                        case "paragraph":
                                        case "heading":
                                            const Tag = c.data.level || "p";
                                            return (
                                                <Tag
                                                    key={i}
                                                    /*@ts-ignore*/
                                                    id={`${c.type}-${i}`}
                                                    dangerouslySetInnerHTML={{__html: c.data.content + ""}}
                                                />
                                            );
                                        default:
                                            return "Unknown Block" + c.type
                                    }
                                })}
                            </StyledDiv>
                        </div>
                        <div className={'flex items-center justify-between flex-wrap gap-5'}>
                            <div className={'grow lg:grow-0'}>
                                <p className={'font-medium'}>تگ ها</p>
                                <div className={'mt-1 flex items-center justify-start gap-3 flex-wrap max-w-2xl'}>
                                    {post.tags.map((o, i) => (
                                        <div key={i} className={'px-3 py-1 rounded-full border border-b2'}>
                                            <p className={'text-xs'}>{o}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className={'grow lg:grow-0'}>
                                <p className={'font-medium'}>به اشتراک بذارید</p>
                                <BlogPostShareUrl
                                    className={'flex mt-1 items-center justify-around lg:justify-between w-full lg:w-50 gap-3 flex-wrap max-w-2xl'}>
                                    {[IconTelegram, IconInstragram, IconEmail].map((O, i) => (
                                        <div>
                                            <O width={30} height={30} fill={'var(--primary)'}
                                               stroke={'var(--background)'}/>
                                        </div>
                                    ))}
                                </BlogPostShareUrl>
                            </div>
                        </div>
                    </div>
                    <div className={'hidden lg:block h-full relative'}>
                        <div className={'lg:flex flex-col gap-3 w-full sticky top-25'}>
                            <p className={'text-lg font-medium'}>فهرست مطالب</p>
                            <div className={'flex items-end'}>
                                <TabsTitleList
                                    offset={100}
                                    tabs={post.content
                                        .map((o, i) => ({
                                            ...o,
                                            index: i
                                        }))
                                        .filter(o => o.type === "heading" && o.data.level === "h2")
                                        .map((o) => ({
                                            label: o.data.content + "",
                                            value: `${o.type}-${o.index}`
                                        }))
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div>
                    <h2 className={'font-bold text-3xl mb-1'}>
                        دیگر مطالب ما
                    </h2>
                    <div className={'flex justify-between flex-wrap gap-3'}>
                        <p className={'opacity-80'}>
                            اگر این مطلب مورد پسند شما بود، ممکن است مطالب زیر نیز برای شما جذاب باشد.
                        </p>
                        <Link href={'.'}>
                            <Button radius={'xl'}>
                                مشاهده بیشتر
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className={'overflow-hidden '}>
                <div className={'container p-3 lg:p-0 flex flex-col gap-5 pt-5! mx-auto'}>
                    <BlogPostItemRelated items={posts}/>
                </div>
            </div>
        </div>
    )
}

export default Page;