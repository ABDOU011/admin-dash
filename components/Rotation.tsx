import * as React from "react";

import dayjs, { Dayjs } from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
function toHoursAndMinutes(totalMinutes:any) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
} // { hours: 1, minutes: 40 }

interface ProvenancesProps {
  rotation: {
    id?: number;
    start_time: number | null;
    end_time: number | null;
    interval: number | null;
  };
  setRotation: React.Dispatch<
    React.SetStateAction<{
      id?: number;
      start_time: number | null;
      end_time: number | null;
      interval: number | null;
    }>
  >;
}
const Rotation: React.FC<ProvenancesProps> = ({ rotation, setRotation }) => {
  const [value, setValue] = React.useState<Dayjs | null>(rotation.id? dayjs().set("hour",toHoursAndMinutes(rotation.start_time).hours).set("minute",toHoursAndMinutes(rotation.start_time).minutes) : null);
  const [value2, setValue2] = React.useState<Dayjs | null>( rotation.id? dayjs().set("hour",toHoursAndMinutes(rotation.end_time).hours).set("minute",toHoursAndMinutes(rotation.end_time).minutes) : null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedTimes = { ...rotation };

    setRotation({ ...rotation!, [name]: value });
  };

  console.log(rotation);

  return (
    <div className="flex flex-col items-start p-0 gap-[16px] w-full">
      <div className="flex flex-row gap-2 w-full">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["TimePicker", "TimePicker"]}>
            <TimePicker
              label="Roation Starting Hour"
              value={value}
              onChange={(newValue) => {
                setValue(newValue),
                  setRotation({
                    ...rotation!,
                    start_time: newValue?.minute()! + newValue?.hour()! * 60,
                  });
              }}
            />
            <TimePicker
              label="Rotation Ending Hour"
              value={value2}
              onChange={(newValue) => {
                setValue2(newValue),
                  setRotation({
                    ...rotation!,
                    end_time: newValue?.minute()! + newValue?.hour()! * 60,
                  });
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <input
        value={rotation.interval!}
        onChange={(e) => handleChange(e)}
        type="number"
        required
        name="interval"
        placeholder="Rotation Interval in Minutes"
        className="text-black pl-4 w-full h-[50px] border-[1px] border-[solid] border-[#E4E4E4] rounded-[16px]"
      />
    </div>
  );
};

export default Rotation;
