import React from 'react'
import './SelectDrawer.css'
import {CSSTransition} from 'react-transition-group'


const SelectDrawer = ({children, open}) =>
    <div className={ 'select-drawer' } style={{display: open? 'initial': 'none'}}>
        <CSSTransition
            timeout={ {enter: 300, exit: 0} }
            in={ open }
            classNames={ 'drawer-slide' }
            unmountOnExit
        >
            { children }
        </CSSTransition>
    </div>

export default SelectDrawer
