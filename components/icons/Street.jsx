const Street = ({ color }) => (
  <svg
    width="10"
    height="8"
    viewBox="0 0 10 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 7.5L3 0.5M7 0.5L9 7.5M5 2V1M5 4.5V3.5M5 7V6"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default Street;
