import * as React from "react";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface ProvenancesProps {
  schedule: { id?: number; start_times: number[] };
  setSchedule: React.Dispatch<
    React.SetStateAction<{ id?: number; start_times: number[] }>
  >;
}
const Schedule: React.FC<ProvenancesProps> = ({ schedule, setSchedule }) => {
  const [value, setValue] = React.useState<Dayjs | null>();

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedTimes = { ...schedule };

    updatedTimes.start_times[index] = Number(value);

    setSchedule(updatedTimes);
  };
  const handleChange2 = (index: number, name: any, value: any) => {
    const updatedTimes = { ...schedule };

    updatedTimes.start_times[index] = Number(value);

    setSchedule(updatedTimes);
  };
  const handleAddProvenance = () => {
    const updatedTimes = { ...schedule };
    updatedTimes.start_times.push(0);
    setSchedule(updatedTimes);
  };
  console.log(schedule);

  return (
    <div className="flex flex-col items-start p-0 gap-[16px] w-full">
      {schedule!.start_times!.map((element, index) => (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="">Trip {index + 1} start time</label>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <TimePicker
                label="Roation Starting Hour"
                value={value}
                onChange={(newValue) => {
                  handleChange2(
                    index,
                    "start_times",
                    newValue?.minute()! + newValue?.hour()! * 60
                  ),
                    setValue(newValue);
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
      ))}
      <button
        onClick={handleAddProvenance}
        className="flex flex-row justify-center items-center gap-[10px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px] w-[566px] h-[56px] text-[#24BAEC]"
      >
        Add New Trip
      </button>
    </div>
  );
};

export default Schedule;
