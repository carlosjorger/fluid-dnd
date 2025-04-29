import React from 'react';
import  './simpleNumberList.css';
import useDragAndDrop from '../../../src/react/useDragAndDrop';
const NumberList: React.FC = () => {
  const [parent, numbers, _, insertAt, removeAt] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3],{
    delayBeforeInsert: 250,
    removingClass: "removed",
  });
  const addNumber = () => {
    insertAt(numbers.length, numbers.length+1);
  };
  const removeNumber = (index: number) => {
    removeAt(index);
  }
  return (
    <div>
      <h2>Simple Number List</h2>
      <ul ref={parent} className='number-list'>
        {numbers.map((number, index) => (
          <li className='number' data-index={index} key={number}>
            {number}
            <button className='remove-button' onClick={() => removeNumber(index)}>x</button>
          </li>
        ))}
      </ul>
      <button onClick={addNumber}>Add Number</button>
    </div>
  );
};

export default NumberList;