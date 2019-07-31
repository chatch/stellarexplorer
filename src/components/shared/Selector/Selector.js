import React from 'react'
import SelectorLayout from './SelectorLayout/SelectorLayout'
import DropDownSelector from './DropDownSelector/DropDownSelector'



const Selector = ({options, placeHolderId, setSelection, selected}) => {
    return (
        <SelectorLayout placeHolderId={placeHolderId}>
            <DropDownSelector options={options} setSelection={setSelection} selected={selected} placeHolderId={placeHolderId}/>
        </SelectorLayout>
    )
}

export default Selector
