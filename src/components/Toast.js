import React from 'react';
import './Toast.css';

export default function Toast({id, title, body, color}) {
    return (
        <div id={id} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header" style={{backgroundColor: color}}>
                <strong className="mr-auto" style={{color: 'white'}}>{title}</strong>
                <button type="button" className="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className="toast-body">
                {body}
            </div>
        </div>
    )
}
