'use client';

import {LoadingOverlay, TextInput} from "@mantine/core";
import {IconOrder, IconSearch} from "@/components/ui/SVGs";
import CustomSelect from "@/components/ui/base/CustomSelect";
import {useState} from "react";
import {useDebouncedState} from "@mantine/hooks";
import PostItem from "@/app/(landing)/blog/components/PostItem";
import DashPagination from "@/app/(landing)/dashboard/_components/DashPagination";
import useApi from "@/lib/hooks/useApi";
import EmptyList from "@/components/helper/EmptyList";
import {ApiType} from "@/lib/api/base";

function BlogSearch(props: { defaultRes: ApiType<'GET', '/blog'> }) {
    const [order, setOrder] = useState("desc" as "asc" | "desc");
    const [s, setS] = useDebouncedState('', 500);
    const [page, setPage] = useState(1)
    const {
        data: {pages, posts: items},
        loading
    } = useApi("/blog", props.defaultRes, {
        per_page: "10",
        q: s || undefined,
        order_by: order,
        page: page + ""
    });

    return (
        <div className={'mt-2 flex flex-col gap-5'}>
            <div className={'flex items-center justify-between gap-1 flex-nowrap'}>
                <TextInput
                    leftSection={<IconSearch/>}
                    onChange={e => {
                        setS(e.target.value)
                    }}
                    placeholder={'جستجو بین مقالات'}
                    classNames={{
                        wrapper: "lg:w-100 grow lg:grow-0"
                    }}
                />
                <CustomSelect
                    onChange={setOrder as any}
                    icon={<IconOrder width={23} height={23}/>}
                    data={[
                        {
                            label: "قدیم به جدید",
                            value: "asc",
                            icon: <IconOrder/>
                        },
                        {
                            label: "جدید به قدیم",
                            value: "desc",
                            icon: <IconOrder className={'rotate-180'}/>
                        }
                    ]}
                    placeholder={"مرتب سازی"}
                    classNames={{
                        placeholder: "opacity-100 text-base hidden lg:block",
                        labelArrow: "hidden lg:block",
                        selectedLabel: "hidden lg:block"
                    }}
                    className={'lg:w-40'}
                />
            </div>
            <div className={'relative'}>
                <LoadingOverlay visible={loading}/>
                {!!items.length ? (
                    <div className={'grid grid-cols-1 gap-5 lg:grid-cols-3 2xl:grid-cols-4 relative'}>
                        {items.map((o, i) => (
                            <PostItem post={o} key={i}/>
                        ))}
                    </div>
                ) : (
                    <EmptyList/>
                )}
            </div>


            <div className={'flex items-center justify-center'}>
                <DashPagination total={pages} onChange={setPage}/>
            </div>
        </div>
    )
}

export default BlogSearch;