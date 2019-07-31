import React from 'react'
import './SelectItems.css'


const SelectItem = ({option, onItemClick, index}) =>
    <li onClick={ () => onItemClick(index) }>{ option }</li>

const SelectItems = ({onItemClick, options}) => {
    const selectableItems = options.map((option, index) => (
        <SelectItem onItemClick={onItemClick} index={index} option={option} key={option}/>
    ))

    return (
        <ul className={ 'selectable-list' }>
            { selectableItems }
        </ul>
    )
}


export default SelectItems
