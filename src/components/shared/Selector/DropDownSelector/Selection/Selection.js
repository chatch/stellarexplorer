import React, {useEffect, useRef} from 'react'
import './Selection.css'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import {FormattedMessage} from 'react-intl'


const Selection = ({selected, placeHolderId, children, onClick, clickOut, open}) => {
    const node = useRef(null)
    const openStyle = open ? '0px' : '30px'
    const openTransfrom = open ? 'rotate(180deg)' : 'rotate(0deg)'

    const containerStyle = {borderBottomLeftRadius: openStyle, borderBottomRightRadius: openStyle}
    const iconStyle = {transform: openTransfrom}


    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!node.current.contains(e.target)) {
                clickOut(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [clickOut])


    return (
        <div className={'selected-container'} onClick={ () => onClick() } ref={ node } style={containerStyle}>
            <div className={'selected-text'} style={{color:'#96a2b4'}}>
                {selected ?  <span>{ selected }</span> : <FormattedMessage id={placeHolderId}/>}

                <Glyphicon glyph="chevron-down" style={iconStyle}/>
            </div>
            { children }
        </div>
    )

}

export default Selection



