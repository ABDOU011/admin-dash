"use client";
import { useEffect, useRef, useState } from "react";

import { PieChart } from "@mui/x-charts/PieChart";

import { BarChart } from "@mui/x-charts";
import { chart, chart2, history, piechart } from "@/app/protected/cities/actions";

export default function COverview({}: {}) {
 
  
 
  const [linedata, setLineData] = useState<any>();
  const [histo, setHistory] = useState<any>();
  const [histo2, setHistory2] = useState<any>();
  const [histo3, setHistory3] = useState<any>();
  const maxCount = Math.max(...(linedata ? linedata : []));
  

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    
    
    
    const hist1 = await history();
    setHistory(hist1);
    const hist2 = await chart2();
    setHistory2(hist2);
    const hist3 = await chart();
    setHistory3(hist3);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    async function runHistoryCode() {
      const historyList = document.createElement("div");
      historyList.classList.add("flex", "flex-col", "gap-2");

      histo?.forEach(
        (item: { cities: any; name: any; created_at: any }) => {
          const historyItem = document.createElement("div");
          historyItem.classList.add("flex", "flex-row", "gap-2");

          const adminName = document.createElement("p");
          adminName.classList.add("text-black", "text-[12px]", "admin-name");

          const name = document.createElement("span");
          name.classList.add("text-black");
          name.textContent = `${item.name}`;

          const admin = document.createElement("span");
          admin.textContent = `'s Itinerary involves `;

          adminName.appendChild(name);
          adminName.appendChild(admin);

          for(let i=0;i<item.cities.length;i++){
            const admin1 = document.createElement("span");
            admin1.classList.add("text-[#24BAEC]");
            if(i==item.cities.length-1 && i!=0){
              admin1.textContent = `and ${item.cities[i]} `;
            }
            else if(item.cities.length==1){
              admin1.textContent = `${item.cities[i]} `;
            }
            else if(item.cities.length>0 && i==item.cities.length-2){
              admin1.textContent = `${item.cities[i]} `;
            }
            else if(item.cities.length>1 ){
              admin1.textContent = `${item.cities[i]}, `;
            }
            
            adminName.appendChild(admin1);
          }
          

          

          
         
          
          

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
  const colors = ["#4318FF", "#FFA3F6", "#00CFB1"];
  const piechart:any = []
  console.log(histo2)
  for(let i=0;i<histo2?.result.length;i++){
    piechart.push({
      name:histo2?.result[i].name,
      value:histo2?.result[i].value,
      color:colors[i]
    })
  }

  return (
    <div className="flex flex-col items-center pt-0 px-[24px] pb-[80px] gap-[24px] w-full">
      <div className="flex flex-row items-start px-[32px] py-[24px] gap-[64px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
        <div className="flex flex-col gap-2">
          <h1 className="text-black text-3xl">{histo3?.total}</h1>
          <h3 className="text-black opacity-50 text-[12px]">Visitors</h3>
        </div>
        <BarChart
          xAxis={[{ data: histo3? histo3.labels : [], scaleType: "band" }]}
          series={[
            {
              data: histo3? histo3.values : [], // data: linedata ? linedata : [],
            },
          ]}
          width={780}
          height={300}
          leftAxis={null}
        />
      </div>
      <div className="flex flex-row items-start justify-between w-full">
        <div className="flex flex-col items-start w-[556px] px-[16px] py-[24px] gap-[16px] bg-[#FFFFFF] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]">
          <div className="flex flex-row justify-between w-full">
            <p className="font-semibold text-[16px] text-[#1B1E28]">
              Itineraries involved
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
              Active cities
            </p>
            <button className="text-[12px] text-black opacity-50">today</button>
          </div>
          <PieChart
          
            series={[
              {
                data: piechart
              },
            ]}
            width={350}
            height={200}
            margin={{ left: 70 }}
          />
          <div className="flex flex-row justify-around items-center w-full">
            {piechart.map((item:any) => (
              <div className="flex flex-col ">
              <div className="flex flex-row gap-1 items-center">
                <div className={ `w-2 h-2 rounded-full bg-[${item.color}]`}></div>
                <p className="text-[12px] text-[#1B1E28] opacity-70">{item.name}</p>
              </div>
              <p className="font-bold text-[18px] text-[#1B1E28] opacity-70">
              {Math.trunc((100 * item.value) / histo2?.total)}%
              </p>
            </div>
              ))}
            
          </div>
        </div>
      </div>
    </div>
  );
}
