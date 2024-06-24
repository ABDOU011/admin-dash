"use client";
import { useEffect, useRef, useState } from "react";
import Userslogo from "../components/icons/Userslogo";
import ActiveUserslogo from "./icons/ActiveUserslogo";
import NewUserslogo from "./icons/NewUserslogo";
import { LineChart } from "@mui/x-charts/LineChart";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  monthchart,
  newUsers,
  usersCount,
  history,
  revenuechart,
  piechart,
} from "@/app/protected/users/actions/actions";
import Select from "react-select";
import { Bars } from "react-loader-spinner";

export default function Dashboard({}: {}) {
  const [searchResults, setSearchResults] = useState<
    { value?: number; label: string }[]
  >([
    { value: 1, label: "Jan" },
    { value: 2, label: "Feb" },
    { value: 3, label: "Mar" },
    { value: 4, label: "Apr" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "Aug" },
    { value: 9, label: "Sept" },
    { value: 10, label: "Oct" },
    { value: 11, label: "Nov" },
    { value: 12, label: "Dec" },
  ]);

  const getDaysInMonth = (month: number) => {
    const d = new Date().getFullYear();
    const date = new Date(Date.UTC(d, month, 0));
    return Array.from({ length: date.getUTCDate() }, (_, i) =>
      (i + 1).toString()
    );
  };

  const [newusers, setNewUsers] = useState<any>(0);
  const [totalusers, setTotalUsers] = useState<any>(0);
  const [linedata, setLineData] = useState<any>();
  const [linedata2, setLineData2] = useState<any>();
  const [histo, setHistory] = useState<any>();
  const [histo2, setHistory2] = useState<any>();
  const maxCount = Math.max(...(linedata ? linedata : []));
  const [month, setMonth] = useState<any>(new Date().getMonth() + 1);
  const maxIndex = linedata?.indexOf(maxCount);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    const newU = await newUsers();
    setNewUsers(newU);
    const totalU = await usersCount();
    setTotalUsers(totalU);
    const line = await monthchart();
    setLineData(line);
    const line2 = await revenuechart(month);
    setLineData2(line2);
    const hist = await history();
    setHistory(hist);
    const hist2 = await piechart();
    setHistory2(hist2);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [month]);

  useEffect(() => {
    setLoading(true);
    async function runHistoryCode() {
      const historyList = document.createElement("div");
      historyList.classList.add("flex", "flex-col", "gap-2");

      histo?.forEach(
        (item: { admin_name: any; name: any; created_at: any }) => {
          const historyItem = document.createElement("div");
          historyItem.classList.add("flex", "flex-row", "gap-2");

          const adminName = document.createElement("p");
          adminName.classList.add("text-black", "text-[12px]", "admin-name");

          const name = document.createElement("span");
          name.classList.add("text-[#24BAEC]");
          name.textContent = `${item.name}`;

          const admin = document.createElement("span");
          admin.textContent = `Admin `;

          const admin1 = document.createElement("span");
          admin1.classList.add("text-[#24BAEC]");
          admin1.textContent = `${item.admin_name} `;

          const admin2 = document.createElement("span");
          admin2.textContent = `has just created a new user `;

          adminName.appendChild(admin);
          adminName.appendChild(admin1);
          adminName.appendChild(admin2);
          adminName.appendChild(name);

          const timeAgo = document.createElement("p");
          timeAgo.classList.add("text-black", "text-[12px]", "opacity-50");
          timeAgo.textContent = calculateTimeAgo(item.created_at);

          historyItem.appendChild(adminName);
          historyItem.appendChild(timeAgo);

          historyList.appendChild(historyItem);
        }
      );
      document.getElementById("creation")?.replaceChildren(historyList);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(runHistoryCode, 500);

    setLoading(false)
  }, [histo]);

  // Add the historyList to the desired parent element
  // document.getElementById("creation")?.appendChild(historyList);

  function calculateTimeAgo(timestamp: any) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.abs(now.getTime() - then.getTime());

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} days ago`;
    } else if (hours > 0) {
      return `${hours} hours ago`;
    } else if (minutes > 0) {
      return `${minutes} minutes ago`;
    } else {
      return `${seconds} seconds ago`;
    }
  }
  const daysInMonth = getDaysInMonth(month);
  const extractRevenue = () => {
    if (!linedata2) return [];
    const data = linedata2.map((d: any) => d.revenue);
    return data;
  };
  const total = linedata2?.[0].total_revenue;

  const revenues = extractRevenue();
  const pietotal = histo2?.[0].value + histo2?.[1].value + histo2?.[2].value;

  return (
    <div>
    {loading? (
      <div className="ml-[500px] text-black text-[18px]">Loading <Bars
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="bars-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      /></div>
    )
  :
  (
    <div className="flex flex-col items-center pt-0 px-[24px] pb-[80px] gap-[24px] w-full">
      <div className="flex flex-row justify-between gap-[40px] w-full">
        <div className="items-start px-[24px] py-[20px]  w-full h-[80px] bg-[#FFFFFF] border-[0.6px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row gap-3">
            <Userslogo></Userslogo>
            <div className="flex flex-col justify-center">
              <p className="font-medium text-[16px] text-[#1B1E28]">
                Total Users
              </p>
              <p className="font-normal text-[12px] text-[#1B1E28] opacity-75">
                {totalusers}
              </p>
            </div>
          </div>
        </div>
        <div className="items-start px-[24px] py-[20px]  w-full h-[80px] bg-[#FFFFFF] border-[0.6px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row gap-3">
            <NewUserslogo></NewUserslogo>
            <div className="flex flex-col justify-center">
              <p className="font-medium text-[16px] text-[#1B1E28]">
                Transportation Health
              </p>
              <p className="font-normal text-[12px] text-[#00B499] opacity-75">
                Healthy
              </p>
            </div>
          </div>
        </div>
        <div className="items-start px-[24px] py-[20px]  w-full h-[80px] bg-[#FFFFFF] border-[0.6px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row gap-3">
            <ActiveUserslogo></ActiveUserslogo>
            <div className="flex flex-col justify-center">
              <p className="font-medium text-[16px] text-[#1B1E28]">
                Online Payments
              </p>
              <p className="font-normal text-[12px] text-[#00B499] opacity-75">
                {newusers}%
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-start px-[32px] py-[24px] gap-[64px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
        <div className="flex flex-col gap-6">
          <Select
            className="text-black w-full"
            required
            placeholder={
              searchResults.find((result) => result.value === Number(month))
                ?.label
            }
            options={searchResults}
            onChange={(NewValue) => {
              setMonth(NewValue?.value);
              fetchData();
            }}
          />
          <h1 className="text-black text-3xl">{total} DA</h1>
          <h4 className="text-black">Total Revenue</h4>
        </div>
        <LineChart
          xAxis={[{ data: daysInMonth ? daysInMonth : [], scaleType: "point" }]}
          series={[
            {
              data: revenues.length > daysInMonth.length ? [] : revenues,
            },
          ]}
          width={780}
          height={300}
          leftAxis={null}
        />
      </div>
      <div className="flex flex-row items-start justify-between gap-[40px] w-full">
        <div className="flex flex-col items-start w-full px-[16px] py-[24px] gap-[16px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row justify-between w-full">
            <p className="font-semibold text-[16px] text-[#1B1E28]">
              Users activities logs
            </p>
            <button
              onClick={() => {
                fetchData();
              }}
              className="text-[12px] text-[#FF7029]"
            >
              refresh
            </button>
          </div>
          <div id="creation" className="flex flex-col items-start gap-[4px]">
            <div className="flex flex-row gap-2"></div>
          </div>
        </div>

        <div className="flex flex-col items-center w-[360px] px-[16px] py-[24px] gap-[16px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row justify-between w-full">
            <p className="font-semibold text-[16px] text-[#1B1E28]">
              Users activities logs
            </p>
            
          </div>
          <PieChart
            series={[
              {
                data: histo2? histo2 : [],
              },
            ]}
            width={350}
            height={200}
            margin={{ left: 70 }}
          />
          <div className="flex flex-row justify-around items-center w-full">
            <div className="flex flex-col ">
              <div className="flex flex-row gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-[#4318FF]"></div>
                <p className="text-[12px] text-[#1B1E28] opacity-70">
                  Reserved
                </p>
              </div>
              <p className="font-bold text-[18px] text-[#1B1E28] opacity-70">
                {Math.trunc((100 * histo2?.[0].value) / pietotal)}%
              </p>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-row gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-[#FFA3F6]"></div>
                <p className="text-[12px] text-[#1B1E28] opacity-70">Done</p>
              </div>
              <p className="font-bold text-[18px] text-[#1B1E28] opacity-70">
                {Math.trunc((100 * histo2?.[1].value) / pietotal)}%
              </p>
            </div>
            <div className="flex flex-col ">
              <div className="flex flex-row gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-[#00CFB1]"></div>
                <p className="text-[12px] text-[#1B1E28] opacity-70">
                  Cancelled
                </p>
              </div>
              <p className="font-bold text-[18px] text-[#1B1E28] opacity-70">
                {Math.trunc((100 * histo2?.[2].value) / pietotal)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}
