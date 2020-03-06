import React from 'react'
import chit from '../assets/chit.jpeg';
import './Chit.css';

function Chit({number}) {
    return (
        <div className="col-4">
              <div className="chit-aspect-container">
                <div style={{backgroundImage: 'url(' + chit + ')'}} className="chit-image">
                    <h1 className="chit-number">{getNumberStr(number)}</h1>
                </div>
              </div>
            </div>
    )
}

function getNumberStr (number) {
    return pad (number, 5);
}

function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

export default Chit;