import React from 'react'

export default class Popup extends React.Component {
        
    render() {
        const { items, isOpen, locationSelected} = this.props
        // Do not show popup
        if (!isOpen) return null;
        return (
            <div className='popup'>
                <div className='popup-container'>
                    <div className='popup-content'>
                        { items && 
                            items.map((item, idx) => {
                                return (
                                    <div className='popup-item' onClick={locationSelected} key={idx}>
                                        {item.name}
                                    </div>
                                )
                            })}
                        
                        { !items && <div className='popup-warning'>No results</div>} 
                    </div>
                </div>                
            </div>
        )
    }
}
