import React, { Component } from 'react';
import './App.css';
import Chit from './components/Chit'
const electronRemote = window.require('electron').remote;
const Store = electronRemote.require('electron-store');
const store = new Store();
const MAX_NUMBER = 10000;

export default class App extends Component {

  constructor () {
    super();
    this.state = {
      number: store.get('number') === undefined ? 1 : store.get('number'),
      selectedPrinter: {name: 'Printers'},
      printers: [],
    }
  }

  componentDidMount () {
    this.loadPrinters ();
  }

  loadPrinters () {
    var printers =  electronRemote.getCurrentWindow().webContents.getPrinters();
    this.setState ({printers: printers});
    if (printers.length > 0)
      this.setState ({selectedPrinter: printers[0]});
  }

  render() {
    var chits = [];

    for (let index = 0; index < 9; index++) {
      chits.push(<Chit key={index} number={index + this.state.number}/>);
    }

    var page = (<div className="page unselectable">
                  <div className="row">
                    {chits}
                  </div>
                </div>);

    
    var printers = [];

    this.state.printers.forEach(printer => {
      printers.push(<div key={printer.name} className="dropdown-item" onClick={() => this.setState({selectedPrinter: printer})}>{printer.name}</div>);
    });
    
    var dropdown = (
      <div className="dropdown col-auto">
        <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {this.state.selectedPrinter.name}
        </button>
        <div className="dropdown-menu unselectable" aria-labelledby="dropdownMenuButton">
          {printers}
        </div>
      </div>
    );

    return (
      <div className="container pt-4">
        <div className="row">
          <span className="col-auto px-2 unselectable text">Number:</span>
          <input autoFocus type="number" max={MAX_NUMBER} min="1" placeholder="Number" value={this.state.number} className="col-2 input mx-2 text" onChange={(event) => this.setNumber (event)}/>
          <button onClick={() => this.increase ()} className="col-auto btn btn-primary mx-2">+9</button>
          
          <div className="col"></div>
          
          <span className="col-auto px-2 unselectable text">Printer:</span>
          {dropdown}
          <button onClick={() => this.print(false)} className="col-auto btn btn-warning mx-2">Print</button>
          <button onClick={() => this.print(true)} className="col-auto btn btn-success mx-2">Print and +9</button>
        </div>
        <div className="page-aspect-container mt-4">
          {page}
        </div>
      </div>
    );
  }

  print(increase) {
    electronRemote.getCurrentWindow().webContents.print ({silent: true, printBackground: true, deviceName: this.state.selectedPrinter.name});
    if (increase) {
      this.setState ({number: this.state.number + 9})
      store.set('number', this.state.number + 9);
    } else {
      store.set('number', this.state.number);
    }
  }

  increase () {
    this.setState ({number: this.state.number + 9})
      store.set('number', this.state.number + 9);
  }

  setNumber (event) {
    var number = parseInt(event.target.value);

    if (isNaN(number)) {
      number = 1;
    }

    if (number > MAX_NUMBER) {
      number = MAX_NUMBER;
    }
    if (number < 1) {
      number = 1;
    }
    
    this.setState({number: number});
  }

}