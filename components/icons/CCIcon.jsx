import * as React from "react"
const CCIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={10}
    fill="none"
    {...props}
  >
    <path
      fill={props.color}
      fillRule="evenodd"
      d="M0 1.695c0-.63.514-1.14 1.149-1.14h9.702c.635 0 1.149.51 1.149 1.14v.875H0v-.875ZM0 4.02v4.287c0 .63.514 1.14 1.149 1.14h9.702c.635 0 1.149-.51 1.149-1.14V4.019H0Z"
      clipRule="evenodd"
    />
  </svg>
)
export default CCIcon
