import React from 'react';
import  './simpleNumberList.css';
import useDragAndDrop from '../../../../src/react/useDragAndDrop';
const NumberList: React.FC = () => {
  const [parent1, numbers1] = useDragAndDrop<number, HTMLUListElement>([1, 2, 3],{
    delayBeforeInsert: 250,
    removingClass: "removed",
    droppableGroup: "group1",
  });
  const [parent2, numbers2] = useDragAndDrop<number, HTMLUListElement>([4, 5, 6],{
    delayBeforeInsert: 250,
    removingClass: "removed",
    droppableGroup: "group1",
  });
  return (
    <div>
      <h2>Group of lists</h2>
      <div className='group-container'>
        <ul ref={parent1} className='number-list'>
            {numbers1.map((number, index) => (
            <li className='number' data-index={index} key={number}>
                {number}
            </li>
            ))}
        </ul>
        <ul ref={parent2} className='number-list'>
            {numbers2.map((number, index) => (
            <li className='number' data-index={index} key={number}>
                {number}
            </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default NumberList;