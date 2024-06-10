import * as React from "react"
const TimeIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <path
      fill={props.color}
      d="M6 0a6 6 0 1 1 0 12A6 6 0 0 1 6 0Zm0 2.4a.6.6 0 0 0-.6.6v3a.6.6 0 0 0 .176.424l1.8 1.8a.6.6 0 0 0 .848-.848L6.6 5.752V3a.6.6 0 0 0-.6-.6Z"
    />
  </svg>
)
export default TimeIcon
