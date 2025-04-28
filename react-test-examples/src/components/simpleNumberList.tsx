import React, { useState } from 'react';
import  './simpleNumberList.css';
const NumberList: React.FC = () => {
  const [numbers, setNumbers] = useState<number[]>([1, 2, 3]);

  const addNumber = () => {
    setNumbers([...numbers, numbers.length + 1]);
  };

  const removeNumber = () => {
    if (numbers.length > 0) {
      setNumbers(numbers.slice(0, -1));
    }
  };

  return (
    <div>
      <h2>Simple Number List</h2>
      <ul className='number-list'>
        {numbers.map((number) => (
          <li className='number' key={number}>
            {number}
          </li>
        ))}
      </ul>
      <button onClick={addNumber}>Add Number</button>
      <button onClick={removeNumber}>Remove Number</button>
    </div>
  );
};

export default NumberList;