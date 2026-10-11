'use client';

import {IconOrder, IconSearch} from "@/components/ui/SVGs";
import {useState} from "react";
import GlassBox from "./_components/GlassBox";
import {Select, TextInput} from "@mantine/core";
import {IconlyArrowUp2} from "@/components/assets/iconpack";
import DashPagination from "./_components/DashPagination";
import useDevice from "@/lib/hooks/useDevice";
import {ApiType} from "@/lib/api/base";
import useApi from "@/lib/hooks/useApi";
import DonatesTable from "./donations/DonatesTable";

function DashboardDonateHistory(props: {
  donates: ApiType<"GET", "/profile/donates">
}) {
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState<Record<string, string | undefined>>({});
  const { data: { donates = [], pages = 0 } = {}, refetch, loading } = useApi("/profile/donates", props.donates, {
    ...filter,
    per_page: "7",
    page: page + ""
  });
  const device = useDevice();

  return (
    <GlassBox color="#8881" borderFrom={'#0002'} borderTo={'#00000005'} bg={'#fff3'}  className='bg-transparent! grow' >
      <div className='p-4 flex flex-col items-center gap-3 h-full'>
        <div className="flex items-center gap-2 justify-between w-full">
          <div className="grow">
            <TextInput
              placeholder='جستجو بین ساختساز‌ها'
              rightSection=""
              leftSection={<IconSearch />}
              className='w-full'
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              onBlur={e => {
                setFilter(prev => ({
                  ...prev,
                  q: e?.target?.value || undefined
                }));
              }}
            />
          </div>
          <div className="grow flex items-center justify-end">
            <Select
              className=" lg:w-40"
              placeholder={device === 'desktop' ? "مرتب سازی" : ""}
              classNames={{
                input: "placeholder:text-black!"
              }}
              defaultValue={filter.order_by || 'desc'}
              data={[
                {
                  label: "قدیم به جدید",
                  value: "asc"
                }, {
                  label: "جدید به قدیم",
                  value: "desc"
                }
              ]}
              onChange={e => setFilter(prev => ({
                ...prev,
                order_by: e || undefined
              }))}
              leftSection={<IconOrder />}
              rightSection={device === 'desktop' ? (
                <div className='rotate-180'>
                  <IconlyArrowUp2 size={15} />
                </div>
              ) : <></>}
            />
          </div>
        </div>
        <DonatesTable donates={donates} refetch={refetch} />
        <DashPagination total={pages} disabled={loading} onChange={setPage} />
      </div>
    </GlassBox>
  )
}

export default DashboardDonateHistory;