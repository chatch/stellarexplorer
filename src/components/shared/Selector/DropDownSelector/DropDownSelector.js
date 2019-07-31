import React, {useState} from 'react'
import Selection from './Selection/Selection'
import SelectDrawer from './SelectDrawer/SelectDrawer'
import SelectItems from './SelectItems/SelectItems'



const DropDownSelector = ({options, setSelection, selected, placeHolderId}) => {
    const [_selected, setSelected] = useState(options.findIndex(value => value === selected))
    const [open, setOpen] = useState(false)

    const optionNames = options.map(option => option)


    const selectItem = (index) => {
        setSelected(index)
        setOpen(false)
        if (setSelection) {
            setSelection(options[index])
        }
    }


    const toggleOpen = () => {
        setOpen(!open)
    }

    return (
        <Selection open={open} selected={optionNames[_selected]} placeHolderId={placeHolderId} onClick={toggleOpen} clickOut={setOpen}>
            <SelectDrawer open={open}>
                <SelectItems onItemClick={selectItem} options={optionNames}/>
            </SelectDrawer>
        </Selection>
    )
}

export default DropDownSelector
