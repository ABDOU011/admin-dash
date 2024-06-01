"// components/HotSpots.tsx"

import { useState } from 'react';


interface HotSpotsProps {
  cityId: number;
}

const HotSpots: React.FC<HotSpotsProps> = ({ cityId }) => {
  const [hotSpots, setHotSpots] = useState([{ name: '', description: '', cityId }]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedHotSpots = [...hotSpots];
    updatedHotSpots[index] = { ...updatedHotSpots[index], [name]: value, cityId };
    setHotSpots(updatedHotSpots);
  };

  const handleAddHotSpot = () => {
    setHotSpots([...hotSpots, { name: '', description: '', cityId }]);
  };

  const handleSubmit = async () => {
    
  };

  return (
    <div>
      {hotSpots.map((hotSpot, index) => (
        <div key={index}>
          <input
            type="text"
            name="name"
            placeholder="Hot Spot Name"
            value={hotSpot.name}
            onChange={(e) => handleChange(index, e)}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={hotSpot.description}
            onChange={(e) => handleChange(index, e)}
          />
        </div>
      ))}
      <button onClick={handleAddHotSpot}>Add New Hot Spot</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default HotSpots;
