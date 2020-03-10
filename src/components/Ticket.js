import React from 'react'
import ticket from '../assets/original.jpg'; // or ticket.jpeg
import './Ticket.css';

function Ticket({number}) {
    return (
        <div className="col-4">
              <div className="ticket-aspect-container">
                <div style={{backgroundImage: 'url(' + ticket + ')'}} className="ticket-image">
                    <h1 className="ticket-number">{getNumberStr(number)}</h1>
                </div>
              </div>
            </div>
    )
}

function getNumberStr (number) {
    return pad (number, 4);
}

function pad (str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
}

export default Ticket;