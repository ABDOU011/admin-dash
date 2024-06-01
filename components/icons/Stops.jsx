const Stops = ({ color }) => (
  <svg
    width="11"
    height="10"
    viewBox="0 0 11 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.5 1C0.5 0.867392 0.552678 0.740215 0.646447 0.646447C0.740215 0.552678 0.867392 0.5 1 0.5H2C2.13261 0.5 2.25978 0.552678 2.35355 0.646447C2.44732 0.740215 2.5 0.867392 2.5 1V3C2.5 3.13261 2.44732 3.25978 2.35355 3.35355C2.25978 3.44732 2.13261 3.5 2 3.5H1C0.867392 3.5 0.740215 3.44732 0.646447 3.35355C0.552678 3.25978 0.5 3.13261 0.5 3V1ZM7 7.5C7 7.76522 7.10536 8.01957 7.29289 8.20711C7.48043 8.39464 7.73478 8.5 8 8.5C8.26522 8.5 8.51957 8.39464 8.70711 8.20711C8.89464 8.01957 9 7.76522 9 7.5C9 7.23478 8.89464 6.98043 8.70711 6.79289C8.51957 6.60536 8.26522 6.5 8 6.5C7.73478 6.5 7.48043 6.60536 7.29289 6.79289C7.10536 6.98043 7 7.23478 7 7.5Z"
      stroke={color}
      stroke-width="0.839807"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4 1.5H7.5C8.8805 1.5 10 3.067 10 5V7.5H9M7 7.5H3"
      stroke={color}
      stroke-width="0.839807"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7 1.5L7.75 5H10M3.75 4H7.5M5 1.5V4M1.5 3.5V9"
      stroke={color}
      stroke-width="0.839807"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
export default Stops;
