import * as React from "react"
const Pencil = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill={props.color}
      stroke="#1B1E28"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={0.676}
      d="M11.095.905A1.82 1.82 0 0 0 8.51.923L1.522 7.91a1.352 1.352 0 0 0-.354.62l-.68 2.651c-.05.2.13.38.33.33l2.65-.68c.236-.06.45-.183.621-.354l6.988-6.988a1.82 1.82 0 0 0 .018-2.585Z"
    />
  </svg>
)
export default Pencil
